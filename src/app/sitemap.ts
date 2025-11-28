import type { MetadataRoute } from "next";
import { cacheLife } from "next/cache";

import { SITE_INFO } from "@/config/site.config";
import { getAllPosts } from "@/services/blog";

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "yearly", priority: 1.0 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/resume/tony-santana", changeFrequency: "yearly", priority: 0.9 },
  { path: "/rss", changeFrequency: "daily", priority: 0.5 },
  { path: "/vcard", changeFrequency: "yearly", priority: 0.3 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";
  cacheLife("days");

  const baseUrl = (SITE_INFO.url || "").replace(/\/$/, "");

  // const nowIso = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${baseUrl}${r.path}`,
    // lastModified: nowIso,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  const rawPosts = await Promise.resolve(getAllPosts());
  const blogPages: MetadataRoute.Sitemap = rawPosts
    .filter((post) => post.slug)
    .map((post) => {
      const last =
        post?.metadata?.updatedAt ??
        post?.metadata?.createdAt ??
        "2025-11-27T00:00:00.000Z";
      return {
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(last).toISOString(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    });

  const seen = new Set<string>();
  const deduped = [...staticPages, ...blogPages].filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return deduped;
}
