import { NextResponse } from "next/server";

import { profileService } from "@/services/profile";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await profileService.getProfile();

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
