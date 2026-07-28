import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const RATE_LIMIT = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 3;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT.get(ip);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count += 1;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many messages sent. Please try again shortly." },
        { status: 429 },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const { name, email, subject, message } = body as Record<string, unknown>;

    if (
      typeof name !== "string" || name.length < 2 ||
      typeof email !== "string" || !email.includes("@") ||
      typeof subject !== "string" || subject.length < 3 ||
      typeof message !== "string" || message.length < 10
    ) {
      return NextResponse.json(
        { error: "Invalid data" },
        { status: 422 },
      );
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("support_tickets").insert({
      name,
      email,
      subject,
      message,
      source: "website",
    });

    if (error) throw error;

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
