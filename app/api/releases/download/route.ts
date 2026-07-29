import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Download endpoint — streams the installer from R2.
 *
 * Flow:
 *   1. Authenticate the user (Supabase session cookie).
 *   2. Check that the user has an active license.
 *   3. Look up the release by version (query param ?v=).
 *   4. Redirect to the R2 public URL for the asset.
 *
 * The R2 public base URL is configured via R2_PUBLIC_BASE env var.
 * Falls back to the known public URL if not set.
 */
const R2_PUBLIC_BASE =
  process.env.R2_PUBLIC_BASE ||
  "https://pub-db8212e605cb457c9304451c9d8728db.r2.dev";

export async function GET(req: NextRequest) {
  // 1. Authenticate
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login?next=/download", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Check active license
  const { data: license } = await supabase
    .from("licenses")
    .select("id, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!license) {
    return NextResponse.json(
      { error: "No active license. Purchase a license to download." },
      { status: 403 },
    );
  }

  // 3. Look up the release
  const version = req.nextUrl.searchParams.get("v");
  if (!version) {
    return NextResponse.json(
      { error: "Missing version parameter (?v=)" },
      { status: 400 },
    );
  }

  const { data: release, error } = await supabase
    .from("releases")
    .select("version, asset_key, is_listed, channel")
    .eq("version", version)
    .eq("is_listed", true)
    .maybeSingle();

  if (error || !release) {
    return NextResponse.json(
      { error: "Release not found", detail: error?.message },
      { status: 404 },
    );
  }

  // 4. Redirect to R2 public URL
  const downloadUrl = `${R2_PUBLIC_BASE}/${release.asset_key}`;
  return NextResponse.redirect(downloadUrl);
}
