import { PROFILE } from "@/content/profile";

const content = `# About

${PROFILE.about.content.trim()}

## Personal Information

- First Name: ${PROFILE.firstName}
- Last Name: ${PROFILE.lastName}
- Location: ${PROFILE.address}
- Website: ${PROFILE.website}

## Social Links

${
  PROFILE.sections.socialLinks?.items
    ?.map((item) => `- [${item.title}](${item.href})`)
    ?.join("\n") ?? ""
}

## Tech Stack

${
  PROFILE.sections.techStack?.items
    ?.map((item) => `- [${item.title}](${item.href})`)
    ?.join("\n") ?? ""
}\n`;

export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
