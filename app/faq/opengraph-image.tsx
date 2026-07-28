import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "FAQ — DCS AI ATC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return ogImage({
    badge: "FAQ",
    title: "Frequently asked questions",
    subtitle: "Requirements, offline, languages, license, updates, refunds.",
  });
}
