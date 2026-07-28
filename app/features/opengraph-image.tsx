import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Features — DCS AI ATC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return ogImage({
    badge: "Features",
    title: "The entire ATC flow, covered",
    subtitle:
      "Ground, Tower, Approach, Departure. Whisper STT, Kokoro TTS, offline.",
  });
}
