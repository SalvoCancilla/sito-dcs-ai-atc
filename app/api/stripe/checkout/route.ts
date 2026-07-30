import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { stripeSecretKey, stripePriceId } from "@/lib/config";
import { siteUrl, jsonError } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Start a Stripe Checkout session for the signed-in user. */
export async function POST(_req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return jsonError("Not authenticated", 401, "not_authenticated");

  // Refuse to sell a second license to someone who already owns one.
  const { data: existing } = await supabase
    .from("licenses")
    .select("id")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return jsonError("You already own an active license", 409, "already_licensed");
  }

  try {
    const stripe = new Stripe(stripeSecretKey());
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: user.email ?? undefined,
      line_items: [{ price: stripePriceId(), quantity: 1 }],
      success_url: `${siteUrl()}/success`,
      cancel_url: `${siteUrl()}/cancel`,
      // The webhook matches on email, but carrying the id lets us correlate
      // a payment with an account even if the customer edits their email.
      metadata: { supabase_user_id: user.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[stripe] checkout session failed:", err);
    const message = err instanceof Error ? err.message : "Stripe error";
    // A missing key is a deployment problem, not a client problem.
    const status = message.includes("is not configured") ? 503 : 500;
    return jsonError(message, status, "stripe_error");
  }
}
