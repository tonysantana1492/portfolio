import dayjs from "dayjs";

import { SITE_INFO } from "@/config/site.config";
import { getAllPosts } from "@/services/blog";

export function GET() {
  const allPosts = getAllPosts();

  const itemsXml = allPosts
    .map(
      (post) =>
        `<item>
          <title>${post.metadata.title}</title>
          <link>${SITE_INFO.url}/blog/${post.slug}</link>
          <description>${post.metadata.description || ""}</description>
          <pubDate>${dayjs(post.metadata.createdAt).toISOString()}</pubDate>
        </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Blog | ${SITE_INFO.name}</title>
      <link>${SITE_INFO.url}</link>
      <description>${SITE_INFO.description}</description>
      <language>es-ES</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <atom:link href="${
        SITE_INFO.url
      }/rss" rel="self" type="application/rss+xml" />
      ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Robots-Tag": "noindex, follow",
    },
  });
}
