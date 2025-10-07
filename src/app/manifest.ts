import type { MetadataRoute } from "next";

import { getSiteInfo } from "@/config/site.config";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const siteInfo = getSiteInfo();

  return {
    short_name: siteInfo.name,
    name: siteInfo.name,
    description: siteInfo.description,
    icons: siteInfo.icons,
    id: "/?utm_source=pwa",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    screenshots: siteInfo.screenshots,
    theme_color: "#000000",
    background_color: "#000000",
  };
}
