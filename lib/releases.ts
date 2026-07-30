import { createSupabasePublicClient } from "@/lib/supabase/server";

/**
 * Release metadata — the single place that reads the `releases` table.
 *
 * Both the website pages and the JSON API served to the desktop app go
 * through here, so there is one query and one shape to keep in sync.
 */
export interface ReleaseInfo {
  version: string;
  channel: string;
  platform: string;
  changelog: string;
  /** Site-relative path; the route authorises then redirects to R2. */
  download_url: string;
  size_bytes: number;
  sha256: string;
  signature_hex: string;
  is_mandatory: boolean;
  min_app_version: string;
  created_at: string;
}

/** Path clients hit to download a given version (auth + license enforced there). */
export const downloadPath = (version: string): string =>
  `/api/releases/download?v=${encodeURIComponent(version)}`;

/**
 * Latest listed release for a channel, or null when none is published.
 *
 * Returns null rather than throwing so callers can render an honest "no
 * release available" state instead of a 500. Previously this fell back to a
 * hardcoded v1.0.1 payload, which silently served stale metadata — and stale
 * hashes break the updater's integrity check.
 */
export async function getLatestRelease(
  channel = "stable",
): Promise<ReleaseInfo | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("releases")
    .select(
      "version, channel, platform, changelog, asset_size_bytes, asset_sha256, signature_hex, is_mandatory, min_app_version, created_at",
    )
    .eq("is_listed", true)
    .eq("channel", channel)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[releases] query failed:", error.message);
    return null;
  }
  if (!data) return null;

  return {
    version: data.version,
    channel: data.channel ?? channel,
    platform: data.platform ?? "windows",
    changelog: data.changelog ?? "",
    download_url: downloadPath(data.version),
    size_bytes: data.asset_size_bytes ?? 0,
    sha256: data.asset_sha256 ?? "",
    signature_hex: data.signature_hex ?? "",
    is_mandatory: data.is_mandatory ?? false,
    min_app_version: data.min_app_version ?? "0.0.0",
    created_at: data.created_at ?? "",
  };
}

/**
 * R2 object key for a published version, or null if unknown/unlisted.
 *
 * Kept out of {@link ReleaseInfo} on purpose: the public metadata endpoint
 * must not hand out the storage layout. Only the download route, after it
 * has checked sign-in and licensing, resolves the key.
 */
export async function getReleaseAssetKey(version: string): Promise<string | null> {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("releases")
    .select("asset_key")
    .eq("version", version)
    .eq("is_listed", true)
    .maybeSingle();

  if (error) {
    console.error("[releases] asset key query failed:", error.message);
    return null;
  }
  return data?.asset_key ?? null;
}
