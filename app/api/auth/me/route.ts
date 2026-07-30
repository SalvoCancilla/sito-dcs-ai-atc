import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Current session, or `{ user: null }` when signed out. */
export async function GET() {
  const user = await getCurrentUser();
  return NextResponse.json({ user });
}
