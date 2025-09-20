import type { MetadataRoute } from "next";

import { SITE_INFO } from "@/config/site.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: SITE_INFO.name,
    name: SITE_INFO.name,
    description: SITE_INFO.description,
    icons: SITE_INFO.icons,
    id: "/?utm_source=pwa",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    scope: "/",
    screenshots: SITE_INFO.screenshots,
  };
}
