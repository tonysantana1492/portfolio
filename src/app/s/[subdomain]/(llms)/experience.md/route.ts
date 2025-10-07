import { type NextRequest, NextResponse } from "next/server";

import { profileRepository } from "@/repository/profile.repository";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    subdomain: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { subdomain } = await params;
  try {
    if (!subdomain) {
      return NextResponse.json(
        { error: "Subdomain is required" },
        { status: 400 },
      );
    }

    const profile = await profileRepository.getProfileBySubdomain(subdomain);

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
      .join("\n\n"),
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
      { status: 500 },
    );
  }
}
