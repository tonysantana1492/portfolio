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

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    const profile = await profileRepository.getProfileBySubdomain(subdomain);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const awardsItems = profile.sections.awards?.items;

    if (!awardsItems || awardsItems.length === 0) {
      const content = "# Awards\n\nNo awards available.";
      return new Response(content, {
        headers: {
          "Content-Type": "text/markdown;charset=utf-8",
        },
      });
    }

    const content = `# Awards

${awardsItems
  .map((item) => `## ${item.prize} | ${item.title}\n\n${item.description}`)
  .join("\n\n")}
`;

    return new Response(content, {
      headers: {
        "Content-Type": "text/markdown;charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating awards markdown:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
