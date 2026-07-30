import { NextRequest, NextResponse } from "next/server";

import { createSupabaseBearerClient } from "@/lib/supabase/server";
import { signClaims, licensingErrorStatus } from "@/lib/licensing";
import { bearerToken, jsonError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Bind the caller's machine to their license and return signed claims.
 *
 * Called by the desktop app during first-run activation. The app has
 * already signed in against Supabase Auth and sends that access token as
 * a Bearer header; the device cap is enforced inside the activate_device
 * RPC so the client cannot talk its way past it.
 */
export async function POST(req: NextRequest) {
  const token = bearerToken(req);
  if (!token) return jsonError("Missing bearer token", 401, "not_authenticated");

  let body: { fingerprint?: string; label?: string; user_agent?: string };
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
  const { data, error } = await supabase.rpc("activate_device", {
    p_fingerprint: fingerprint,
    p_label: (body.label ?? "PC").slice(0, 64),
    p_user_agent: (body.user_agent ?? "").slice(0, 256),
  });

  if (error) {
    const { status, code } = licensingErrorStatus(error.message);
    return jsonError(error.message, status, code);
  }

  return NextResponse.json(signClaims(data));
}
