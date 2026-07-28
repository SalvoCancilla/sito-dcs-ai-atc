"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { HudCorners } from "@/components/hud-corners";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Enter your password"),
});

const registerSchema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Minimum 8 characters"),
    display_name: z.string().max(120).optional(),
    confirm: z.string().min(8, "Minimum 8 characters"),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/account";

  const isRegister = mode === "register";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues & Partial<RegisterValues>>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema) as never,
    defaultValues: {
      email: "",
      password: "",
      confirm: "",
      display_name: "",
    } as never,
  });

  async function onSubmit(values: LoginValues | RegisterValues) {
    const supabase = createSupabaseBrowserClient();
    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              display_name: (values as RegisterValues).display_name ?? "",
            },
          },
        });
        if (error) throw error;
        toast.success("Account created — check your inbox to confirm your email");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        toast.success("Signed in");
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Error during authentication",
      );
    }
  }

  return (
    <Card className="relative border-border/60 bg-card/50">
      <HudCorners />
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={errors.email ? "true" : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-xs text-destructive">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="display_name">Name (optional)</Label>
              <Input
                id="display_name"
                autoComplete="name"
                {...register("display_name")}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              aria-invalid={errors.password ? "true" : undefined}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" role="alert" className="text-xs text-destructive">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                aria-invalid={errors.confirm ? "true" : undefined}
                aria-describedby={errors.confirm ? "confirm-error" : undefined}
                {...register("confirm")}
              />
              {errors.confirm && (
                <p id="confirm-error" role="alert" className="text-xs text-destructive">
                  {errors.confirm.message as string}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            variant="radar"
            className="w-full"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {isRegister ? "Create account" : "Sign in"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {isRegister ? (
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-radar hover:underline"
              >
                Sign in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-radar hover:underline"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
