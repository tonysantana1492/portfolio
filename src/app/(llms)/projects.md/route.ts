import { PROFILE } from "@/content/profile";

const content = `# Projects

${PROFILE.sections.projects?.items
  .map((item) => {
    const skills = `\n\nSkills: ${item.skills.join(", ")}`;
    const description = item.description
      ? `\n\n${item.description.trim()}`
      : "";
    return `## ${item.title}\n\nProject URL: ${item.link}${skills}${description}`;
  })
  .join("\n\n")}
`;

export async function GET() {
  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
