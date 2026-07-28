import Link from "next/link";

import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  path: "/404",
  noIndex: true,
});

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono text-6xl font-semibold text-radar">404</p>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        Page not found
      </h1>
      <p className="mt-2 text-muted-foreground">
        The route you entered is not in our flight plan.
      </p>
      <Button asChild variant="radar" className="mt-6">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
