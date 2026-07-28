import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  const res = NextResponse.json({ ok: true });
  // Clear Supabase auth cookies
  ["sb-access-token", "sb-refresh-token"].forEach((name) => {
    res.cookies.delete(name);
  });
  return res;
}
