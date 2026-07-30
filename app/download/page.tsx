import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, ArrowRight } from "lucide-react";

import { getCurrentUser, getLicense } from "@/lib/auth";
import { getLatestRelease } from "@/lib/releases";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HudCorners } from "@/components/hud-corners";
import { formatBytes, formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Download",
  description: "Download the DCS AI ATC installer for Windows.",
  path: "/download",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function DownloadPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/download");

  const [license, release] = await Promise.all([
    getLicense(),
    getLatestRelease(),
  ]);

  const canDownload = license?.is_active ?? false;

  return (
    <div className="container py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight">Download</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome, {user.email}.
        </p>

        <Card className="relative mt-8 border-border/60 bg-card/40">
          <HudCorners />
          <CardContent className="p-6">
            {canDownload ? (
              release ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-widest text-radar">
                        Windows installer
                      </p>
                      <p className="mt-2 text-2xl font-semibold">
                        v{release.version}
                      </p>
                    </div>
                    <Download className="h-8 w-8 text-radar" />
                  </div>
                  <dl className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <dt className="text-xs uppercase text-muted-foreground">
                        Size
                      </dt>
                      <dd className="mt-1 font-mono">
                        {formatBytes(release.size_bytes)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase text-muted-foreground">
                        Released
                      </dt>
                      <dd className="mt-1">{formatDate(release.created_at)}</dd>
                    </div>
                  </dl>
                  <Button asChild variant="radar" className="w-full">
                    <a href={release.download_url} rel="noopener noreferrer">
                      <Download className="h-4 w-4" />
                      Download now
                    </a>
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    SHA-256:{" "}
                    <span className="font-mono">
                      {release.sha256.slice(0, 24)}…
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No release available at this time. Please try again later.
                </p>
              )
            ) : (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Your license is not yet active.
                </p>
                <Button asChild variant="radar" className="mt-4">
                  <Link href="/pricing">
                    Buy the license
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          After installation, launch the app and log in with the same account
          to activate your license.
        </p>
      </div>
    </div>
  );
}
