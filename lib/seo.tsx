import type { Metadata } from "next";
import { siteUrl } from "@/lib/api";
import { ORGANIZATION, PRICE, FAQS } from "@/lib/content";

export function absoluteUrl(path = "/"): string {
  return `${siteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
  type = "website",
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(ORGANIZATION.name)
    ? title
    : `${title} — ${ORGANIZATION.name}`;
  // OG/Twitter images are inherited from app/opengraph-image.tsx (file-based
  // metadata). We intentionally avoid overriding openGraph.images here so the
  // dynamic ImageResponse is used for every page.
  //
  // `title` is set as an absolute string so it bypasses the root layout's
  // `title.template` — callers pass a short page title and `fullTitle`
  // already appends the site name, so applying the template on top would
  // duplicate the suffix (e.g. "Features — DCS AI ATC — DCS AI ATC").
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: ORGANIZATION.name,
      locale: "en_US",
      type: type as "website" | "article",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: ORGANIZATION.name,
    applicationCategory: "GameApplication",
    operatingSystem: "Windows",
    description:
      "Fully offline AI air traffic controller and AWACS/GCI controller for DCS World. Voice commands, realistic responses, ICAO phraseology.",
    url: absoluteUrl("/"),
    offers: {
      "@type": "Offer",
      price: String(PRICE.amount),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(
        new Date().getFullYear() + 1,
        11, 31,
      ).toISOString().split("T")[0],
      seller: {
        "@type": "Organization",
        name: ORGANIZATION.name,
        url: absoluteUrl("/"),
      },
    },
    publisher: {
      "@type": "Organization",
      name: ORGANIZATION.name,
      url: absoluteUrl("/"),
    },
    featureList: [
      "On-device Whisper STT",
      "Kokoro TTS with VHF radio effect",
      "4 ATC domains: Ground, Tower, Approach, Departure",
      "AWACS/GCI: picture, bogey dope, declare, commit, threat warnings",
      "Deterministic logic (keyword + YAML state machine)",
      "2 Hz proactive monitoring",
      "Italian and English with ICAO phraseology",
      "Single-player and multiplayer",
      "Fully offline",
    ],
  };
}

export function productJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: ORGANIZATION.name,
    description:
      "Fully offline AI air traffic controller and AWACS/GCI controller for DCS World. Voice commands, realistic responses, ICAO phraseology.",
    brand: {
      "@type": "Brand",
      name: ORGANIZATION.name,
    },
    category: "Flight simulator software",
    offers: {
      "@type": "Offer",
      price: String(PRICE.amount),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      priceValidUntil: new Date(
        new Date().getFullYear() + 1, 11, 31,
      ).toISOString().split("T")[0],
      seller: {
        "@type": "Organization",
        name: ORGANIZATION.name,
        url: absoluteUrl("/"),
      },
    },
  };
}

export function faqPageJsonLd(items = FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function itemListJsonLd(
  items: Array<{ name: string; description: string; url?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      description: item.description,
      ...(item.url ? { url: absoluteUrl(item.url) } : {}),
    })),
  };
}

export function breadcrumbJsonLd(
  items: Array<{ name: string; path: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORGANIZATION.name,
    url: absoluteUrl("/"),
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function organizationJsonLd() {
  const sameAs: string[] = [];
  if (ORGANIZATION.discord) sameAs.push(ORGANIZATION.discord);
  if (ORGANIZATION.youtube) sameAs.push(ORGANIZATION.youtube);
  if (ORGANIZATION.github) sameAs.push(ORGANIZATION.github);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: ORGANIZATION.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo.svg"),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: ORGANIZATION.email,
      availableLanguage: ["Italian", "English"],
    },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
