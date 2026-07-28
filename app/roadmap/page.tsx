import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { FadeInItem, FadeInStagger } from "@/components/motion";
import { FinalCta } from "@/components/final-cta";
import { HudCorners } from "@/components/hud-corners";
import { ROADMAP } from "@/lib/content";
import {
  JsonLd,
  breadcrumbJsonLd,
  itemListJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Roadmap",
  description:
    "The DCS AI ATC / AWACS roadmap: ATC and AWACS/GCI are available now. JTAC (close air support) and carrier operations with Case I/II/III recovery are coming next.",
  path: "/roadmap",
});

const SHIPPED = ROADMAP.filter((item) => item.status === "shipped");
const PLANNED = ROADMAP.filter((item) => item.status === "planned");

export default function RoadmapPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Roadmap", path: "/roadmap" },
        ])}
      />
      <JsonLd
        data={itemListJsonLd(
          ROADMAP.map((item) => ({
            name: item.title,
            description: item.description,
          })),
        )}
      />

      <div className="container py-16">
        <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: "Roadmap" }]} />
        <SectionHeader
          align="left"
          eyebrow="Roadmap"
          title="Available now, and what's next"
          description="DCS AI ATC / AWACS already covers the full airport ATC flow and AWACS/GCI control. JTAC and carrier operations are next on the flight plan."
        />
      </div>

      {/* Available now */}
      <section aria-labelledby="shipped-title" className="container pb-16">
        <h2
          id="shipped-title"
          className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-radar"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-radar" aria-hidden="true" />
          Available now
        </h2>
        <FadeInStagger className="grid gap-4 md:grid-cols-2">
          {SHIPPED.map((item) => (
            <FadeInItem key={item.title}>
              <Card className="group relative h-full border-radar/30 bg-card/50 transition-colors hover:border-radar/50">
                <HudCorners />
                <CardContent className="p-6">
                  <Badge variant="radar" className="mb-3">
                    {item.tag}
                  </Badge>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm">
                    {item.details.map((d) => (
                      <li key={d} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-radar" />
                        <span className="text-muted-foreground">{d}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </section>

      {/* Coming next */}
      <section
        aria-labelledby="planned-title"
        className="border-y border-border/60 bg-cockpit-950 py-24"
      >
        <div className="container">
          <h2
            id="planned-title"
            className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-freq"
          >
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-freq" aria-hidden="true" />
            Coming next
          </h2>
          <FadeInStagger className="grid gap-4 md:grid-cols-2">
            {PLANNED.map((item) => (
              <FadeInItem key={item.title}>
                <Card className="group relative h-full border-freq/30 bg-card/40 transition-colors hover:border-freq/50">
                  <HudCorners />
                  <CardContent className="p-6">
                    <Badge variant="freq" className="mb-3">
                      {item.tag}
                    </Badge>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm">
                      {item.details.map((d) => (
                        <li key={d} className="flex items-start gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-freq" />
                          <span className="text-muted-foreground">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </FadeInItem>
            ))}
          </FadeInStagger>
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Have a request or a priority between JTAC and carrier operations?{" "}
            <a
              href="/support"
              className="font-medium text-radar underline-offset-4 hover:underline"
            >
              Tell us on support or Discord
            </a>
            .
          </p>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
