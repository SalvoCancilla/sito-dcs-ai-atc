import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createSupabaseServerClient();
  const { data } = await supabase
    .from("releases")
    .select(
      "version, channel, platform, changelog, asset_size_bytes, asset_sha256, signature_hex, is_mandatory, created_at",
    )
    .eq("is_listed", true)
    .eq("channel", "stable")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (!data) {
    return NextResponse.json(
      { error: "No release available" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    version: data.version,
    channel: data.channel,
    platform: data.platform,
    changelog: data.changelog ?? "",
    download_url: `/api/releases/download?v=${data.version}`,
    size_bytes: data.asset_size_bytes ?? 0,
    sha256: data.asset_sha256 ?? "",
    signature_hex: data.signature_hex ?? "",
    is_mandatory: data.is_mandatory ?? false,
    created_at: data.created_at ?? "",
    assets: [],
  });
}
