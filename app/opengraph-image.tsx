import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "DCS AI ATC — AI Air Traffic Controller for DCS World";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return ogImage({
    badge: "ATC AI · Offline",
    title: "Realistic ATC for DCS World. Talk, it responds.",
    subtitle:
      "Voice commands, realistic responses, ICAO phraseology — fully offline.",
  });
}
