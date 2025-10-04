import { NextResponse } from "next/server";

import { profileService } from "@/services/profile";

export const dynamic = "force-dynamic"; // Changed to dynamic since we're fetching from database

export async function GET() {
  try {
    const profile = await profileService.getProfile();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const projectsItems = profile.sections.projects?.items;

    if (!projectsItems || projectsItems.length === 0) {
      const content = "# Projects\n\nNo projects available.";
      return new Response(content, {
        headers: {
          "Content-Type": "text/markdown;charset=utf-8",
        },
      });
    }

    const content = `# Projects

${projectsItems
  .map((item) => {
    const skills = item.skills?.length
      ? `\n\nSkills: ${item.skills.join(", ")}`
      : "";
    const description = item.description
      ? `\n\n${item.description.trim()}`
      : "";
    const projectUrl = item.link ? `\n\nProject URL: ${item.link}` : "";
    return `## ${item.title}${projectUrl}${skills}${description}`;
  })
  .join("\n\n")}
`;

    return new Response(content, {
      headers: {
        "Content-Type": "text/markdown;charset=utf-8",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating projects markdown:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
