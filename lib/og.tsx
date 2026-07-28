import { ImageResponse } from "next/og";
import { PRICE } from "@/lib/content";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function ogImage({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(8,145,178,0.16) 0%, rgba(217,119,6,0.07) 40%, transparent 70%), #ffffff",
          color: "#0f172a",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 999,
              border: "3px solid #0891b2",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              color: "#0891b2",
            }}
          >
            ◔
          </div>
          <div style={{ fontSize: 24, letterSpacing: 6, color: "#64748b" }}>
            DCS AI ATC / AWACS
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {badge && (
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                fontSize: 22,
                color: "#0891b2",
                letterSpacing: 4,
                textTransform: "uppercase",
              }}
            >
              {badge}
            </div>
          )}
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 28, color: "#64748b", maxWidth: 940 }}>
              {subtitle}
            </div>
          )}
        </div>
        <div
          style={{ display: "flex", gap: 20, fontSize: 20, color: "#d97706" }}
        >
          <span>Offline</span>
          <span>·</span>
          <span>IT / EN</span>
          <span>·</span>
          <span>Perpetual license {PRICE.currency}{PRICE.amount}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
