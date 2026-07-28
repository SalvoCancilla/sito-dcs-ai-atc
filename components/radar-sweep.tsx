import { cn } from "@/lib/utils";

/**
 * Decorative radar scope — concentric rings, a rotating sweep line, and a
 * handful of static "contact" blips. Built entirely from solid colors and
 * borders (no color gradients) to fit the flat, technical HUD aesthetic.
 */
export function RadarSweep({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative aspect-square rounded-full border border-radar/25",
        className,
      )}
    >
      <div className="absolute inset-[12.5%] rounded-full border border-radar/20" />
      <div className="absolute inset-[25%] rounded-full border border-radar/20" />
      <div className="absolute inset-[37.5%] rounded-full border border-radar/15" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-radar/10" />
      <div className="absolute left-0 top-1/2 h-px w-full bg-radar/10" />

      <div className="absolute inset-0 animate-radar-sweep gpu-transform">
        <div className="absolute left-1/2 top-1/2 h-1/2 w-px origin-top -translate-x-1/2 bg-radar" />
      </div>

      <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-radar shadow-[0_0_8px_1px_rgba(8,145,178,0.6)]" />
      <span className="absolute left-[68%] top-[30%] h-1.5 w-1.5 rounded-full bg-freq shadow-[0_0_6px_1px_rgba(217,119,6,0.5)]" />
      <span className="absolute left-[30%] top-[62%] h-1 w-1 animate-blink rounded-full bg-radar" />
      <span className="absolute left-[78%] top-[70%] h-1 w-1 animate-blink rounded-full bg-radar [animation-delay:1.2s]" />
    </div>
  );
}
