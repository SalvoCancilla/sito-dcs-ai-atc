import { NextRequest } from "next/server";

/**
 * Small shared helpers for route handlers.
 *
 * This module used to proxy every request to a standalone FastAPI licensing
 * backend. That backend has been retired — Supabase is now the single source
 * of truth and the route handlers talk to it directly — so only the generic
 * helpers remain.
 */

export const siteUrl = (): string =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

/** Extract the token from an `Authorization: Bearer <token>` header. */
export function bearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;
  return token.trim() || null;
}

/**
 * JSON error response with a stable machine-readable `code` alongside the
 * human-readable message, so the desktop client can branch on the code
 * instead of pattern-matching prose.
 */
export function jsonError(message: string, status = 500, code = "error") {
  return new Response(JSON.stringify({ error: message, code }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
