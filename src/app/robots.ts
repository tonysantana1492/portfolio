import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/print/"],
      },
    ],
    sitemap: `${SITE_INFO.url}/sitemap.xml`,
  };
}
