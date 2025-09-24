import { PROFILE } from "@/content/profile";

const content = `# Certifications

${PROFILE.sections.certifications.items
  .map((item) => `- [${item.title}](${item.credentialURL})`)
  .join("\n")}
`;

export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
