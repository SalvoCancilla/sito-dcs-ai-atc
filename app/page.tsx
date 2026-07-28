import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, Radar } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion";
import { SectionHeader } from "@/components/section-header";
import { FeatureIcon } from "@/components/feature-icon";
import { FinalCta } from "@/components/final-cta";
import { HudCorners } from "@/components/hud-corners";
import { RadarSweep } from "@/components/radar-sweep";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  FEATURES,
  HOW_IT_WORKS,
  FAQS_FOR_LANDING,
  AWACS_CAPABILITIES,
  ROADMAP,
  PRICE,
} from "@/lib/content";
import {
  JsonLd,
  faqPageJsonLd,
  softwareApplicationJsonLd,
  productJsonLd,
  breadcrumbJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "DCS AI ATC / AWACS — AI Air Traffic Controller & AWACS for DCS World",
  description:
    "The first fully offline AI air traffic controller and AWACS/GCI controller for DCS World. Voice commands, realistic responses, ICAO phraseology. All in your mission, with zero cloud dependencies.",
  path: "/",
});

const SCREENSHOTS = [
  {
    src: "/screenshots/dcs-tower.jpg",
    alt: "DCS World tower view with AI aircraft on final approach",
    caption: "Tower view — AI traffic sequencing on final",
  },
  {
    src: "/screenshots/dcs-cockpit.jpg",
    alt: "DCS World cockpit view during taxi with ATC instructions",
    caption: "Cockpit — taxi clearance and holding point instructions",
  },
  {
    src: "/screenshots/dcs-approach.jpg",
    alt: "DCS World approach view with ILS intercept and vectors",
    caption: "Approach — ILS intercept with radar vectors",
  },
  {
    src: "/screenshots/dcs-multiplayer.jpg",
    alt: "DCS World multiplayer session with multiple aircraft under ATC control",
    caption: "Multiplayer — shared ATC state across all clients",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={softwareApplicationJsonLd()} />
      <JsonLd data={productJsonLd()} />
      <JsonLd data={faqPageJsonLd(FAQS_FOR_LANDING)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
        ])}
      />

      {/* Hero */}
      <section
        aria-labelledby="hero-title"
        className="relative overflow-hidden border-b border-border/60 bg-cockpit-950"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hud-grid opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 top-1/2 hidden w-[32rem] -translate-y-1/2 lg:block"
        >
          <RadarSweep className="opacity-70" />
        </div>
        <div className="container relative py-24 sm:py-32">
          <FadeIn className="mx-auto max-w-3xl text-center">
            <Badge variant="radar" className="mb-6">
              <Radar className="mr-1.5 h-3.5 w-3.5" />
              Offline · Deterministic · ICAO
            </Badge>
            <h1
              id="hero-title"
              className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl"
            >
              Realistic ATC & AWACS for DCS World.{" "}
              <span className="relative whitespace-nowrap text-radar">
                Talk, it responds.
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 -bottom-1 h-[3px] bg-radar/40"
                />
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
              The first fully offline AI air traffic controller and AWACS/GCI
              controller. Voice commands, realistic responses, ICAO
              phraseology. All in your mission, with zero cloud dependencies.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="radar">
                <Link href="/pricing">
                  Buy now — {PRICE.currency}{PRICE.amount}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/features">
                  <PlayCircle className="h-4 w-4" />
                  See features
                </Link>
              </Button>
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Perpetual license · 1 year of updates · No subscription
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Trust strip / frequency ticker */}
      <section
        aria-label="Feature summary"
        className="border-b border-border/60 bg-cockpit"
      >
        <div className="container grid grid-cols-2 gap-px overflow-hidden sm:grid-cols-3 lg:grid-cols-5">
          {[
            { k: "Ground · Tower · Approach · Departure", v: "4 ATC domains" },
            { k: "Overlord & Darkstar on station", v: "AWACS / GCI" },
            { k: "Whisper + Kokoro, on-device", v: "STT / TTS" },
            { k: "Italian · English", v: "2 languages" },
            { k: "Single-player and multiplayer", v: "DCS World" },
          ].map((item) => (
            <div key={item.v} className="bg-cockpit px-6 py-8 text-center">
              <p className="font-mono text-xs uppercase tracking-widest text-radar">
                {item.v}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{item.k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DCS World screenshots */}
      <section
        aria-labelledby="screenshots-title"
        className="border-b border-border/60 bg-cockpit-950 py-24"
      >
        <div className="container">
          <SectionHeader
            eyebrow="In action"
            id="screenshots-title"
            title="DCS World, brought to life"
            description="Real DCS World missions with full ATC coverage — from startup to shutdown."
          />
          <FadeInStagger className="grid gap-4 sm:grid-cols-2">
            {SCREENSHOTS.map((shot) => (
              <FadeInItem key={shot.src}>
                <figure className="group relative overflow-hidden rounded-lg border border-border/60 bg-card/40">
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  </div>
                  <figcaption className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-medium text-foreground">
                      {shot.caption}
                    </p>
                  </figcaption>
                </figure>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Features */}
      <section
        aria-labelledby="features-title"
        className="container py-24"
      >
        <SectionHeader
          eyebrow="Features"
          id="features-title"
          title="The entire ATC flow, covered"
          description="From startup to taxi, from takeoff to final approach. DCS AI ATC handles every phase with realistic phraseology and deterministic logic."
        />
        <FadeInStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <FadeInItem key={f.title}>
              <Card className="group relative h-full border-border/60 bg-card/50 transition-colors hover:border-radar/40">
                <HudCorners onHover />
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-radar/10 text-radar ring-1 ring-inset ring-radar/20 transition-transform group-hover:scale-110">
                    <FeatureIcon name={f.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            </FadeInItem>
          ))}
        </FadeInStagger>
        <div className="mt-10 text-center">
          <Button asChild variant="ghost">
            <Link href="/features">
              See all features
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* AWACS / GCI */}
      <section
        aria-labelledby="awacs-title"
        className="border-y border-border/60 bg-cockpit-950 py-24"
      >
        <div className="container">
          <SectionHeader
            eyebrow="AWACS / GCI"
            id="awacs-title"
            title="Overlord and Darkstar, on station"
            description="Check in with AWACS for a tactical picture, bogey dope, intercept vectors, and threat warnings — the same radio, the same pilot, a second controller."
          />
          <FadeInStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {AWACS_CAPABILITIES.map((c) => (
              <FadeInItem key={c.title}>
                <Card className="group relative h-full border-border/60 bg-card/50 transition-colors hover:border-radar/40">
                  <HudCorners onHover />
                  <CardContent className="p-6">
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-radar/10 text-radar ring-1 ring-inset ring-radar/20 transition-transform group-hover:scale-110">
                      <FeatureIcon name={c.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {c.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* How it works */}
      <section
        aria-labelledby="how-title"
        className="border-y border-border/60 bg-cockpit-950 py-24"
      >
        <div className="container">
          <SectionHeader
            eyebrow="How it works"
            id="how-title"
            title="Ready for takeoff in 4 steps"
            description="From download to your first radio call, under ten minutes."
          />
          <FadeInStagger className="grid gap-6 md:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <FadeInItem key={s.step}>
                <div className="group relative h-full rounded-lg border border-border/60 bg-card/40 p-6 transition-colors hover:border-radar/40">
                  <HudCorners onHover />
                  <span className="font-mono text-3xl font-semibold text-radar/70">
                    {s.step}
                  </span>
                  <h3 className="mt-3 font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {s.description}
                  </p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* Pricing teaser */}
      <section aria-labelledby="pricing-title" className="container py-24">
        <SectionHeader
          eyebrow="Pricing"
          id="pricing-title"
          title="One license. Forever."
          description="No subscription, no hidden costs. Pay once, use DCS AI ATC forever."
        />
        <FadeIn className="mx-auto max-w-lg">
          <Card className="relative border-radar/30 bg-card/50">
            <HudCorners />
            <CardContent className="p-8">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-widest text-radar">
                    {PRICE.label}
                  </p>
                  <p className="mt-2 text-5xl font-semibold">
                    {PRICE.currency}
                    {PRICE.amount}
                  </p>
                </div>
                <Badge variant="freq">One-time payment</Badge>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {PRICE.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-radar" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild variant="radar" size="lg" className="mt-8 w-full">
                <Link href="/pricing">Buy now</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      </section>

      {/* Roadmap teaser */}
      <section
        aria-labelledby="roadmap-title"
        className="border-t border-border/60 bg-cockpit-950 py-24"
      >
        <div className="container">
          <SectionHeader
            eyebrow="Roadmap"
            id="roadmap-title"
            title="What's shipped, what's next"
            description="ATC and AWACS are live today. JTAC and carrier operations are next on the flight plan."
          />
          <FadeInStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROADMAP.map((item) => (
              <FadeInItem key={item.title}>
                <div className="group relative h-full rounded-lg border border-border/60 bg-card/40 p-6 transition-colors hover:border-radar/40">
                  <HudCorners onHover />
                  <Badge
                    variant={item.status === "shipped" ? "radar" : "freq"}
                    className="mb-3"
                  >
                    {item.tag}
                  </Badge>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
          <div className="mt-10 text-center">
            <Button asChild variant="ghost">
              <Link href="/roadmap">
                Full roadmap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ preview */}
      <section
        aria-labelledby="faq-title"
        className="border-t border-border/60 bg-cockpit-950 py-24"
      >
        <div className="container">
          <SectionHeader
            eyebrow="FAQ"
            id="faq-title"
            title="Frequently asked questions"
            description="Quick answers to the most common questions."
          />
          <FadeIn className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {FAQS_FOR_LANDING.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="mt-8 text-center">
              <Button asChild variant="ghost">
                <Link href="/faq">
                  All FAQs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
