import Link from "next/link";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HudCorners } from "@/components/hud-corners";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Payment cancelled",
  description: "The payment was cancelled. Try again whenever you want.",
  path: "/cancel",
  noIndex: true,
});

export default function CancelPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <Card className="relative max-w-lg border-border/60 bg-card/50">
        <HudCorners />
        <CardContent className="p-8 text-center">
          <XCircle className="mx-auto h-12 w-12 text-muted-foreground" />
          <h1 className="mt-6 text-2xl font-semibold tracking-tight">
            Payment cancelled
          </h1>
          <p className="mt-3 text-muted-foreground">
            The payment was not completed. No charge was made. You can try
            again whenever you want.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="radar">
              <Link href="/pricing">Back to pricing</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/support">Contact support</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
