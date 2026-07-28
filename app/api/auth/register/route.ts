import { NextRequest, NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createSupabaseRouteClient(res);

  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
    options: {
      data: {
        display_name: body.display_name ?? "",
      },
    },
  });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: error.status ?? 400 },
    );
  }

  return NextResponse.json({ ok: true, user: data.user });
}
