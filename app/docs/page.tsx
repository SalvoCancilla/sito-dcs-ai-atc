import Link from "next/link";
import { BookOpen, Wrench, Mic, Radio, Plane, ArrowRight, Download, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { HudCorners } from "@/components/hud-corners";
import { FadeIn, FadeInItem, FadeInStagger } from "@/components/motion";
import { FinalCta } from "@/components/final-cta";
import { ORGANIZATION } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Documentation",
  description:
    "DCS AI ATC documentation: installation guide, DCS World integration, audio configuration, STT/TTS models, ATC phraseology.",
  path: "/docs",
});

const GUIDES = [
  {
    icon: Download,
    title: "Installation",
    description:
      "Download the Windows installer, run the setup wizard, and integrate the Lua scripts into DCS World. Requirements: Windows 10/11, DCS World Stable or Open Beta.",
    steps: [
      "Download the installer from the account area after activating your license",
      "Run the installer — the Lua scripts are automatically copied to the DCS folder",
      "Launch the app and complete the login with the account used for the purchase",
      "The app downloads the STT/TTS models on first run (SHA-256 hash verification)",
    ],
  },
  {
    icon: Settings,
    title: "Audio configuration",
    description:
      "Configure microphone, speakers, and Push-To-Talk. Select the audio devices from the interface and set your preferred PTT key.",
    steps: [
      "Open the Config → Audio tab and select the microphone",
      "Select the output device for TTS",
      "Configure the Push-To-Talk key in the PTT tab",
      "Test audio capture with the test button",
    ],
  },
  {
    icon: Mic,
    title: "STT Models (Whisper)",
    description:
      "Whisper large-v3-turbo offers the best accuracy with ~6 GB VRAM. Lighter Piper models are available for systems without a dedicated GPU.",
    steps: [
      "The model is downloaded automatically on first run",
      "Verify the SHA-256 hash shown in the app",
      "To change the model: Config → Whisper → Model",
      "ATC bias prompts are pre-configured to optimize recognition",
    ],
  },
  {
    icon: Radio,
    title: "TTS Models (Kokoro)",
    description:
      "Kokoro generates realistic voices with a VHF radio effect. The voices are optimized for ICAO phraseology in Italian and English.",
    steps: [
      "Select the voice from the Config → TTS tab",
      "Choose the ATC response language (IT or EN)",
      "Adjust the volume and intensity of the radio effect",
      "Test the voice with the preview button",
    ],
  },
  {
    icon: BookOpen,
    title: "ATC Phraseology",
    description:
      "DCS AI ATC supports standard ICAO phraseology. Here are the most common requests that the controller recognizes.",
    steps: [
      "\"Tower, [callsign], request taxi\" — taxi request",
      "\"[callsign], ready for departure\" — ready for takeoff",
      "\"[callsign], inbound, request approach\" — arrival",
      "\"[callsign], established localizer\" — localizer intercepted",
    ],
  },
  {
    icon: Plane,
    title: "Multiplayer",
    description:
      "In multiplayer, the DCS AI ATC server synchronizes traffic state across all clients. It works in host+client mode and on dedicated servers.",
    steps: [
      "Install DCS AI ATC on the PC hosting the mission (host)",
      "Other pilots can connect normally to DCS World",
      "ATC state is shared: each pilot hears the clearances of others",
      "The dedicated server requires headless installation (see advanced guide)",
    ],
  },
];

export default function DocsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
        ])}
      />
      <div className="container py-16">
        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: "Docs" }]}
        />
        <SectionHeader
          align="left"
          eyebrow="Documentation"
          title="Quick guide and references"
          description="Everything you need to set up and use DCS AI ATC, from installation to phraseology."
        />
      </div>

      <section aria-labelledby="docs-guides" className="container pb-24">
        <h2 id="docs-guides" className="sr-only">Guide</h2>
        <FadeInStagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <FadeInItem key={g.title}>
              <Card className="group relative h-full border-border/60 bg-card/40 transition-colors hover:border-radar/40">
                <HudCorners onHover />
                <CardContent className="p-6">
                  <g.icon className="h-6 w-6 text-radar" aria-hidden="true" focusable="false" />
                  <h3 className="mt-4 font-semibold">{g.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {g.description}
                  </p>
                  <ol className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {g.steps.map((step, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="mt-0.5 font-mono text-xs text-radar">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </FadeInItem>
          ))}
        </FadeInStagger>

        <FadeIn className="mt-12 rounded-lg border border-border/60 bg-card/40 p-6 text-center">
          <p className="text-muted-foreground">
            Need help? Write to{" "}
            <a
              className="text-radar underline-offset-4 hover:underline"
              href={`mailto:${ORGANIZATION.email}`}
            >
              {ORGANIZATION.email}
            </a>{" "}
            or join the Discord community.
          </p>
          <div className="mt-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="outline">
              <Link href="/support">
                Go to support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <a href={ORGANIZATION.discord} target="_blank" rel="noopener noreferrer">
                Discord community
              </a>
            </Button>
          </div>
        </FadeIn>
      </section>

      <FinalCta />
    </>
  );
}
