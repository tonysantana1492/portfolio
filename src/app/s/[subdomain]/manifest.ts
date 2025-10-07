import type { MetadataRoute } from "next";

import { getSiteInfo } from "@/config/site.config";
import { profileRepository } from "@/repository/profile.repository";

interface ManifestProps {
  params: {
    subdomain: string;
  };
}

export default async function manifest({
  params,
}: ManifestProps): Promise<MetadataRoute.Manifest> {
  // Validate subdomain parameter
  if (
    !params.subdomain ||
    typeof params.subdomain !== "string" ||
    params.subdomain.trim() === ""
  ) {
    return {};
  }

  const profile = await profileRepository.getProfileBySubdomain(
    params.subdomain
  );

  if (!profile) {
    return {};
  }

  const siteInfo = getSiteInfo(profile);

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
