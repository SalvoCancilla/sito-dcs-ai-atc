/**
 * Server-side helpers for proxying requests to the licensing backend.
 * The token is NEVER exposed to the client: it lives in an httpOnly cookie.
 */

export const AUTH_COOKIE = "daa_auth";
export const REFRESH_COOKIE = "daa_refresh";

export const apiBaseUrl = (): string =>
  (process.env.LICENSING_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export const siteUrl = (): string =>
  (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export interface ApiError {
  status: number;
  message: string;
  detail?: unknown;
}

export class BackendError extends Error {
  status: number;
  detail?: unknown;
  constructor(status: number, message: string, detail?: unknown) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

interface ProxyOptions {
  method?: string;
  body?: unknown;
  token?: string | null | undefined;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
}

export async function backendFetch<T = unknown>(
  path: string,
  opts: ProxyOptions = {},
): Promise<T> {
  const url = `${apiBaseUrl()}${path}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(opts.headers ?? {}),
  };
  if (opts.body !== undefined && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  if (opts.token) {
    headers.Authorization = `Bearer ${opts.token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      cache: opts.cache,
      next: opts.next,
    });
  } catch (err) {
    throw new BackendError(502, "Backend unreachable", String(err));
  }

  if (!res.ok) {
    let detail: unknown;
    try {
      detail = await res.json();
    } catch {
      detail = await res.text().catch(() => undefined);
    }
    const message =
      (detail && typeof detail === "object" && "detail" in detail
        ? String((detail as { detail: unknown }).detail)
        : res.statusText) || `Errore ${res.status}`;
    throw new BackendError(res.status, message, detail);
  }

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

export function jsonError(err: unknown) {
  if (err instanceof BackendError) {
    return new Response(
      JSON.stringify({ error: err.message, detail: err.detail }),
      { status: err.status, headers: { "Content-Type": "application/json" } },
    );
  }
  return new Response(JSON.stringify({ error: "Internal error" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}

/** Cookie options shared by login/register/refresh flows. */
export const authCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge,
  domain: process.env.AUTH_COOKIE_DOMAIN || undefined,
});
