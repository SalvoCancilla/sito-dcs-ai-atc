import { Suspense } from "react";

import { AuthForm } from "@/components/auth-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sign in",
  description: "Sign in to your DCS AI ATC account to manage your license and devices.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage license, devices, and downloads.
          </p>
        </div>
        <Suspense fallback={null}>
          <AuthForm mode="login" />
        </Suspense>
      </div>
    </div>
  );
}
