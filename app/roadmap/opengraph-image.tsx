import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Roadmap — DCS AI ATC / AWACS";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return ogImage({
    badge: "Roadmap",
    title: "ATC and AWACS today. JTAC and carrier ops next.",
    subtitle:
      "Ground, Tower, Approach, Departure, AWACS/GCI shipped. JTAC and Case I/II/III carrier recovery coming next.",
  });
}
