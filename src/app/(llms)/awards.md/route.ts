import { PROFILE } from "@/content/profile";

const content = `# Awards

${PROFILE.sections.awards.items
  .map((item) => `## ${item.prize} | ${item.title}\n\n${item.description}`)
  .join("\n\n")}
`;

export const dynamic = "force-static";

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
