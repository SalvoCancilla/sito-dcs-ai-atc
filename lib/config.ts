/**
 * Server-side configuration.
 *
 * One place to read and validate the environment, so a missing variable
 * surfaces as a clear error at the call site instead of silently falling
 * back to some other environment's value. Public Supabase settings live in
 * `lib/supabase/config.ts` because they must also be reachable from client
 * components.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not configured. Set it in the Vercel project environment ` +
        `(or .env at the repo root for local development).`,
    );
  }
  return value;
}

/**
 * Public base URL of the R2 bucket holding installers and ML models.
 * e.g. https://pub-<hash>.r2.dev — or a custom domain once one is attached.
 */
export const r2PublicBase = (): string => required("R2_PUBLIC_BASE").replace(/\/$/, "");

/** Stripe secret key (server only — never expose to the browser). */
export const stripeSecretKey = (): string => required("STRIPE_SECRET_KEY");

/** Price ID for the one-off perpetual licence. */
export const stripePriceId = (): string => required("STRIPE_PRICE_ID_PERPETUAL");

/** Signing secret used to authenticate Stripe webhook deliveries. */
export const stripeWebhookSecret = (): string => required("STRIPE_WEBHOOK_SECRET");
