import type { MetadataRoute } from "next";

import dayjs from "dayjs";

import { getSiteInfo } from "@/config/site.config";
import { getProfileBySubdomain } from "@/lib/profile";
import { getAllPosts } from "@/services/blog";

const ALL_ROUTES = ["", "/blog"];

interface SitemapProps {
  params: {
    subdomain: string;
  };
}

export default async function sitemap({
  params,
}: SitemapProps): Promise<MetadataRoute.Sitemap> {
  const profile = await getProfileBySubdomain(params.subdomain);

  if (!profile) {
    return [];
  }

  const siteInfo = getSiteInfo(profile);

  const posts = getAllPosts().map((post) => ({
    url: `${siteInfo.url}/blog/${post.slug}`,
    lastModified: dayjs(post.metadata.updatedAt).toISOString(),
  }));

  const routes = ALL_ROUTES.map((route) => ({
    url: `${siteInfo.url}${route}`,
    lastModified: dayjs().toISOString(),
  }));

  return [...routes, ...posts];
}
