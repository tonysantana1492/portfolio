import dayjs from "dayjs";

import { SITE_INFO } from "@/config/site.config";
import { PROFILE } from "@/content/profile";
import { getLLMText } from "@/lib/get-llm-text";
import { getAllPosts } from "@/services/blog";

const allPosts = getAllPosts();

const aboutText = `## About

${PROFILE.about.content.trim()}

### Personal Information

- First Name: ${PROFILE.firstName}
- Last Name: ${PROFILE.lastName}
- Display Name: ${PROFILE.displayName}
- Location: ${PROFILE.address}
- Website: ${PROFILE.website}

### Social Links

${PROFILE.sections.socialLinks.items
  .map((item) => `- [${item.title}](${item.href})`)
  .join("\n")}

### Tech Stack

${PROFILE.sections.techStack.items
  .map((item) => `- [${item.title}](${item.href})`)
  .join("\n")}\n`;

const experienceText = `## Experience

${PROFILE.sections.experiences.items
  .map((item) =>
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
      .join("\n\n")
  )
  .join("\n\n")}
`;

const projectsText = `## Projects

${PROFILE.sections.projects.items
  .map((item) => {
    const skills = `\n\nSkills: ${item.skills.join(", ")}`;
    const description = item.description
      ? `\n\n${item.description.trim()}`
      : "";
    return `### ${item.title}\n\nProject URL: ${item.link}${skills}${description}`;
  })
  .join("\n\n")}
`;

const awardsText = `## Awards

${PROFILE.sections.awards.items
  .map((item) => `### ${item.prize} | ${item.title}\n\n${item.description}`)
  .join("\n\n")}
`;

const certificationsText = `## Certifications

${PROFILE.sections.certifications.items
  .map((item) => `- [${item.title}](${item.credentialURL})`)
  .join("\n")}`;

async function getBlogContent() {
  const text = await Promise.all(
    allPosts.map(
      async (item) =>
        `---\ntitle: "${item.metadata.title}"\ndescription: "${
          item.metadata.description
        }"\nlast_updated: "${dayjs(item.metadata.updatedAt).format(
          "MMMM D, YYYY"
        )}"\nsource: "${SITE_INFO.url}/blog/${
          item.slug
        }"\n---\n\n${await getLLMText(item)}`
    )
  );
  return text.join("\n\n");
}

async function getContent() {
  return `<SYSTEM>This document contains comprehensive information about ${
    PROFILE.displayName
  }'s professional profile, portfolio, and blog content. It includes personal details, work experience, projects, achievements, certifications, and all published blog posts. This data is formatted for consumption by Large Language Models (LLMs) to provide accurate and up-to-date information about ${
    PROFILE.displayName
  }'s background, skills, and expertise as a Design Engineer.</SYSTEM>

# ${PROFILE.website}

> A minimal portfolio, component registry, and blog to showcase my work.

${aboutText}
${experienceText}
${projectsText}
${awardsText}
${certificationsText}

## Blog

${await getBlogContent()}`;
}

export const dynamic = "force-static";

export async function GET() {
  return new Response(await getContent(), {
    headers: {
      "Content-Type": "text/markdown;charset=utf-8",
    },
  });
}
