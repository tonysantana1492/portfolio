import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site.config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = SITE_INFO.url.replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/print/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
