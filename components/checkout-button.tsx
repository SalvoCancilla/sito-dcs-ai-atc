"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

/**
 * Starts a Stripe checkout session by calling our /api/stripe/checkout proxy.
 * The proxy uses the httpOnly auth cookie, so the token never reaches the
 * browser. On success we redirect the user to the Stripe-hosted URL.
 */
export function CheckoutButton({
  children,
  variant = "radar",
  size = "lg",
  className,
}: {
  children: React.ReactNode;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  async function startCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          toast.error("You must sign in before purchasing.");
          router.push("/login?next=/pricing");
          return;
        }
        throw new Error(data.error || "Unable to start payment");
      }
      if (typeof data.url === "string" && data.url.length > 0) {
        window.location.href = data.url;
      } else {
        throw new Error("Checkout URL missing");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error during checkout",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={startCheckout}
      disabled={loading}
      variant={variant}
      size={size}
      className={className}
      aria-busy={loading}
    >
      {loading ? "Redirecting to Stripe…" : children}
    </Button>
  );
}
