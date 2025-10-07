import type { NextRequest } from "next/server";

import { getSiteInfo } from "@/config/site.config";
import { profileRepository } from "@/repository/profile.repository";
import { profileService } from "@/services/profile.service";

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

  const allPosts = profileService.getPosts();
  const profile = await profileRepository.getProfileBySubdomain(subdomain);

  if (!profile) {
    return new Response("Not Found", { status: 404 });
  }

  const siteInfo = getSiteInfo(profile);

  const content = `# ${siteInfo.url}

> A minimal portfolio and blog to showcase my work as a Senior Software Engineer.

- [About](${
    siteInfo.url
  }/about.md): A quick intro to me, my tech stack, and how to connect.
- [Experience](${
    siteInfo.url
  }/experience.md): Highlights from my career and key roles I've taken on.
- [Projects](${
    siteInfo.url
  }/projects.md): Selected projects that show my skills and creativity.
- [Awards](${siteInfo.url}/awards.md): My key awards and honors.
- [Certifications](${
    siteInfo.url
  }/certifications.md): Certifications and credentials I've earned.

## Blog

${allPosts
  .map(
    (item) =>
      `- [${item.metadata.title}](${siteInfo.url}/blog/${item.slug}.mdx): ${item.metadata.description}`,
  )
  .join("\n")}
`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
