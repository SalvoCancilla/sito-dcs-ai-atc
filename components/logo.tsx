import Link from "next/link";
import { Radar } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 text-foreground",
        className,
      )}
      aria-label="DCS AI ATC — home"
    >
      <span className="relative flex h-8 w-8 items-center justify-center">
        <Radar className="h-8 w-8 text-radar transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" focusable="false" />
      </span>
      {withText && (
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.18em]">
          DCS&nbsp;AI&nbsp;ATC
          <span className="text-radar">/AWACS</span>
        </span>
      )}
    </Link>
  );
}
