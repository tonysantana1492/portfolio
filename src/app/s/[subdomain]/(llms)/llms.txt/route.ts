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
      `- [${item.metadata.title}](${siteInfo.url}/blog/${item.slug}.mdx): ${item.metadata.description}`
  )
  .join("\n")}
`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
