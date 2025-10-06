import { type NextRequest, NextResponse } from "next/server";

import { getProfileBySubdomain } from "@/services/profile";

export const dynamic = "force-dynamic"; // Changed to dynamic since we're fetching from database

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }
  try {
    const profile = await getProfileBySubdomain(subdomain);

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
