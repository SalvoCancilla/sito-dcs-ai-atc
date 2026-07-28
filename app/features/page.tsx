import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/motion";
import { FinalCta } from "@/components/final-cta";
import { FeatureIcon } from "@/components/feature-icon";
import { HudCorners } from "@/components/hud-corners";
import { FEATURES, AWACS_CAPABILITIES } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, itemListJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Features",
  description:
    "All the features of DCS AI ATC / AWACS: Whisper STT, Kokoro TTS, Ground/Tower/Approach/Departure domains, AWACS/GCI (picture, bogey dope, declare, commit), single and multiplayer, offline, deterministic logic, proactive monitoring.",
  path: "/features",
});

const DOMAINS = [
  {
    name: "Ground",
    description:
      "Startup clearances, taxi, holding point, lineup. Apron management and routing.",
  },
  {
    name: "Tower",
    description:
      "Takeoff clearance, lineup, runway occupancy, exits, circuit traffic management.",
  },
  {
    name: "Approach",
    description:
      "Radar vectors, ILS intercept, sequencing, missed approach, holding patterns.",
  },
  {
    name: "Departure",
    description:
      "Frequency handoff after takeoff, initial climb, circuit exit, departure vectors.",
  },
  {
    name: "AWACS / GCI",
    description:
      "Overlord and Darkstar on station. Tactical picture, bogey dope, declare, commit, intercept vectors, threat warnings.",
  },
];

const PROACTIVE = [
  "Landing sequencing and radar separation (3 NM / 5 NM)",
  "Traffic advisories and traffic calls",
  "Automatic missed approach on occupied runway",
  "Holding patterns and sequence updates",
  "Heading / speed vectors for separation",
  "Frequency changes and position reports",
  "Weather advisories and emergency priority",
];

const SCREENSHOTS = [
  {
    src: "/screenshots/dcs-tower-2.jpg",
    alt: "DCS World tower view with multiple aircraft",
    caption: "Tower view — multiple aircraft under ATC control",
  },
  {
    src: "/screenshots/dcs-ground.jpg",
    alt: "DCS World ground operations with taxiing aircraft",
    caption: "Ground operations — taxiing aircraft and routing",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          FEATURES.map((f) => ({ name: f.title, description: f.description })),
        )}
      />

      <div className="container py-16">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Features" },
          ]}
        />
        <SectionHeader
          align="left"
          eyebrow="Features"
          title="Built to simulate a real controller"
          description="Every feature is designed to reproduce the experience of a real control tower, with the predictability you need in mission."
        />
      </div>

      {/* Feature grid */}
      <section aria-labelledby="overview-title" className="container pb-16">
        <h2 id="overview-title" className="sr-only">Feature overview</h2>
        <FadeInStagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <FadeInItem key={f.title}>
              <Card className="group relative h-full border-border/60 bg-card/50 transition-colors hover:border-radar/40">
                <HudCorners onHover />
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-radar/10 text-radar ring-1 ring-inset ring-radar/20">
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
      </section>

      {/* DCS World screenshots */}
      <section
        aria-labelledby="screenshots-title"
        className="border-y border-border/60 bg-cockpit-950 py-24"
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

      {/* ATC domains */}
      <section
        aria-labelledby="domains-title"
        className="border-y border-border/60 bg-cockpit-950 py-24"
      >
        <div className="container">
          <SectionHeader
            id="domains-title"
            eyebrow="ATC domains"
            title="Ground, Tower, Approach, Departure"
            description="DCS AI ATC covers the entire air traffic flow, from the apron to en-route release."
          />
          <FadeInStagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DOMAINS.map((d) => (
              <FadeInItem key={d.name}>
                <Card className="group relative h-full bg-card/40 transition-colors hover:border-radar/40">
                  <HudCorners onHover />
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{d.name}</h3>
                      <Badge variant={d.name.startsWith("AWACS") ? "freq" : "radar"}>
                        <span className="font-mono">
                          {d.name.startsWith("AWACS") ? "AWACS" : "ATC"}
                        </span>
                      </Badge>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {d.description}
                    </p>
                  </CardContent>
                </Card>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* STT / TTS */}
      <section aria-labelledby="voice-title" className="container py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <FadeIn>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-radar">
              Voice
            </p>
            <h2 id="voice-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Understands your voice, responds like a controller
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Whisper transcribes your voice requests with high accuracy,
              even on noisy radios and with different accents. Kokoro synthesizes
              natural responses with a VHF radio effect.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-radar" />
                On-device models, zero cloud latency
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-radar" />
                Whisper bias prompts dedicated to ATC phraseology
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-radar" />
                Numbers in ICAO format (one-one-eight point five)
              </li>
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Card className="border-radar/20 bg-card/40">
              <CardContent className="p-6 font-mono text-sm">
                <p className="text-muted-foreground">Pilot:</p>
                <p className="mt-1 text-foreground">
                  “Caucasus Tower, Eagle 1-1, request taxi.”
                </p>
                <p className="mt-4 text-muted-foreground">ATC:</p>
                <p className="mt-1 text-radar">
                  “Eagle 1-1, Caucasus Tower, taxi to runway two-five via Alpha
                  two, hold short.”
                </p>
                <p className="mt-4 text-muted-foreground">Pilot:</p>
                <p className="mt-1 text-foreground">
                  “Taxi Alpha two, hold short, Eagle 1-1.”
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </section>

      {/* Proactive monitoring */}
      <section
        aria-labelledby="proactive-title"
        className="border-y border-border/60 bg-cockpit-950 py-24"
      >
        <div className="container">
          <SectionHeader
            id="proactive-title"
            eyebrow="Proactive monitoring"
            title="The ATC calls you, it doesn't wait"
            description="A 2 Hz loop analyzes the traffic situation and generates proactive calls: sequencing, advisories, missed approach."
          />
          <FadeInStagger className="grid gap-3 sm:grid-cols-2">
            {PROACTIVE.map((item) => (
              <FadeInItem key={item}>
                <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card/40 p-4">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-freq" />
                  <span className="text-sm text-muted-foreground">{item}</span>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* AWACS / GCI */}
      <section aria-labelledby="awacs-title" className="container py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <FadeIn>
            <p className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-radar">
              <span aria-hidden="true" className="h-px w-4 bg-radar/50" />
              AWACS / GCI
            </p>
            <h2 id="awacs-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
              A second controller on your radio
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Check in with Overlord or Darkstar for a tactical picture, a
              bogey dope, or an intercept commit. AWACS also runs a global
              threat scan and warns your coalition when allies are in danger.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-radar" />
                BRAA bogey dope, from bullseye or from your position
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-radar" />
                Declare, commit, and intercept vectors
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-radar" />
                Threat and merge warnings, ally-in-danger monitoring
              </li>
            </ul>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Card className="border-radar/20 bg-card/40">
              <CardContent className="p-6 font-mono text-sm">
                <p className="text-muted-foreground">Pilot:</p>
                <p className="mt-1 text-foreground">
                  “Overlord, Eagle 1-1, bogey dope.”
                </p>
                <p className="mt-4 text-muted-foreground">AWACS:</p>
                <p className="mt-1 text-radar">
                  “Eagle 1-1, Overlord, bogey, bullseye two-one-zero, thirty-five,
                  angels twenty, hot.”
                </p>
                <p className="mt-4 text-muted-foreground">Pilot:</p>
                <p className="mt-1 text-foreground">
                  “Eagle 1-1, commit.”
                </p>
              </CardContent>
            </Card>
          </FadeIn>
        </div>

        <FadeInStagger className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AWACS_CAPABILITIES.map((c) => (
            <FadeInItem key={c.title}>
              <Card className="group relative h-full border-border/60 bg-card/50 transition-colors hover:border-radar/40">
                <HudCorners onHover />
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-radar/10 text-radar ring-1 ring-inset ring-radar/20">
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
      </section>

      {/* Roadmap callout */}
      <section className="border-y border-border/60 bg-cockpit-950 py-16">
        <div className="container">
          <div className="group relative flex flex-col items-center gap-4 rounded-lg border border-border/60 bg-card/40 p-8 text-center transition-colors hover:border-radar/40 sm:flex-row sm:justify-between sm:text-left">
            <HudCorners onHover />
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-radar">
                What's next
              </p>
              <h3 className="mt-2 text-xl font-semibold">
                JTAC and carrier operations are on the roadmap
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Close air support with 9-line briefings, plus Case I/II/III
                carrier recovery.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/roadmap">
                See the roadmap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="container py-12 text-center">
        <Button asChild variant="radar" size="lg">
          <Link href="/pricing">
            Buy DCS AI ATC
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <FinalCta />
    </>
  );
}
