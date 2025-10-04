import { NextResponse } from "next/server";

import { profileService } from "@/services/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await profileService.getProfile();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const experienceItems = profile.sections.experiences?.items;

    if (!experienceItems || experienceItems.length === 0) {
      const content = "# Experience\n\nNo experience available.";
      return new Response(content, {
        headers: {
          "Content-Type": "text/markdown;charset=utf-8",
        },
      });
    }

    const content = `# Experience

${experienceItems
  .map((item) =>
    item.positions
      .map((position) => {
        const skills =
          position.skills?.map((skill) => skill).join(", ") || "N/A";
        return `## ${position.title} | ${item.companyName}\n\nDuration: ${
          position.employmentPeriod.start
        } - ${
          position.employmentPeriod.end || "Present"
        }\n\nSkills: ${skills}\n\n${position.description?.trim()}`;
      })
      .join("\n\n")
  )
  .join("\n\n")}
`;

    return new Response(content, {
      headers: {
        "Content-Type": "text/markdown;charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating experience markdown:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
