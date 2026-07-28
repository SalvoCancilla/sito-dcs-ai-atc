import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/api";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/api/", "/success", "/cancel", "/login", "/register", "/download"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
