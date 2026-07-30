import { NextRequest, NextResponse } from "next/server";

import { createSupabaseBearerClient } from "@/lib/supabase/server";
import { signClaims, licensingErrorStatus } from "@/lib/licensing";
import { bearerToken, jsonError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Re-issue signed claims for a device that is already bound.
 *
 * The desktop app calls this when its cached claims are close to expiry.
 * A revoked license or a device unbound from the account page makes the
 * RPC fail, which is how access is actually withdrawn once the offline
 * grace period lapses.
 */
export async function POST(req: NextRequest) {
  const token = bearerToken(req);
  if (!token) return jsonError("Missing bearer token", 401, "not_authenticated");

  let body: { fingerprint?: string; user_agent?: string };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400, "bad_request");
  }

  const fingerprint = (body.fingerprint ?? "").trim();
  if (fingerprint.length < 8) {
    return jsonError("Missing or malformed fingerprint", 400, "bad_fingerprint");
  }

  const supabase = createSupabaseBearerClient(token);
  const { data, error } = await supabase.rpc("refresh_license", {
    p_fingerprint: fingerprint,
    p_user_agent: (body.user_agent ?? "").slice(0, 256),
  });

  if (error) {
    const { status, code } = licensingErrorStatus(error.message);
    return jsonError(error.message, status, code);
  }

  try {
    return NextResponse.json(signClaims(data));
  } catch (e) {
    // Signing depends on server-only env (LICENSE_SIGNING_PRIVATE_KEY_PEM):
    // surface the real cause instead of an opaque empty 500.
    console.error("[license] claim signing failed:", e);
    return jsonError(
      e instanceof Error ? e.message : "Claim signing failed",
      500,
      "signing_failed",
    );
  }
}
