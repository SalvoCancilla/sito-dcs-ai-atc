import { NextResponse } from "next/server";

import { createSupabasePublicClient } from "@/lib/supabase/server";
import { SUPABASE_URL } from "@/lib/supabase/config";
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
    // TEMP DEBUG: reveal which project the deployed function talks to and
    // how many rows the anon role can see (remove after diagnosis).
    const { count, error: countError } = await supabase
      .from("model_manifests")
      .select("*", { count: "exact", head: true });
    return NextResponse.json(
      {
        error: "No manifest published",
        code: "no_manifest",
        debug: {
          host: new URL(SUPABASE_URL).host,
          visible_rows: count,
          count_error: countError?.message ?? null,
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
