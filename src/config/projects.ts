export type Project = {
  id: string;
  title: string;
  period: {
    start: string;
    end?: string;
  };
  link: string;
  skills: string[];
  description?: string;
  logo?: string;
  isExpanded?: boolean;
};

export const PROJECTS: Project[] = [
  {
    id: "react-wheel-picker",
    title: "React Wheel Picker",
    period: {
      start: "05.2025",
    },
    link: "https://react-wheel-picker.chanhdai.com",
    skills: [
      "Open Source",
      "React",
      "TypeScript",
      "Monorepo",
      "Turborepo",
      "pnpm-workspace",
      "Package Publishing",
      "NPM Registry",
      "GitHub Actions",
    ],
    description: `iOS-like wheel picker for React with smooth inertia scrolling and infinite loop support.
- 📱 Natural touch scrolling with smooth inertia effect
- 🖱️ Mouse drag and scroll support for desktop
- 🔄 Infinite loop scrolling
- 🎨 Unstyled components for complete style customization
- ⚡️ Easy installation via shadcn CLI

This project is proudly supported by:

[![Vercel OSS Program](https://vercel.com/oss/program-badge.svg)](https://vercel.com/oss)
`,
    logo: "https://assets.chanhdai.com/images/project-logos/react-wheel-picker.svg",
    isExpanded: true,
  },
  {
    id: "tonysantana.dev",
    title: "tonysantana.dev",
    period: {
      start: "01.2025",
    },
    link: "https://github.com/tonysantana1492/portfolio",
    skills: [
      "Open Source",
      "Next.js 15",
      "Tailwind CSS v4",
      "Radix UI",
      "Motion",
      "shadcn/ui",
      "Component Registry",
      "Vercel",
    ],
    description: `A minimal portfolio, component registry, and blog.
- Clean & modern design
- Light & Dark theme support
- vCard integration
- SEO optimization: [JSON-LD schema](https://json-ld.org), sitemap, robots
- AI-friendly [/llms.txt](https://llmstxt.org)
- Spam-protected email
- Installable PWA

Blog Features:
- MDX & Markdown support
- Syntax Highlighting for better readability
- RSS Feed for easy content distribution
- Dynamic OG Images for rich previews`,
    logo: "https://assets.chanhdai.com/images/project-logos/chanhdaidotcom.svg",
  },
];
