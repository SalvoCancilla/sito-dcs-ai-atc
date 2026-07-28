import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/api";

const PAGES: Array<{
  path: string;
  priority: number;
  changefreq: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastMod?: string;
}> = [
  { path: "/", priority: 1, changefreq: "weekly" },
  { path: "/features", priority: 0.9, changefreq: "monthly", lastMod: "2026-06-28" },
  { path: "/roadmap", priority: 0.7, changefreq: "monthly", lastMod: "2026-07-02" },
  { path: "/pricing", priority: 0.9, changefreq: "monthly", lastMod: "2026-06-28" },
  { path: "/faq", priority: 0.8, changefreq: "monthly", lastMod: "2026-06-28" },
  { path: "/docs", priority: 0.6, changefreq: "monthly", lastMod: "2026-06-28" },
  { path: "/support", priority: 0.6, changefreq: "monthly", lastMod: "2026-06-28" },
  { path: "/login", priority: 0.3, changefreq: "yearly" },
  { path: "/register", priority: 0.5, changefreq: "yearly" },
  { path: "/download", priority: 0.4, changefreq: "monthly" },
  { path: "/success", priority: 0.2, changefreq: "yearly" },
  { path: "/cancel", priority: 0.2, changefreq: "yearly" },
  { path: "/legal/privacy", priority: 0.3, changefreq: "yearly", lastMod: "2026-06-28" },
  { path: "/legal/terms", priority: 0.3, changefreq: "yearly", lastMod: "2026-06-28" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();
  return PAGES.map((p) => ({
    url: `${base}${p.path}`,
    lastModified: p.lastMod ? new Date(p.lastMod) : now,
    changeFrequency: p.changefreq,
    priority: p.priority,
  }));
}
