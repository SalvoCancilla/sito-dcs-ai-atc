import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { stripeSecretKey, stripeWebhookSecret } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Stripe webhook — provisions and revokes licenses.
 *
 * This replaces the webhook that lived in the retired FastAPI backend, so
 * that a purchase lands in the same Supabase database the website and the
 * desktop app read from. Previously payments created users in a separate
 * Postgres instance, which meant a customer who bought on the site could
 * not sign in to the app.
 *
 * Uses the service-role key: there is no end-user session on a webhook
 * request, and the handler must write rows it does not own.
 */

/** Free-update window granted with a perpetual license. */
const UPDATE_WINDOW_YEARS = 2;

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  // Signature verification needs the exact bytes Stripe signed, so read the
  // raw body — parsing it first would invalidate the check.
  const payload = await req.text();
  const stripe = new Stripe(stripeSecretKey());

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, stripeWebhookSecret());
  } catch (err) {
    console.error("[stripe] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await grantLicense(event.data.object as Stripe.Checkout.Session);
        break;
      case "charge.refunded":
        await revokeByPaymentIntent(
          (event.data.object as Stripe.Charge).payment_intent as string | null,
        );
        break;
      default:
        // Everything else is acknowledged and ignored on purpose.
        break;
    }
  } catch (err) {
    // Returning 500 makes Stripe retry with backoff, which is what we want
    // for a transient Supabase failure.
    console.error(`[stripe] handler for ${event.type} failed:`, err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function grantLicense(session: Stripe.Checkout.Session): Promise<void> {
  const email = session.customer_details?.email ?? session.customer_email;
  if (!email) {
    console.error("[stripe] checkout session has no email; cannot grant license");
    return;
  }

  const supabase = createSupabaseAdminClient();
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : null;

  // Idempotency: Stripe redelivers events, so never grant twice for the
  // same payment.
  if (paymentIntentId) {
    const { data: existing } = await supabase
      .from("licenses")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntentId)
      .maybeSingle();
    if (existing) {
      console.info(`[stripe] license already provisioned for ${paymentIntentId}`);
      return;
    }
  }

  const userId = await resolveUserId(supabase, email);
  if (!userId) return;

  const updatesUntil = new Date();
  updatesUntil.setFullYear(updatesUntil.getFullYear() + UPDATE_WINDOW_YEARS);

  const { error } = await supabase.from("licenses").insert({
    user_id: userId,
    plan: "perpetual",
    stripe_payment_intent_id: paymentIntentId,
    is_active: true,
    updates_until: updatesUntil.toISOString(),
  });
  if (error) throw new Error(`license insert failed: ${error.message}`);

  if (typeof session.customer === "string") {
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: session.customer })
      .eq("id", userId);
  }

  console.info(`[stripe] license granted to ${email}`);
}

/**
 * Find the auth user for an email, inviting them if they bought without
 * registering first. An invite lets them choose their own password —
 * assigning a random one would leave them unable to sign in.
 */
async function resolveUserId(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  email: string,
): Promise<string | null> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .maybeSingle();
  if (profile) return profile.id;

  const { data: invited, error } = await supabase.auth.admin.inviteUserByEmail(email);
  if (error) {
    // Losing a race with a concurrent signup is fine — re-read the profile.
    const { data: retry } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    if (retry) return retry.id;
    throw new Error(`could not resolve or invite user ${email}: ${error.message}`);
  }
  return invited.user?.id ?? null;
}

async function revokeByPaymentIntent(paymentIntentId: string | null): Promise<void> {
  if (!paymentIntentId) return;

  const supabase = createSupabaseAdminClient();
  // Bumping revocation_version invalidates signed claims the client may
  // still hold, on top of flipping is_active.
  const { error } = await supabase.rpc("revoke_license_by_payment", {
    p_payment_intent_id: paymentIntentId,
  });
  if (error) throw new Error(`revoke failed: ${error.message}`);

  console.info(`[stripe] license revoked for ${paymentIntentId}`);
}
