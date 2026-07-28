import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { FadeIn } from "@/components/motion";
import { FinalCta } from "@/components/final-cta";
import { SupportForm } from "@/components/support-form";
import { HudCorners } from "@/components/hud-corners";
import { ORGANIZATION } from "@/lib/content";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { Mail, MessagesSquare, LifeBuoy } from "lucide-react";

export const metadata = pageMetadata({
  title: "Support",
  description:
    "Support for DCS AI ATC: contact form, email, and Discord community. Response within 48 business hours.",
  path: "/support",
});

const CHANNELS = [
  {
    icon: Mail,
    title: "Email",
    description:
      "Write to us for technical issues, licenses, or refunds. Response within 48 business hours.",
    action: { label: ORGANIZATION.email, href: `mailto:${ORGANIZATION.email}`, external: false },
  },
  {
    icon: MessagesSquare,
    title: "Community Discord",
    description:
      "Connect with other pilots and the team. Dedicated channels for installation and phraseology.",
    action: { label: "Join Discord", href: ORGANIZATION.discord, external: true },
  },
  {
    icon: LifeBuoy,
    title: "FAQ",
    description:
      "Many quick answers are already on our FAQ page.",
    action: { label: "Go to FAQ", href: "/faq", external: false },
  },
];

export default function SupportPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Support", path: "/support" },
        ])}
      />
      <div className="container py-16">
        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: "Support" }]}
        />
        <SectionHeader
          align="left"
          eyebrow="Support"
          title="We're here to help"
          description="Choose the most convenient channel: email, Discord, or the form below."
        />
      </div>

      <section aria-labelledby="channels-title" className="container pb-12">
        <h2 id="channels-title" className="sr-only">Support channels</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {CHANNELS.map((c) => (
            <FadeIn key={c.title}>
              <div className="group relative flex h-full flex-col rounded-lg border border-border/60 bg-card/40 p-6 transition-colors hover:border-radar/40">
                <HudCorners onHover />
                <c.icon className="h-6 w-6 text-radar" aria-hidden="true" />
                <h3 className="mt-4 font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">
                  {c.description}
                </p>
                <a
                  href={c.action.href}
                  className="mt-4 text-sm font-medium text-radar underline-offset-4 hover:underline"
                  {...(c.action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {c.action.label}
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      <section aria-labelledby="form-title" className="container pb-24">
        <FadeIn className="mx-auto max-w-xl">
          <h2 id="form-title" className="mb-6 text-2xl font-semibold">
            Write to us
          </h2>
          <SupportForm />
        </FadeIn>
      </section>

      <FinalCta />
    </>
  );
}
