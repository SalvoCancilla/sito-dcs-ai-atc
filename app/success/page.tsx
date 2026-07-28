import Link from "next/link";
import { CheckCircle2, Rocket, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HudCorners } from "@/components/hud-corners";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Payment completed",
  description: "The payment has been completed. Launch the app and log in to activate your license.",
  path: "/success",
  noIndex: true,
});

export default function SuccessPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="relative max-w-lg border-radar/30 bg-card/50">
        <HudCorners />
        <CardContent className="p-8 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-radar" />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Payment completed
          </h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for your purchase. Your perpetual license has been
            activated automatically. To get started:
          </p>

          <ol className="mx-auto mt-6 max-w-sm space-y-4 text-left">
            <li className="flex gap-3">
              <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-radar" />
              <span className="text-sm text-muted-foreground">
                Launch the DCS AI ATC app on your PC.
              </span>
            </li>
            <li className="flex gap-3">
              <LogIn className="mt-0.5 h-5 w-5 shrink-0 text-radar" />
              <span className="text-sm text-muted-foreground">
                Log in with the email used for purchase. The license will be
                automatically associated with the device.
              </span>
            </li>
          </ol>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="radar">
              <Link href="/account">Go to account area</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/download">Download the installer</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
