-- =====================================================================
-- DCS AI ATC — Supabase schema
-- Run this in the Supabase SQL Editor after creating your project.
-- =====================================================================

-- ---------- profiles (extends auth.users) ----------------------------
-- Supabase Auth manages users in auth.users. We add a profiles table
-- for app-specific fields (display_name, stripe_customer_id, etc.).
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text default '',
  is_active    boolean default true,
  is_admin     boolean default false,
  stripe_customer_id text,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- Auto-create a profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- licenses -------------------------------------------------
create table if not exists public.licenses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  plan            text default 'perpetual',
  stripe_payment_intent_id text,
  stripe_subscription_id   text,
  is_active       boolean default true,
  revocation_version integer default 1,
  updates_until   timestamptz not null,
  created_at      timestamptz default now()
);

create index if not exists idx_licenses_user_id on public.licenses(user_id);

-- ---------- devices --------------------------------------------------
create table if not exists public.devices (
  id              uuid primary key default gen_random_uuid(),
  license_id      uuid not null references public.licenses(id) on delete cascade,
  label           text default 'PC',
  fingerprint     text not null,
  last_ip         text,
  last_user_agent text,
  last_seen_at    timestamptz default now(),
  created_at      timestamptz default now()
);

create index if not exists idx_devices_license_id on public.devices(license_id);
create index if not exists idx_devices_fingerprint on public.devices(fingerprint);

-- ---------- releases -------------------------------------------------
create table if not exists public.releases (
  id              uuid primary key default gen_random_uuid(),
  version         text unique not null,
  channel         text default 'stable',
  platform        text default 'windows',
  changelog       text default '',
  asset_key       text not null,
  asset_size_bytes bigint default 0,
  asset_sha256    text not null,
  signature_hex   text default '',
  is_mandatory    boolean default false,
  is_listed       boolean default true,
  created_at      timestamptz default now()
);

create table if not exists public.release_assets (
  id              uuid primary key default gen_random_uuid(),
  release_id      uuid not null references public.releases(id) on delete cascade,
  name            text not null,
  asset_key       text not null,
  asset_size_bytes bigint default 0,
  asset_sha256    text not null
);

create index if not exists idx_release_assets_release_id on public.release_assets(release_id);

-- =====================================================================
-- Row Level Security
-- =====================================================================

alter table public.profiles   enable row level security;
alter table public.licenses   enable row level security;
alter table public.devices    enable row level security;
alter table public.releases   enable row level security;
alter table public.release_assets enable row level security;

-- profiles: user can read/update only their own profile
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- licenses: user can read only their own licenses
create policy "licenses_select_own" on public.licenses
  for select using (auth.uid() = user_id);

-- devices: user can read/delete devices on their own licenses
create policy "devices_select_own" on public.devices
  for select using (
    exists (
      select 1 from public.licenses l
      where l.id = devices.license_id and l.user_id = auth.uid()
    )
  );
create policy "devices_delete_own" on public.devices
  for delete using (
    exists (
      select 1 from public.licenses l
      where l.id = devices.license_id and l.user_id = auth.uid()
    )
  );

-- releases: public read access (anyone can see the latest release info)
create policy "releases_select_all" on public.releases
  for select using (true);
create policy "release_assets_select_all" on public.release_assets
  for select using (true);

-- ---------- support tickets ------------------------------------------
create table if not exists public.support_tickets (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  source      text default 'website',
  status      text default 'open',
  created_at  timestamptz default now()
);

-- Anyone (including anonymous) can create a support ticket
alter table public.support_tickets enable row level security;
create policy "support_tickets_insert_all" on public.support_tickets
  for insert with check (true);

-- =====================================================================
-- Helpful view: license summary with device count
-- =====================================================================
create or replace view public.license_summary as
select
  l.id,
  l.user_id,
  l.plan,
  l.is_active,
  l.updates_until,
  l.created_at,
  count(d.id) as active_device_count,
  2 as max_devices
from public.licenses l
left join public.devices d on d.license_id = l.id
group by l.id;
