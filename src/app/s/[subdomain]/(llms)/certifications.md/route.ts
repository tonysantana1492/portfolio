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
        { status: 400 }
      );
    }

    const profile = await profileRepository.getProfileBySubdomain(subdomain);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const certificationsItems = profile.sections.certifications?.items;

    if (!certificationsItems || certificationsItems.length === 0) {
      const content = "# Certifications\n\nNo certifications available.";
      return new Response(content, {
        headers: {
          "Content-Type": "text/markdown;charset=utf-8",
        },
      });
    }

    const content = `# Certifications

${certificationsItems
  .map((item) => `- [${item.title}](${item.credentialURL})`)
  .join("\n")}
`;

    return new Response(content, {
      headers: {
        "Content-Type": "text/markdown;charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating certifications markdown:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
