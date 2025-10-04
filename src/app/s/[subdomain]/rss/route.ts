import dayjs from "dayjs";

import { getSiteInfo } from "@/config/site.config";
import { getAllPosts } from "@/services/blog";
import { profileService } from "@/services/profile";

export const dynamic = "force-static";

export async function GET() {
  const allPosts = getAllPosts();
  const profile = await profileService.getProfile();

  if (!profile) {
    return new Response("Not Found", { status: 404 });
  }
  const siteInfo = getSiteInfo(profile);

  const itemsXml = allPosts
    .map(
      (post) =>
        `<item>
          <title>${post.metadata.title}</title>
          <link>${siteInfo.url}/blog/${post.slug}</link>
          <description>${post.metadata.description || ""}</description>
          <pubDate>${dayjs(post.metadata.createdAt).toISOString()}</pubDate>
        </item>`
    )
    .join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Blog | ${siteInfo.name}</title>
      <link>${siteInfo.url}</link>
      <description>${siteInfo.description}</description>
      ${itemsXml}
    </channel>
  </rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "text/xml",
    },
  });
}
