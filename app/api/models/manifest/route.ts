import { NextResponse } from "next/server";

import { createSupabasePublicClient } from "@/lib/supabase/server";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/supabase/config";
import { r2PublicBase } from "@/lib/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * ML model manifest used by the desktop app to sync models from R2.
 *
 * ~390 entries / 1.7 GB of models. The manifest lists each file's R2 key,
 * size and SHA-256 so the client can resume, skip already-valid files and
 * verify what it downloads. Published by scripts/publish_models.py.
 *
 * Public on purpose: the model files themselves are public objects on R2,
 * so gating the index would buy nothing.
 */
export async function GET() {
  const supabase = createSupabasePublicClient();
  const { data, error } = await supabase
    .from("model_manifests")
    .select("manifest_version, manifest")
    .eq("is_current", true)
    .maybeSingle();

  if (error) {
    console.error("[models] manifest query failed:", error.message);
    return NextResponse.json(
      { error: "Manifest unavailable", code: "server_error" },
      { status: 500 },
    );
  }
  if (!data) {
    // TEMP DEBUG: decompose the failing query inside the deployed function
    // (remove after diagnosis).
    const probePlain = await supabase
      .from("model_manifests")
      .select("manifest_version, manifest")
      .eq("is_current", true);
    const probeNoFilter = await supabase
      .from("model_manifests")
      .select("manifest_version, manifest");
    // Raw fetch to PostgREST, bypassing supabase-js entirely: isolates
    // postgrest-js serialization bugs from network/DB issues.
    const raw = await fetch(
      `${SUPABASE_URL}/rest/v1/model_manifests?select=id,is_current&is_current=eq.true`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      },
    );
    const rawText = await raw.text();
    return NextResponse.json(
      {
        error: "No manifest published",
        code: "no_manifest",
        debug: {
          host: new URL(SUPABASE_URL).host,
          plain_rows: probePlain.data?.length ?? null,
          plain_err: probePlain.error?.message ?? null,
          nofilter_rows: probeNoFilter.data?.length ?? null,
          nofilter_err: probeNoFilter.error?.message ?? null,
          raw_status: raw.status,
          raw_body: rawText.slice(0, 300),
        },
      },
      { status: 404 },
    );
  }

  // Resolve each stored R2 key into a fetchable URL here, so the client
  // never encodes the bucket layout and the base can change without
  // shipping a new build.
  const base = r2PublicBase();
  const manifest = data.manifest as {
    files?: Array<Record<string, unknown> & { key?: string }>;
  };

  const enriched = {
    ...manifest,
    files: (manifest.files ?? []).map((entry) => ({
      ...entry,
      download_url: `${base}/${entry.key}`,
    })),
  };

  return NextResponse.json(enriched, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" },
  });
}
