import type { MetadataRoute } from "next";

import dayjs from "dayjs";

import { SITE_INFO } from "@/config/site.config";
import { getAllPosts } from "@/data/blog";

const ALL_ROUTES = ["", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((post) => ({
    url: `${SITE_INFO.url}/blog/${post.slug}`,
    lastModified: dayjs(post.metadata.updatedAt).toISOString(),
  }));

  const routes = ALL_ROUTES.map((route) => ({
    url: `${SITE_INFO.url}${route}`,
    lastModified: dayjs().toISOString(),
  }));

  return [...routes, ...posts];
}
