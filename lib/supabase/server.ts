import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 * Reads the access token from the cookie set by the browser client.
 */
export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

/**
 * Plain Supabase client without cookie/session management.
 * Use for public route handlers (releases, support tickets) that don't
 * need user auth context. Avoids the @supabase/ssr ByteString header bug
 * on Vercel serverless when no session cookie is present.
 */
export function createSupabasePublicClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });
}

/**
 * Supabase client authenticated with a caller-supplied access token.
 *
 * Used by the licensing endpoints the desktop app calls: the app signs in
 * against Supabase Auth directly, then sends its access token as a Bearer
 * header. Running RLS and the security-definer RPCs as that user means the
 * app can only ever touch its own license.
 */
export function createSupabaseBearerClient(accessToken: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

/**
 * Service-role client. Bypasses RLS entirely — only for trusted server-side
 * flows that act on behalf of no particular user (the Stripe webhook
 * provisioning a license). Never import this from client code.
 */
export function createSupabaseAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Supabase client for Route Handlers that need to set cookies on the response.
 * Pass the NextResponse so cookies are written to it.
 */
export function createSupabaseRouteClient(res: import("next/server").NextResponse) {
  const cookieStore = cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options),
        );
      },
    },
  });
}
