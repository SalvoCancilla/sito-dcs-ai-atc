import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion";
import { PRICE } from "@/lib/content";

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 bg-cockpit-950 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hud-grid opacity-50"
      />
      <div className="container relative">
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Ready to pick up the radio?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Activate DCS AI ATC in minutes. Perpetual license, no cloud
            subscription, offline play.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" variant="radar">
              <Link href="/pricing">
                Buy now — {PRICE.currency}{PRICE.amount}
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/features">Explore features</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
