import { Suspense } from "react";

import { AuthForm } from "@/components/auth-form";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Register",
  description:
    "Create a DCS AI ATC account. All you need is an email and a password to get started.",
  path: "/register",
  noIndex: true,
});

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Free in seconds. You only pay when you want to activate your license.
          </p>
        </div>
        <Suspense fallback={null}>
          <AuthForm mode="register" />
        </Suspense>
      </div>
    </div>
  );
}
