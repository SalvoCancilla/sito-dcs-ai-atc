import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server-side accessors for the signed-in user's account data.
 *
 * Every query uses `maybeSingle()`: a user with no profile row or no license
 * is a normal state (just-registered, never purchased) and must render as
 * "nothing yet", not as a 500.
 */

export interface AuthUser {
  id: string;
  email: string;
  display_name: string;
  is_active: boolean;
}

export interface LicenseInfo {
  id: string;
  plan: string;
  is_active: boolean;
  updates_until: string;
  active_device_count: number;
  max_devices: number;
}

export interface DeviceInfo {
  id: string;
  label: string;
  fingerprint: string;
  last_seen_at: string;
  created_at: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, is_active")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    email: user.email ?? "",
    display_name: profile?.display_name ?? "",
    is_active: profile?.is_active ?? true,
  };
}

export async function getLicense(): Promise<LicenseInfo | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("license_summary")
    .select("id, plan, is_active, updates_until, active_device_count, max_devices")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  return {
    id: data.id,
    plan: data.plan,
    is_active: data.is_active,
    updates_until: data.updates_until,
    active_device_count: data.active_device_count ?? 0,
    max_devices: data.max_devices ?? 2,
  };
}

export async function getDevices(): Promise<DeviceInfo[]> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: license } = await supabase
    .from("licenses")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!license) return [];

  const { data } = await supabase
    .from("devices")
    .select("id, label, fingerprint, last_seen_at, created_at")
    .eq("license_id", license.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as DeviceInfo[];
}
