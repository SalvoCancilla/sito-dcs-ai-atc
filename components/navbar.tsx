"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/content";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const;

/** Animated hamburger / close icon — smooth morph between the two states. */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative h-5 w-5" aria-hidden="true">
      {/* Top bar → rotates down to form the X's first stroke */}
      <motion.span
        className="absolute left-0 top-1/2 h-0.5 w-5 -translate-y-[6px] rounded-full bg-current"
        animate={{
          rotate: open ? 45 : 0,
          y: open ? 0 : -6,
        }}
        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      />
      {/* Middle bar → fades out */}
      <motion.span
        className="absolute left-0 top-1/2 h-0.5 w-5 translate-y-0 rounded-full bg-current"
        animate={{
          opacity: open ? 0 : 1,
          scaleX: open ? 0.5 : 1,
        }}
        transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
      />
      {/* Bottom bar → rotates up to form the X's second stroke */}
      <motion.span
        className="absolute left-0 top-1/2 h-0.5 w-5 translate-y-[6px] rounded-full bg-current"
        animate={{
          rotate: open ? -45 : 0,
          y: open ? 0 : 6,
        }}
        transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
      />
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when menu is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-cockpit/80 backdrop-blur supports-[backdrop-filter]:bg-cockpit/60">
      <nav
        className="container flex h-16 items-center justify-between"
        aria-label="Main navigation"
      >
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground",
                  )}
                >
                  {link.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-[1px] h-[2px] origin-left animate-scale-in-x bg-radar"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild variant="radar" size="sm">
            <Link href="/pricing">Buy</Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <HamburgerIcon open={open} />
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
            className="overflow-hidden border-t border-border/60 bg-cockpit md:hidden"
          >
            <ul className="container flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: EASE_OUT_EXPO,
                    delay: 0.05 + i * 0.05,
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "block rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                      pathname === link.href && "text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                className="mt-2 flex flex-col gap-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  ease: EASE_OUT_EXPO,
                  delay: 0.05 + NAV_LINKS.length * 0.05,
                }}
              >
                <Button asChild variant="outline" size="sm">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild variant="radar" size="sm">
                  <Link href="/pricing">Buy</Link>
                </Button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
