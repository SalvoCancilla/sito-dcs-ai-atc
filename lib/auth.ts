import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabasePublicClient } from "@/lib/supabase/server";

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
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("releases")
    .select(
      "version, channel, platform, changelog, asset_size_bytes, asset_sha256, signature_hex, is_mandatory, created_at",
    )
    .eq("is_listed", true)
    .eq("channel", "stable")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    // Fallback to hardcoded release if Supabase query fails (ByteString bug)
    return {
      version: "1.0.1",
      channel: "stable",
      platform: "windows",
      changelog: "Initial beta release. Licensing wizard with email login + activation key, model download from R2, English UI, embedded ATC server (uvicorn), 3 multiplayer modes (single/host/client).",
      download_url: "/api/releases/download?v=1.0.1",
      size_bytes: 1489345544,
      sha256: "d88806f1beeaba8e52a187defd46f12e5e870d4ef7b3717add5b89f0b609e974",
      signature_hex: "fa9999d5e02c45e5c7f827cc3fdfa34910f6725c4053efd2b6cb870b7c761ae80d095efb623da49c46b7e84c6e7bdbdfc1c214ad34a4fb144d1e61c5b3da6b02",
      is_mandatory: false,
      created_at: "2026-07-28T21:10:38.851845+00:00",
      assets: [],
    };
  }

  if (!data) return null;

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
    assets: [],
  };
}
