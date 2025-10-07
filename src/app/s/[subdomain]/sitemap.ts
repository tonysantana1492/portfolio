import type { MetadataRoute } from "next";

import dayjs from "dayjs";

import { getSiteInfo } from "@/config/site.config";
import { profileRepository } from "@/repository/profile.repository";
import { profileService } from "@/services/profile.service";

const ALL_ROUTES = ["", "/blog"];

interface SitemapProps {
  params: {
    subdomain: string;
  };
}

export default async function sitemap({
  params,
}: SitemapProps): Promise<MetadataRoute.Sitemap> {
  // Validate subdomain parameter
  if (
    !params.subdomain ||
    typeof params.subdomain !== "string" ||
    params.subdomain.trim() === ""
  ) {
    return [];
  }

  const profile = await profileRepository.getProfileBySubdomain(
    params.subdomain
  );

  if (!profile) {
    return [];
  }

  const siteInfo = getSiteInfo(profile);

  const posts = profileService.getPosts().map((post) => ({
    url: `${siteInfo.url}/blog/${post.slug}`,
    lastModified: dayjs(post.metadata.updatedAt).toISOString(),
  }));

  const routes = ALL_ROUTES.map((route) => ({
    url: `${siteInfo.url}${route}`,
    lastModified: dayjs().toISOString(),
  }));

  return [...routes, ...posts];
}
