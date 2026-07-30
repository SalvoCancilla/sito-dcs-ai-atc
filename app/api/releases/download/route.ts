import { NextRequest, NextResponse } from "next/server";

import {
  createSupabaseServerClient,
  createSupabaseBearerClient,
} from "@/lib/supabase/server";
import { getReleaseAssetKey } from "@/lib/releases";
import { bearerToken, jsonError } from "@/lib/api";
import { r2PublicBase } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Authorise an installer download, then redirect to R2.
 *
 * Serves two callers: the website (browser session cookie) and the desktop
 * app's auto-updater (Bearer access token). Both must be signed in and hold
 * an active license.
 */
export async function GET(req: NextRequest) {
  const token = bearerToken(req);
  const supabase = token
    ? createSupabaseBearerClient(token)
    : createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // API clients want a status code; browsers want the login page.
    if (token) return jsonError("Not signed in", 401, "not_authenticated");
    return NextResponse.redirect(new URL("/login?next=/download", req.url));
  }

  const { data: license } = await supabase
    .from("licenses")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (!license) {
    return jsonError(
      "No active license. Purchase a license to download.",
      403,
      "no_license",
    );
  }

  const version = req.nextUrl.searchParams.get("v");
  if (!version) {
    return jsonError("Missing version parameter (?v=)", 400, "bad_request");
  }

  const assetKey = await getReleaseAssetKey(version);
  if (!assetKey) {
    return jsonError(`Release ${version} not found`, 404, "not_found");
  }

  return NextResponse.redirect(`${r2PublicBase()}/${assetKey}`);
}
