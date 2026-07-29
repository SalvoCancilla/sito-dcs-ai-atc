import { NextResponse } from "next/server";
import https from "node:https";

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

  const path = `/rest/v1/releases?select=version,channel,platform,changelog,asset_size_bytes,asset_sha256,signature_hex,is_mandatory,created_at&is_listed=eq.true&channel=eq.stable&order=created_at.desc&limit=1`;
  const host = supabaseUrl.replace("https://", "");

  const data = await new Promise<string>((resolve, reject) => {
    const req = https.request(
      {
        host,
        path,
        method: "GET",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => resolve(body));
        res.on("error", reject);
      },
    );
    req.on("error", reject);
    req.end();
  });

  try {
    const rows = JSON.parse(data);
    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { error: "No release available" },
        { status: 404 },
      );
    }

    const d = rows[0];
    return NextResponse.json({
      version: d.version,
      channel: d.channel,
      platform: d.platform,
      changelog: d.changelog ?? "",
      download_url: `/api/releases/download?v=${d.version}`,
      size_bytes: d.asset_size_bytes ?? 0,
      sha256: d.asset_sha256 ?? "",
      signature_hex: d.signature_hex ?? "",
      is_mandatory: d.is_mandatory ?? false,
      created_at: d.created_at ?? "",
      assets: [],
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Parse error", detail: err instanceof Error ? err.message : "unknown", raw: data.substring(0, 200) },
      { status: 500 },
    );
  }
}
