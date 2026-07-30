import { createPrivateKey, sign } from "node:crypto";

/**
 * License claim signing.
 *
 * The desktop client caches its license locally so it can start without a
 * network round-trip. To stop the cached state from being hand-edited, the
 * server signs the claims with an Ed25519 private key that only lives in
 * Vercel's environment; the client verifies with the public key compiled
 * into the binary.
 *
 * This raises the bar rather than making tampering impossible — the user
 * controls the machine and could patch the binary. It does mean a plain
 * text-editor edit of the cached claims is rejected.
 *
 * The canonical message is a pipe-delimited string rather than JSON so
 * that Node and Python produce byte-identical input without depending on
 * matching JSON key ordering or whitespace rules.
 */
export interface LicenseClaims {
  user_id: string;
  license_id: string;
  plan: string;
  fingerprint: string;
  /** Claims expiry — the offline grace period. ISO8601 UTC. */
  expires_at: string;
  /** End of the free-update window. ISO8601 UTC. */
  updates_until: string;
  max_devices: number;
  revocation_version: number;
}

/** Offline grace period: how long cached claims stay valid without a refresh. */
export const CLAIMS_TTL_DAYS = 30;

/** Normalise to `YYYY-MM-DDTHH:MM:SSZ` so both languages agree on the bytes. */
function isoSeconds(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid date in license claims: ${String(value)}`);
  }
  return `${d.toISOString().slice(0, 19)}Z`;
}

export function canonicalClaims(claims: LicenseClaims): string {
  return [
    "v1",
    claims.user_id,
    claims.license_id,
    claims.plan,
    claims.fingerprint,
    isoSeconds(claims.expires_at),
    isoSeconds(claims.updates_until),
    String(claims.max_devices),
    String(claims.revocation_version),
  ].join("|");
}

function privateKey() {
  const pem = process.env.LICENSE_SIGNING_PRIVATE_KEY_PEM;
  if (!pem) {
    throw new Error(
      "LICENSE_SIGNING_PRIVATE_KEY_PEM is not configured - cannot sign license claims",
    );
  }
  // Vercel env vars collapse newlines; accept the \n-escaped form too.
  return createPrivateKey(pem.includes("\\n") ? pem.replace(/\\n/g, "\n") : pem);
}

/**
 * Build the signed payload handed to the desktop client. `expires_at` is
 * derived here so the client cannot influence its own grace period.
 */
export function signClaims(
  base: Omit<LicenseClaims, "expires_at">,
): { claims: LicenseClaims; signature_hex: string } {
  const expiresAt = new Date(Date.now() + CLAIMS_TTL_DAYS * 24 * 3600 * 1000);

  const claims: LicenseClaims = {
    ...base,
    expires_at: isoSeconds(expiresAt),
    updates_until: isoSeconds(base.updates_until),
  };

  const signature = sign(null, Buffer.from(canonicalClaims(claims), "utf8"), privateKey());
  return { claims, signature_hex: signature.toString("hex") };
}

/**
 * Maps a Postgres error raised by activate_device/refresh_license onto an
 * HTTP status plus a stable machine-readable code the client branches on.
 */
export function licensingErrorStatus(message: string): { status: number; code: string } {
  const known: Record<string, number> = {
    not_authenticated: 401,
    bad_fingerprint: 400,
    no_license: 403,
    device_limit_reached: 409,
    device_unbound: 403,
    revoked: 403,
  };
  for (const [code, status] of Object.entries(known)) {
    if (message.includes(code)) return { status, code };
  }
  return { status: 500, code: "server_error" };
}
