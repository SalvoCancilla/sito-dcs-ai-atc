import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/api";
import { ORGANIZATION } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: ORGANIZATION.name,
    short_name: "DCS AI ATC",
    description:
      "Fully offline AI air traffic controller for DCS World.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0891b2",
    lang: "en",
    categories: ["games", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
