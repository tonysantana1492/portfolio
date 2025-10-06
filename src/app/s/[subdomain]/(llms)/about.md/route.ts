import { type NextRequest, NextResponse } from "next/server";

import { getProfileBySubdomain } from "@/services/profile";

export const dynamic = "force-dynamic";

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

    const content = `# About

${profile.sections.about?.content ? profile.sections.about.content.trim() : ""}

## Personal Information

- First Name: ${profile.firstName}
- Last Name: ${profile.lastName}
- Location: ${profile.address}
- Website: ${profile.website}

## Social Links

${
  profile.sections.socialLinks?.items
    ?.map((item) => `- [${item.title}](${item.href})`)
    ?.join("\n") ?? ""
}

## Tech Stack

${
  profile.sections.techStack?.items
    ?.map((item) => `- [${item.title}](${item.href})`)
    ?.join("\n") ?? ""
}\n`;

    return new Response(content, {
      headers: {
        "Content-Type": "text/markdown;charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating about markdown:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
