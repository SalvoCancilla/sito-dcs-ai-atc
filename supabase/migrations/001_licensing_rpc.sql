-- =====================================================================
-- DCS AI ATC — Migration 001: licensing RPC + model manifest
--
-- Makes Supabase the single source of truth for licensing. Replaces the
-- device-binding / license-refresh logic that used to live in the
-- standalone FastAPI backend.
--
-- Apply in the Supabase SQL Editor (idempotent, safe to re-run).
-- =====================================================================

-- ---------- schema additions ----------------------------------------

-- Per-license device cap (was hardcoded to 2 in the license_summary view).
alter table public.licenses
  add column if not exists max_devices integer not null default 2;

-- Minimum app version allowed to run. Builds older than this are forced
-- to update by the auto-updater.
alter table public.releases
  add column if not exists min_app_version text default '0.0.0';

-- A device fingerprint must be bound at most once per license.
create unique index if not exists uq_devices_license_fingerprint
  on public.devices (license_id, fingerprint);

-- ---------- model manifest ------------------------------------------
-- The ML model manifest (~390 files, 1.7 GB) used by the client to sync
-- models from R2. Stored as jsonb so it can be published atomically.
create table if not exists public.model_manifests (
  id               uuid primary key default gen_random_uuid(),
  manifest_version integer not null,
  is_current       boolean not null default false,
  manifest         jsonb not null,
  created_at       timestamptz default now()
);

create unique index if not exists uq_model_manifests_current
  on public.model_manifests (is_current) where is_current;

alter table public.model_manifests enable row level security;

drop policy if exists "model_manifests_select_all" on public.model_manifests;
create policy "model_manifests_select_all" on public.model_manifests
  for select using (true);

-- =====================================================================
-- RPC: activate_device
--
-- Binds the calling user's current machine to their active license and
-- returns the license claims the client needs. Enforces the per-license
-- device cap server-side.
--
-- SECURITY DEFINER because it must read/write across licenses+devices
-- for the caller; auth.uid() is checked explicitly so a caller can only
-- ever act on their own license.
-- =====================================================================
create or replace function public.activate_device(
  p_fingerprint text,
  p_label       text default 'PC',
  p_user_agent  text default ''
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user    uuid := auth.uid();
  v_license public.licenses;
  v_device  public.devices;
  v_count   integer;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;
  if p_fingerprint is null or length(p_fingerprint) < 8 then
    raise exception 'bad_fingerprint';
  end if;

  select * into v_license
    from public.licenses
   where user_id = v_user
     and is_active
   order by created_at desc
   limit 1;

  if not found then
    raise exception 'no_license';
  end if;

  -- Already bound? Just refresh the last-seen metadata.
  select * into v_device
    from public.devices
   where license_id = v_license.id
     and fingerprint = p_fingerprint
   limit 1;

  if found then
    update public.devices
       set last_seen_at    = now(),
           last_user_agent = p_user_agent,
           label           = coalesce(nullif(p_label, ''), label)
     where id = v_device.id
    returning * into v_device;
  else
    select count(*) into v_count
      from public.devices
     where license_id = v_license.id;

    if v_count >= v_license.max_devices then
      raise exception 'device_limit_reached';
    end if;

    insert into public.devices (license_id, label, fingerprint, last_user_agent)
    values (v_license.id, coalesce(nullif(p_label, ''), 'PC'), p_fingerprint, p_user_agent)
    returning * into v_device;
  end if;

  return jsonb_build_object(
    'user_id',            v_user,
    'license_id',         v_license.id,
    'plan',               v_license.plan,
    'updates_until',      v_license.updates_until,
    'max_devices',        v_license.max_devices,
    'revocation_version', coalesce(v_license.revocation_version, 1),
    'device_id',          v_device.id,
    'fingerprint',        v_device.fingerprint
  );
end;
$$;

-- =====================================================================
-- RPC: refresh_license
--
-- Re-validates an already-bound device. Fails if the license was revoked
-- or the device was unbound from the account area, which is what stops a
-- cancelled/refunded user from running the app past their offline grace
-- period.
-- =====================================================================
create or replace function public.refresh_license(
  p_fingerprint text,
  p_user_agent  text default ''
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user    uuid := auth.uid();
  v_license public.licenses;
  v_device  public.devices;
begin
  if v_user is null then
    raise exception 'not_authenticated';
  end if;

  select * into v_license
    from public.licenses
   where user_id = v_user
     and is_active
   order by created_at desc
   limit 1;

  if not found then
    raise exception 'revoked';
  end if;

  select * into v_device
    from public.devices
   where license_id = v_license.id
     and fingerprint = p_fingerprint
   limit 1;

  if not found then
    raise exception 'device_unbound';
  end if;

  update public.devices
     set last_seen_at    = now(),
         last_user_agent = p_user_agent
   where id = v_device.id
  returning * into v_device;

  return jsonb_build_object(
    'user_id',            v_user,
    'license_id',         v_license.id,
    'plan',               v_license.plan,
    'updates_until',      v_license.updates_until,
    'max_devices',        v_license.max_devices,
    'revocation_version', coalesce(v_license.revocation_version, 1),
    'device_id',          v_device.id,
    'fingerprint',        v_device.fingerprint
  );
end;
$$;

revoke all on function public.activate_device(text, text, text) from public, anon;
revoke all on function public.refresh_license(text, text)       from public, anon;
grant execute on function public.activate_device(text, text, text) to authenticated;
grant execute on function public.refresh_license(text, text)       to authenticated;

-- =====================================================================
-- RPC: revoke_license_by_payment
--
-- Called by the Stripe webhook on refund. Bumping revocation_version (as
-- well as clearing is_active) invalidates any signed claims the client may
-- still be holding, so a refunded user loses access at their next refresh
-- rather than at the end of the offline grace period.
--
-- Intentionally NOT granted to `authenticated`: only the service role may
-- execute it.
-- =====================================================================
create or replace function public.revoke_license_by_payment(
  p_payment_intent_id text
) returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_affected integer;
begin
  update public.licenses
     set is_active          = false,
         revocation_version = coalesce(revocation_version, 1) + 1
   where stripe_payment_intent_id = p_payment_intent_id
     and is_active;

  get diagnostics v_affected = row_count;
  return v_affected;
end;
$$;

revoke all on function public.revoke_license_by_payment(text) from public, anon, authenticated;

-- =====================================================================
-- license_summary: honour the per-license device cap instead of the
-- previous hardcoded 2.
-- =====================================================================
create or replace view public.license_summary as
select
  l.id,
  l.user_id,
  l.plan,
  l.is_active,
  l.updates_until,
  l.created_at,
  count(d.id)   as active_device_count,
  l.max_devices as max_devices
from public.licenses l
left join public.devices d on d.license_id = l.id
group by l.id;
