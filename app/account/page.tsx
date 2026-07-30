import Link from "next/link";
import { redirect } from "next/navigation";
import { Download, LogOut, Monitor, ShieldCheck, Cpu } from "lucide-react";

import { getCurrentUser, getLicense, getDevices } from "@/lib/auth";
import { getLatestRelease } from "@/lib/releases";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HudCorners } from "@/components/hud-corners";
import { formatDate, formatBytes } from "@/lib/utils";
import { LogoutButton } from "@/components/logout-button";
import { CheckoutButton } from "@/components/checkout-button";
import { RevokeDeviceButton } from "@/components/revoke-device-button";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Account area",
  description: "Manage your license, associated devices, and downloads.",
  path: "/account",
  noIndex: true,
});

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const [license, devices, release] = await Promise.all([
    getLicense(),
    getDevices(),
    getLatestRelease(),
  ]);

  const hasLicense = license?.is_active ?? false;

  return (
    <div className="container py-16">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Account area
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {user.email}
            {user.display_name ? ` · ${user.display_name}` : ""}
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* License card */}
        <Card className="relative lg:col-span-2 border-border/60 bg-card/40">
          <HudCorners />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">License</h2>
              {hasLicense ? (
                <Badge variant="radar">
                  <ShieldCheck className="mr-1 h-3 w-3" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline">No license</Badge>
              )}
            </div>

            {license ? (
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    Plan
                  </dt>
                  <dd className="mt-1 font-mono">{license.plan}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    Updates until
                  </dt>
                  <dd className="mt-1">{formatDate(license.updates_until)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    Active devices
                  </dt>
                  <dd className="mt-1">
                    {license.active_device_count} / {license.max_devices}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </dt>
                  <dd className="mt-1">
                    {license.is_active ? "Active" : "Inactive"}
                  </dd>
                </div>
              </dl>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-border/60 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  You don't have an active license yet.
                </p>
                <div className="mt-4">
                  <CheckoutButton>Buy the license — €49</CheckoutButton>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Download card */}
        <Card className="relative border-border/60 bg-card/40">
          <HudCorners />
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold">Download</h2>
            {release ? (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Version
                  </span>
                  <span className="font-mono">{release.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Size
                  </span>
                  <span className="font-mono">
                    {formatBytes(release.size_bytes)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    Released
                  </span>
                  <span>{formatDate(release.created_at)}</span>
                </div>
                <Separator />
                <Button asChild variant="radar" className="w-full">
                  <a href={release.download_url} rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    Download installer
                  </a>
                </Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No release available at this time.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Devices card */}
        <Card className="relative lg:col-span-3 border-border/60 bg-card/40">
          <HudCorners />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Associated devices</h2>
              {license && (
                <span className="text-sm text-muted-foreground">
                  {license.active_device_count} / {license.max_devices}
                </span>
              )}
            </div>
            {devices.length > 0 ? (
              <ul className="mt-6 divide-y divide-border/60">
                {devices.map((d) => (
                  <li
                    key={d.id}
                    className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <Monitor className="h-5 w-5 text-radar" />
                      <div>
                        <p className="font-medium">{d.label}</p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {d.fingerprint.slice(0, 16)}…
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Last seen: {formatDate(d.last_seen_at)}</span>
                      <RevokeDeviceButton deviceId={d.id} />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-border/60 p-8 text-center">
                <Cpu className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">
                  No devices associated. Launch the DCS AI ATC app and log in
                  to associate this PC.
                </p>
                {hasLicense && (
                  <Button asChild variant="outline" className="mt-4">
                    <Link href="/download">Download the installer</Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
