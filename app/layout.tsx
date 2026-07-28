import type { Metadata, Viewport } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";

import { cn } from "@/lib/utils";
import { siteUrl } from "@/lib/api";
import { ORGANIZATION } from "@/lib/content";
import { organizationJsonLd, webSiteJsonLd } from "@/lib/seo";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/lib/seo";

import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "DCS AI ATC / AWACS — AI Air Traffic Controller & AWACS for DCS World",
    template: "%s — DCS AI ATC / AWACS",
  },
  description:
    "The first fully offline AI air traffic controller and AWACS/GCI controller for DCS World. Voice commands, realistic responses, ICAO phraseology. All in your mission, with zero cloud dependencies.",
  applicationName: ORGANIZATION.name,
  keywords: [
    "DCS World",
    "ATC",
    "air traffic control",
    "AI ATC",
    "AI air traffic control",
    "AWACS",
    "GCI",
    "JTAC",
    "carrier operations",
    "case 1 2 3 recovery",
    "bogey dope",
    "BRAA",
    "Whisper",
    "Kokoro TTS",
    "flight simulator",
    "air traffic controller",
    "offline ATC",
    "STT",
    "TTS",
    "DCS ATC",
    "DCS mod",
    "DCS World mod",
    "voice ATC",
    "ICAO phraseology",
    "flight simulator ATC",
  ],
  authors: [{ name: ORGANIZATION.name }],
  creator: ORGANIZATION.name,
  publisher: ORGANIZATION.name,
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
    },
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl(),
    siteName: ORGANIZATION.name,
    title: "DCS AI ATC / AWACS — AI Air Traffic Controller & AWACS for DCS World",
    description:
      "The first fully offline AI air traffic controller and AWACS/GCI controller for DCS World. Voice commands, realistic responses, ICAO phraseology.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DCS AI ATC / AWACS — AI Air Traffic Controller & AWACS for DCS World",
    description:
      "The first fully offline AI air traffic controller and AWACS/GCI controller for DCS World.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Games",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground",
          orbitron.variable,
          inter.variable,
          mono.variable,
        )}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-radar focus:px-4 focus:py-2 focus:text-radar-foreground"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <Toaster position="top-right" />
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={webSiteJsonLd()} />
      </body>
    </html>
  );
}
