import { SOCIAL_LINKS } from "@/config/social-links.config";
import { TECH_STACK } from "@/config/tech-stack";
import { USER } from "@/config/user.config";

const content = `# About

${USER.about.trim()}

## Personal Information

- First Name: ${USER.firstName}
- Last Name: ${USER.lastName}
- Location: ${USER.address}
- Website: ${USER.website}

## Social Links

${SOCIAL_LINKS.map((item) => `- [${item.title}](${item.href})`).join("\n")}

## Tech Stack

${TECH_STACK.map((item) => `- [${item.title}](${item.href})`).join("\n")}\n`;

export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
