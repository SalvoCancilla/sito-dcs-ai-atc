import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Supabase env vars not configured" },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabase
    .from("releases")
    .select(
      "version, channel, platform, changelog, asset_size_bytes, asset_sha256, signature_hex, is_mandatory, created_at",
    )
    .eq("is_listed", true)
    .eq("channel", "stable")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json(
      { error: "No release available", detail: error?.message ?? "no data" },
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
