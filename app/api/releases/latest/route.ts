import { NextRequest, NextResponse } from "next/server";

import { getLatestRelease } from "@/lib/releases";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Public release metadata.
 *
 * Serves both the website and the desktop app's update check. No auth: the
 * payload is only metadata (version, hash, signature) and deliberately
 * carries no direct R2 link — the actual download goes through
 * /api/releases/download, which enforces sign-in and an active license.
 */
export async function GET(req: NextRequest) {
  const channel = req.nextUrl.searchParams.get("channel") ?? "stable";
  const release = await getLatestRelease(channel);

  if (!release) {
    return NextResponse.json(
      { error: "No published release", code: "no_releases" },
      { status: 404 },
    );
  }

  return NextResponse.json(release, {
    headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
  });
}
