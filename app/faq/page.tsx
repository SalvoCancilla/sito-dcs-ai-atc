import { Breadcrumbs } from "@/components/breadcrumbs";
import { SectionHeader } from "@/components/section-header";
import { FadeIn } from "@/components/motion";
import { FinalCta } from "@/components/final-cta";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/lib/content";
import {
  JsonLd,
  breadcrumbJsonLd,
  faqPageJsonLd,
  pageMetadata,
} from "@/lib/seo";

export const metadata = pageMetadata({
  title: "FAQ",
  description:
    "Answers to the most frequently asked questions about DCS AI ATC: requirements, offline, languages, license, updates, refunds.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <JsonLd data={faqPageJsonLd(FAQS)} />

      <div className="container py-16">
        <Breadcrumbs
          items={[{ name: "Home", href: "/" }, { name: "FAQ" }]}
        />
        <SectionHeader
          align="left"
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything you want to know about DCS AI ATC, from license to hardware requirements."
        />
      </div>

      <section aria-labelledby="faq-list-title" className="container pb-24">
        <h2 id="faq-list-title" className="sr-only">Question list</h2>
        <FadeIn className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </section>

      <FinalCta />
    </>
  );
}
