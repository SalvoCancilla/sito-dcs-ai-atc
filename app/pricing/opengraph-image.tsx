import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";

export const runtime = "edge";
export const alt = "Pricing — DCS AI ATC";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function OpengraphImage() {
  return ogImage({
    badge: "Pricing",
    title: "One license. Forever.",
    subtitle: "Perpetual license €49 + 1 year of updates. No subscription.",
  });
}
