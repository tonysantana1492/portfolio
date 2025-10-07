import { type NextRequest, NextResponse } from "next/server";

import dayjs from "dayjs";

import { getSiteInfo } from "@/config/site.config";
import { getLLMText } from "@/lib/get-llm-text";
import { profileRepository } from "@/repository/profile.repository";
import { profileService } from "@/services/profile.service";

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

    const allPosts = profileService.getPosts();
    const siteInfo = getSiteInfo(profile);

    const aboutText = `## About

${profile.sections.about?.content?.trim() ?? ""}

### Personal Information

- First Name: ${profile.firstName}
- Last Name: ${profile.lastName}
- Display Name: ${profile.displayName}
- Location: ${profile.address}
- Website: ${profile.website}

### Social Links

${
  profile.sections.socialLinks?.items
    ?.map((item) => `- [${item.title}](${item.href})`)
    ?.join("\n") ?? ""
}

### Tech Stack

${
  profile.sections.techStack?.items
    ?.map((item) => `- [${item.title}](${item.href})`)
    ?.join("\n") ?? ""
}\n`;

    const experienceText = `## Experience

${
  profile.sections.experiences?.items
    ?.map((item) =>
      item.positions
        .map((position) => {
          const skills =
            position.skills?.map((skill) => skill).join(", ") || "N/A";
          return `### ${position.title} | ${item.companyName}\n\nDuration: ${
            position.employmentPeriod.start
          } - ${
            position.employmentPeriod.end || "Present"
          }\n\nSkills: ${skills}\n\n${position.description?.trim()}`;
        })
        .join("\n\n"),
    )
    ?.join("\n\n") ?? ""
}
`;

    const projectsText = `## Projects

${
  profile.sections.projects?.items
    ?.map((item) => {
      const skills = item.skills?.length
        ? `\n\nSkills: ${item.skills.join(", ")}`
        : "";
      const description = item.description
        ? `\n\n${item.description.trim()}`
        : "";
      return `### ${item.title}\n\nProject URL: ${item.link}${skills}${description}`;
    })
    ?.join("\n\n") ?? ""
}
`;

    const awardsText = `## Awards

${
  profile.sections.awards?.items
    ?.map((item) => `### ${item.prize} | ${item.title}\n\n${item.description}`)
    ?.join("\n\n") ?? ""
}
`;

    const certificationsText = `## Certifications

${
  profile.sections.certifications?.items
    ?.map((item) => `- [${item.title}](${item.credentialURL})`)
    ?.join("\n") ?? ""
}`;

    async function getBlogContent() {
      const text = await Promise.all(
        allPosts.map(
          async (item) =>
            `---\ntitle: "${item.metadata.title}"\ndescription: "${
              item.metadata.description
            }"\nlast_updated: "${dayjs(item.metadata.updatedAt).format(
              "MMMM D, YYYY",
            )}"\nsource: "${siteInfo.url}/blog/${
              item.slug
            }"\n---\n\n${await getLLMText(item)}`,
        ),
      );
      return text.join("\n\n");
    }

    const content = `<SYSTEM>This document contains comprehensive information about ${
      profile.displayName
    }'s professional profile, portfolio, and blog content. It includes personal details, work experience, projects, achievements, certifications, and all published blog posts. This data is formatted for consumption by Large Language Models (LLMs) to provide accurate and up-to-date information about ${
      profile.displayName
    }'s background, skills, and expertise as a Design Engineer.</SYSTEM>

# ${profile.website}

> A minimal portfolio, component registry, and blog to showcase my work.

${aboutText}
${experienceText}
${projectsText}
${awardsText}
${certificationsText}

## Blog

${await getBlogContent()}`;

    return new Response(content, {
      headers: {
        "Content-Type": "text/markdown;charset=utf-8",
        "Cache-Control": "public, max-age=1800", // Cache for 30 minutes
      },
    });
  } catch (error) {
    console.error("Error generating full LLM content:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
