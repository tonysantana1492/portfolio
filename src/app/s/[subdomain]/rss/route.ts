import type { NextRequest } from "next/server";

import dayjs from "dayjs";

import { getSiteInfo } from "@/config/site.config";
import { getPosts } from "@/services/blog";
import { getProfileBySubdomain } from "@/services/profile.service";

export const dynamic = "force-static";

interface RouteParams {
  params: Promise<{
    subdomain: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { subdomain } = await params;

  if (!subdomain) {
    return new Response("Subdomain is required", { status: 400 });
  }

  const allPosts = getPosts();
  const profile = await getProfileBySubdomain(subdomain);

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
