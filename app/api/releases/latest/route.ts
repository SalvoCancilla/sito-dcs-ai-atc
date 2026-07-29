import { NextResponse } from "next/server";

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

  try {
    const url = `${supabaseUrl}/rest/v1/releases?select=version,channel,platform,changelog,asset_size_bytes,asset_sha256,signature_hex,is_mandatory,created_at&is_listed=eq.true&channel=eq.stable&order=created_at.desc&limit=1`;
    const resp = await fetch(url, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: "Supabase query failed", status: resp.status, detail: text },
        { status: 502 },
      );
    }

    const rows = await resp.json();
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "No release available" },
        { status: 404 },
      );
    }

    const data = rows[0];
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
  } catch (err) {
    return NextResponse.json(
      { error: "Internal error", detail: err instanceof Error ? err.message : "unknown" },
      { status: 500 },
    );
  }
}
