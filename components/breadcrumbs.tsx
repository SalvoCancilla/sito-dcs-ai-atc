import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function Breadcrumbs({
  items,
  className,
}: {
  items: Array<{ name: string; href?: string }>;
  className?: string;
}) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("mb-6 text-sm text-muted-foreground", className)}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground"
                >
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined}>
                  {item.name}
                </span>
              )}
              {!last && (
                <ChevronRight className="h-3.5 w-3.5 opacity-50" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
