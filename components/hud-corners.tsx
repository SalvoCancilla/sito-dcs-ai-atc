import { cn } from "@/lib/utils";

/**
 * Decorative HUD-style corner brackets. Purely visual — meant to be placed
 * inside a `relative` (ideally `group`) container to reinforce the
 * radar/technical aesthetic without relying on color gradients.
 *
 * By default the brackets are subtly visible; pass `onHover` to fade them
 * in only when the parent `group` is hovered/focused.
 */
export function HudCorners({
  className,
  onHover = false,
}: {
  className?: string;
  onHover?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-300",
        onHover ? "opacity-0 group-hover:opacity-100" : "opacity-100",
        className,
      )}
    >
      <span className="hud-corner hud-corner--tl" />
      <span className="hud-corner hud-corner--tr" />
      <span className="hud-corner hud-corner--bl" />
      <span className="hud-corner hud-corner--br" />
    </div>
  );
}
