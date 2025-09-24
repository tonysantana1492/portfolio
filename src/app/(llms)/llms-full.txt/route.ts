import dayjs from "dayjs";

import { AWARDS } from "@/config/awards";
import { CERTIFICATIONS } from "@/config/certifications";
import { EXPERIENCES } from "@/config/experiences";
import { PROJECTS } from "@/config/projects";
import { SITE_INFO } from "@/config/site.config";
import { SOCIAL_LINKS } from "@/config/social-links.config";
import { TECH_STACK } from "@/config/tech-stack";
import { USER } from "@/config/user.config";
import { getLLMText } from "@/lib/get-llm-text";
import { getAllPosts } from "@/services/blog";

const allPosts = getAllPosts();

const aboutText = `## About

${USER.about.trim()}

### Personal Information

- First Name: ${USER.firstName}
- Last Name: ${USER.lastName}
- Display Name: ${USER.displayName}
- Location: ${USER.address}
- Website: ${USER.website}

### Social Links

${SOCIAL_LINKS.map((item) => `- [${item.title}](${item.href})`).join("\n")}

### Tech Stack

${TECH_STACK.map((item) => `- [${item.title}](${item.href})`).join("\n")}\n`;

const experienceText = `## Experience

${EXPERIENCES.map((item) =>
  item.positions
    .map((position) => {
      const skills = position.skills?.map((skill) => skill).join(", ") || "N/A";
      return `### ${position.title} | ${item.companyName}\n\nDuration: ${
        position.employmentPeriod.start
      } - ${
        position.employmentPeriod.end || "Present"
      }\n\nSkills: ${skills}\n\n${position.description?.trim()}`;
    })
    .join("\n\n")
).join("\n\n")}
`;

const projectsText = `## Projects

${PROJECTS.map((item) => {
  const skills = `\n\nSkills: ${item.skills.join(", ")}`;
  const description = item.description ? `\n\n${item.description.trim()}` : "";
  return `### ${item.title}\n\nProject URL: ${item.link}${skills}${description}`;
}).join("\n\n")}
`;

const awardsText = `## Awards

${AWARDS.map(
  (item) => `### ${item.prize} | ${item.title}\n\n${item.description}`
).join("\n\n")}
`;

const certificationsText = `## Certifications

${CERTIFICATIONS.map((item) => `- [${item.title}](${item.credentialURL})`).join(
  "\n"
)}`;

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
    USER.displayName
  }'s professional profile, portfolio, and blog content. It includes personal details, work experience, projects, achievements, certifications, and all published blog posts. This data is formatted for consumption by Large Language Models (LLMs) to provide accurate and up-to-date information about ${
    USER.displayName
  }'s background, skills, and expertise as a Design Engineer.</SYSTEM>

# tonysantana.dev

> A minimal portfolio, component registry, and blog to showcase my work as a Design Engineer.

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
