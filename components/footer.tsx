import Link from "next/link";

import { NAV_LINKS, ORGANIZATION } from "@/lib/content";
import { Logo } from "@/components/logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border/60 bg-cockpit-950">
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-radar/30" />
      <div className="container grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            Fully offline AI air traffic controller for DCS World.
          </p>
        </div>

        <nav aria-label="Product">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product
          </h2>
          <ul className="space-y-2 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/download"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Download
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Account">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Account
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/login"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign in
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                href="/account"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Account area
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Legal
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/legal/privacy"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy policy
              </Link>
            </li>
            <li>
              <Link
                href="/legal/terms"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms of service
              </Link>
            </li>
            <li>
              <a
                href={ORGANIZATION.discord}
                className="text-muted-foreground transition-colors hover:text-foreground"
                rel="noopener noreferrer"
                target="_blank"
              >
                Discord community
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {ORGANIZATION.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 font-mono uppercase tracking-widest text-radar/70">
            <span className="h-1.5 w-1.5 rounded-full bg-radar" aria-hidden="true" />
            System operational
          </p>
          <p className="font-mono">
            Not affiliated with Eagle Dynamics. DCS World is a trademark of its
            respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
