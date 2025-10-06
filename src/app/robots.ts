import type { MetadataRoute } from "next";

import { APP_CONFIG } from "@/config/app.config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
      },
    ],
    sitemap: `${APP_CONFIG.URL}/sitemap.xml`,
  };
}
