import Link from "next/link";
import { Check, Shield, Zap, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { HudCorners } from "@/components/hud-corners";
import { FadeIn } from "@/components/motion";
import { FinalCta } from "@/components/final-cta";
import { CheckoutButton } from "@/components/checkout-button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRICE, FAQS } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, faqPageJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pricing",
  description:
    "Perpetual DCS AI ATC license at €49 with 1 year of updates included. No subscription, up to 2 devices.",
  path: "/pricing",
});

const BILLING_FAQS = [
  FAQS[3],
  FAQS[4],
  FAQS[5],
  FAQS[6],
];

const INCLUDED = [
  { icon: Zap, label: "Perpetual access to the current version" },
  { icon: RefreshCw, label: "1 year of updates included" },
  { icon: Shield, label: "Up to 2 associated devices" },
  { icon: Check, label: "Italian and English" },
  { icon: Check, label: "Email support and Discord community" },
  { icon: Check, label: "All ATC domains (Ground, Tower, Approach, Departure)" },
];

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(BILLING_FAQS)} />

      <div className="container py-16">
        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: "Pricing" }]}
        />
        <SectionHeader
          align="left"
          eyebrow="Pricing"
          title="One license. Forever."
          description="No subscription, no hidden cloud costs. Pay once and DCS AI ATC is yours, offline, forever."
        />
      </div>

      <section aria-labelledby="plan-title" className="container pb-16">
        <h2 id="plan-title" className="sr-only">License plan</h2>
        <FadeIn className="mx-auto max-w-xl">
          <Card className="relative border-radar/30 bg-card/50">
            <HudCorners />
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-radar">
                    {PRICE.label}
                  </p>
                  <p className="mt-3 text-5xl font-semibold">
                    {PRICE.currency}
                    {PRICE.amount}
                  </p>
                </div>
                <Badge variant="freq">One-time payment</Badge>
              </div>

              <ul className="mt-8 space-y-3 text-sm">
                {INCLUDED.map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-radar" />
                    <span className="text-muted-foreground">{item.label}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-3">
                <CheckoutButton className="w-full">
                  Buy now — {PRICE.currency}
                  {PRICE.amount}
                </CheckoutButton>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/register">Create an account</Link>
                </Button>
              </div>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Secure payment via Stripe. Your license is activated
                automatically after payment.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      <section
        aria-labelledby="billing-faq-title"
        className="border-t border-border/60 bg-cockpit-950 py-24"
      >
        <div className="container">
          <SectionHeader
            id="billing-faq-title"
            eyebrow="Billing FAQ"
            title="Questions about license and payments"
          />
          <FadeIn className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {BILLING_FAQS.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
