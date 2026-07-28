import { createSupabaseServerClient } from "@/lib/supabase/server";

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

export interface ReleaseInfo {
  version: string;
  channel: string;
  platform: string;
  changelog: string;
  download_url: string;
  size_bytes: number;
  sha256: string;
  signature_hex: string;
  is_mandatory: boolean;
  created_at: string;
  assets: Array<{
    name: string;
    download_url: string;
    size_bytes: number;
    sha256: string;
  }>;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch profile for display_name / is_active
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, is_active")
    .eq("id", user.id)
    .single();

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
    .single();

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

  // Get the user's active license first
  const { data: license } = await supabase
    .from("licenses")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (!license) return [];

  const { data } = await supabase
    .from("devices")
    .select("id, label, fingerprint, last_seen_at, created_at")
    .eq("license_id", license.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as DeviceInfo[];
}

export async function getLatestRelease(): Promise<ReleaseInfo | null> {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("releases")
    .select(
      "version, channel, platform, changelog, asset_size_bytes, asset_sha256, signature_hex, is_mandatory, created_at, release_assets(name, asset_size_bytes, asset_sha256)",
    )
    .eq("is_listed", true)
    .eq("channel", "stable")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) return null;

  // Build download URL — in production this would be a Supabase Storage
  // signed URL or CDN URL. For now, use a placeholder.
  const downloadUrl = `/api/releases/download?v=${data.version}`;

  return {
    version: data.version,
    channel: data.channel,
    platform: data.platform,
    changelog: data.changelog ?? "",
    download_url: downloadUrl,
    size_bytes: data.asset_size_bytes ?? 0,
    sha256: data.asset_sha256 ?? "",
    signature_hex: data.signature_hex ?? "",
    is_mandatory: data.is_mandatory ?? false,
    created_at: data.created_at ?? "",
    assets: (data.release_assets ?? []).map((a: Record<string, unknown>) => ({
      name: a.name as string,
      download_url: downloadUrl,
      size_bytes: a.asset_size_bytes as number,
      sha256: a.asset_sha256 as string,
    })),
  };
}
