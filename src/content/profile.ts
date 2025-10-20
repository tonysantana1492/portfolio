export interface Section<T = any> {
  id: string;
  name: string;
  columns: number;
  content?: string;
  visible: boolean;
  separateLinks: boolean;
  items: T[];
  icon: string;
}

export type TechStack = {
  key: string; // Unique identifier used to fetch the corresponding icon
  title: string; // Display name of the technology
  href: string; // Official website URL of the technology
  categories: string[];
  theme?: boolean; // If `true`, the icon changes based on dark and light mode
  // Icon paths:
  // - Default: ./public/tech-stack-icons/[key].svg
  // - Dark mode (if `theme: true`): ./public/tech-stack-icons/[key]-dark.svg
  // - Light mode (if `theme: true`): ./public/tech-stack-icons/[key]-light.svg
};

export type SocialLink = {
  icon: string;
  title: string;
  description?: string;
  href: string;
};

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

export type ExperiencePosition = {
  id: string;
  title: string;
  employmentPeriod: {
    start: string;
    end?: string;
  };
  location?: string;
  employmentType?: string;
  description?: string;
  icon?: string;
  skills?: string[];
  isExpanded?: boolean;
};

export type Experience = {
  id: string;
  companyName: string;
  companyLogo?: string;
  positions: ExperiencePosition[];
  isCurrentEmployer?: boolean;
  website?: string;
};

export type Certification = {
  title: string;
  issuer: string;
  issuerLogoURL?: string;
  issuerIconName?: string;
  issueDate: string;
  credentialID: string;
  credentialURL: string;
};

export type Award = {
  id: string;
  prize: string;
  title: string;
  date: string;
  grade: string;
  description?: string;
  referenceLink?: string;
};

export type About = {
  id: string;
  title: string;
  icon?: string;
  content: string;
};

export interface Metadata {
  css: {
    value: string;
    visible: boolean;
  };
  page: {
    format: "a4" | "letter";
    margin: number; // in mm
    options: {
      breakLine: boolean;
      pageNumbers: boolean;
    };
  };
  theme: {
    text: string;
    primary: string;
    background: string;
  };
  template: string;
  typography: {
    font: {
      size: number; // in px
      family: string;
      subset:
        | "latin"
        | "latin-ext"
        | "cyrillic"
        | "cyrillic-ext"
        | "greek"
        | "greek-ext"
        | "vietnamese"
        | "devanagari"
        | "hebrew"
        | "arabic";
      variants: ("regular" | "italic" | "700" | "700italic")[];
    };
    hideIcons: boolean;
    lineHeight: number; // e.g., 1.5, 1.75
    underlineLinks: boolean;
  };
}

export interface IProfile {
  id: string;
  dateCreated: string;
  dateUpdated: string;
  dateDeleted: string;
  isActive: boolean;
  firstName: string;
  lastName: string;
  displayName: string;
  username: string;
  gender: string;
  pronouns: string;
  bio: string;
  flipSentences: string[];
  twitterUsername: string;
  githubUserName: string;
  address: string;
  phoneNumber: string; // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  email: string; // base64 encoded
  website: string;
  otherWebsites: string[];
  jobTitle: string;
  avatar: string;
  ogImage: string;
  keywords: string[];
  metadata: Metadata;
  // SECTIONS
  sections: {
    about?: Section;
    awards?: Section<Award>;
    techStack?: Section<TechStack>;
    projects?: Section<Project>;
    experiences?: Section<Experience>;
    educations?: Section<Experience>;
    certifications?: Section<Certification>;
    socialLinks?: Section<SocialLink>;
  };
}

export const PROFILE: IProfile = {
  // BASE
  id: "123456789",
  dateCreated: "2025-09-23",
  dateUpdated: "2025-09-23",
  dateDeleted: "",
  isActive: true,

  // BASICS
  firstName: "Tony",
  lastName: "Santana",
  displayName: "Tony Santana",
  username: "tonysantana1492",
  gender: "male",
  pronouns: "he/him",
  bio: "Creating with code. Small details matter.",
  flipSentences: [
    "Creating with code. Small details matter.",
    "Software Engineer at OfficePuzzle",
    "Open Source Contributor",
  ],
  twitterUsername: "@tonysantana1492",
  githubUserName: "tonysantana1492",
  address: "Miami, USA",
  phoneNumber: "KzEgNzg2IDczNSA3NzQ5", // E.164 format, base64 encoded (https://t.io.vn/base64-string-converter)
  email: "dG9ueXNhbnRhbmExNDkyQGdtYWlsLmNvbQ==", // base64 encoded
  website: "https://tonysantana1492.com",
  otherWebsites: [],
  jobTitle: "Software Engineer at OfficePuzzle",
  avatar: "/images/avatar.jpg",
  ogImage: "/images/avatar.jpg",
  keywords: [
    "senior software engineer",
    "fullstack",
    "project manager",
    "react",
    "next",
    "node",
    "nestjs",
    "typescript",
    "javascript",
    "sql",
    "mongodb",
    "aws",
    "docker",
    "clean code",
    "open source",
  ],
  metadata: {
    css: {
      value: "* {\n\toutline: 1px solid #000;\n\toutline-offset: 4px;\n}",
      visible: false,
    },
    page: {
      format: "a4",
      margin: 14,
      options: {
        breakLine: true,
        pageNumbers: true,
      },
    },
    theme: {
      text: "#000000",
      primary: "#dc2626",
      background: "#ffffff",
    },
    template: "ditto",
    typography: {
      font: {
        size: 13,
        family: "Arial",
        subset: "latin",
        variants: ["regular"],
      },
      hideIcons: false,
      lineHeight: 1.75,
      underlineLinks: true,
    },
  },

  // SECTIONS
  sections: {
    about: {
      id: "about",
      name: "Summary",
      icon: "user",
      columns: 1,
      visible: true,
      separateLinks: false,
      content: `Senior Software Engineer Full‑Stack with 7+ years of experience spanning the entire web product lifecycle. I apply clean code principles, SOLID patterns, and design patterns while working comfortably across frontend (React/Next.js) and backend (NestJS/Node) with SQL/NoSQL databases and cloud deployments. In teams, I combine technical focus with project management and close collaboration with product teams.
      `,
      items: [],
    },
    techStack: {
      id: "tech-stack",
      name: "Tech Stack",
      icon: "ts",
      columns: 1,
      visible: true,
      separateLinks: false,
      items: [
        {
          key: "typescript",
          title: "TypeScript",
          href: "https://www.typescriptlang.org/",
          categories: ["Language"],
        },
        {
          key: "js",
          title: "JavaScript",
          href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
          categories: ["Language"],
        },
        {
          key: "python",
          title: "Python",
          href: "https://www.python.org/",
          categories: ["Language"],
        },
        {
          key: "nodejs",
          title: "Node.js",
          href: "https://nodejs.org/",
          categories: ["Runtime Environment"],
        },
        {
          key: "bun",
          title: "Bun",
          href: "https://bun.sh/",
          categories: ["Runtime Environment"],
        },
        {
          key: "react",
          title: "React",
          href: "https://react.dev/",
          categories: ["Library", "UI Library"],
        },
        {
          key: "nextjs2",
          title: "Next.js",
          href: "https://nextjs.org/",
          categories: ["Framework"],
          theme: true,
        },
        {
          key: "tailwindcss",
          title: "Tailwind CSS",
          href: "https://tailwindcss.com/",
          categories: ["Framework"],
        },
        {
          key: "shadcn-ui",
          title: "shadcn/ui",
          href: "https://ui.shadcn.com/",
          categories: ["Library", "Component Library"],
          theme: true,
        },
        {
          key: "radixui",
          title: "Radix UI",
          href: "https://www.radix-ui.com/",
          categories: ["Library", "Component Library"],
          theme: true,
        },
        {
          key: "motion",
          title: "Motion",
          href: "https://motion.dev/",
          categories: ["Library", "Animation"],
        },
        {
          key: "mobx-state-tree",
          title: "MobX-State-Tree",
          href: "https://mobx-state-tree.js.org/",
          categories: ["State Management"],
        },
        {
          key: "redux",
          title: "Redux",
          href: "https://redux.js.org/",
          categories: ["State Management"],
        },
        {
          key: "react-router",
          title: "React Router",
          href: "https://reactrouter.com/",
          categories: ["Library", "Navigation"],
          theme: true,
        },
        {
          key: "git",
          title: "Git",
          href: "https://git-scm.com/",
          categories: ["Version Control"],
        },
        {
          key: "docker",
          title: "Docker",
          href: "https://www.docker.com/",
          categories: ["Containerization"],
        },
        {
          key: "mysql",
          title: "MySQL",
          href: "https://www.mysql.com/",
          categories: ["Database"],
        },
        {
          key: "mongodb",
          title: "MongoDB",
          href: "https://www.mongodb.com/",
          categories: ["Database"],
        },
        {
          key: "redis",
          title: "Redis",
          href: "https://redis.io/",
          categories: ["Database"],
        },
        {
          key: "figma",
          title: "Figma",
          href: "https://www.figma.com/",
          categories: ["Tools", "Design"],
        },
        {
          key: "chatgpt",
          title: "ChatGPT",
          href: "https://chatgpt.com/",
          categories: ["Tools", "AI"],
          theme: true,
        },
      ],
    },
    projects: {
      id: "projects",
      name: "Projects",
      columns: 1,
      visible: true,
      separateLinks: false,
      icon: "project",
      items: [
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
          isExpanded: true,
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
          logo: "/images/logo.svg",
        },
      ],
    },
    experiences: {
      id: "experiences",
      name: "Experience",
      columns: 1,
      visible: true,
      separateLinks: false,
      icon: "BriefcaseBusinessIcon",
      items: [
        {
          id: "officepuzzle",
          companyName: "OfficePuzzle",
          website: "https://officepuzzle.com",
          companyLogo:
            "https://s3.amazonaws.com/cdn.officepuzzle.com/images/opzle-logo.png",
          positions: [
            {
              id: "1",
              title: "Software Engineer",
              employmentPeriod: {
                start: "09.2024",
              },
              employmentType: "Full-time",
              icon: "code",
              description: `- Development of scalable solutions to streamline provider–caregiver–admin interactions.
- Designed and built modules for calendar management, online support, and mobile applications to optimize operational workflows.
- Collaborated with security teams to ensure HIPAA compliance and system robustness.
- Developed a custom website builder (similar to Webflow) to offer agile, personalized digital services.
- Refactored core codebases, significantly improving app speed and resource efficiency.`,
              skills: [
                "Nuxt",
                "VueJS",
                "Vite",
                "Docker",
                "Microservices",
                "Scrum",
                "MongoDB",
                "TypeScript",
                "Git",
                "GitLab",
                "Bootstrap",
                "Element UI",
              ],
              isExpanded: true,
            },
          ],
          isCurrentEmployer: true,
        },
        {
          id: "falabella",
          companyName: "Falabella",
          website: "https://www.falabella.com",
          companyLogo:
            "https://media.licdn.com/dms/image/v2/D4E0BAQETDXHhZkUquA/company-logo_100_100/B4EZV8.beSH0AU-/0/1741558495510/falabella__logo?e=1761177600&v=beta&t=PQ7V0EUO457kwytoAf1zYwcjSJOUKJ9bBYgRwKUJFw8",
          positions: [
            {
              id: "2",
              title: "Senior Software Engineer",
              employmentPeriod: {
                start: "11.2023",
                end: "08.2024",
              },
              employmentType: "Full-time",
              icon: "code",
              description: `- Engineered and maintained key web applications within Falabella's SCC ecosystem.
- Worked closely with cross-functional teams to identify and implement process improvements.
- Introduced innovative solutions that enhanced team efficiency and product performance.
- Translated complex requirements into robust technical solutions.
- Reduced deployment time by 70% through CI/CD optimization and process tuning.`,
              skills: [
                "NestJS",
                "ReactJS",
                "Vite",
                "Swagger",
                "Storybook",
                "Docker",
                "Microservices",
                "Scrum",
                "PostgreSQL",
                "GCP",
                "JavaScript",
                "TypeScript",
                "Git",
                "GitLab",
                "TailwindCSS",
                "Redux",
                "CI/CD",
                "GraphQL",
                "Zod",
                "Shadcn",
              ],
              isExpanded: true,
            },
          ],
        },
        {
          id: "can",
          companyName: "Cuban Air Navigation Company",
          website: "https://www.can.com",
          positions: [
            {
              id: "3",
              title: "Software Engineer",
              employmentPeriod: {
                start: "05.2018",
                end: "10.2023",
              },
              employmentType: "Full-time",
              icon: "code",
              description: `- Centralized the management and analysis of the logs of 4 production applications using ElasticSearch and Kibana.
- Created a system for strategic objectives management, improving organization and control by 60%.
- Optimized HR workflows with automated statistical reporting.
- Built a system to manage 2000+ devices and 50+ services, improving IT efficiency.
- Refactored legacy code, improving usability and runtime by 10%.`,
              skills: [
                "NestJS",
                "ReactJS",
                "Docker",
                "Microservices",
                "Scrum",
                "MongoDB",
                "MySQL",
                "PostgreSQL",
                "Apache Kafka",
                "Elasticsearch",
                "ExtJS",
                "NodeJS",
                "Express",
                "JavaScript",
                "TypeScript",
                "Git",
                "GitLab",
                "TailwindCSS",
                "Linux",
                "Redux",
                "NextJS",
              ],
              isExpanded: true,
            },
            {
              id: "4",
              title: "Network Administrator",
              employmentPeriod: {
                start: "09.2016",
                end: "04.2018",
              },
              employmentType: "Full-time",
              icon: "business",
              description: `- Virtualized servers with PROMOX, accelerating deployments by 80% and reducing hardware costs.
- Implemented a digital signature server integrated with Active Directory, saving 10% in office supplies and increasing procedure speed by 70%.`,
              skills: [
                "PROMOX",
                "Virtualization",
                "Active Directory",
                "Linux",
                "Networking",
              ],
            },
          ],
        },
      ],
    },
    educations: {
      id: "educations",
      name: "Education",
      columns: 1,
      visible: true,
      separateLinks: false,
      icon: "GraduationCapIcon",
      items: [
        {
          id: "education",
          companyName: "Education",
          companyLogo:
            "https://media.licdn.com/dms/image/v2/C4E0BAQH1ZQoqDBwMag/company-logo_100_100/company-logo_100_100/0/1652597136359/cujaeredsocial_logo?e=1761177600&v=beta&t=zq3iuEsi8h16kFV0qJ_BOyUzyNvzTZPdsgg569oRTFY",
          positions: [
            {
              id: "1",
              title: "Telecommunications and Electronics Engineer",
              location: "Technological University of Havana (CUJAE)",
              employmentPeriod: {
                start: "09.2011",
                end: "06.2016",
              },
              icon: "GraduationCapIcon",
              description: `Bachelor's degree in Telecommunications and Electronics Engineering.`,
              skills: [
                "Electronics",
                "Telecommunications",
                "Mathematics",
                "Systems Design",
              ],
              isExpanded: true,
            },
          ],
        },
      ],
    },
    // certifications: {
    //   id: "certifications",
    //   name: "Certifications",
    //   columns: 1,
    //   visible: true,
    //   separateLinks: false,
    //   icon: "certificate",
    //   items: [
    //     {
    //       title: "Certificate of Trademark Registration No. 543682",
    //       issuer: "Intellectual Property Office of Viet Nam",
    //       issuerLogoURL: "companies/ipvietnam.webp",
    //       issueDate: "2025-05-08",
    //       credentialID: "543682",
    //       credentialURL:
    //         "https://drive.google.com/file/d/1x7YzlK1kyz16h28ux9k3KAwnZFAabsvq/view?usp=sharing",
    //     },
    //     {
    //       title: "Google Code-in 2016",
    //       issuer: "Google",
    //       issuerIconName: "google",
    //       issueDate: "2017-01-16",
    //       credentialID: "",
    //       credentialURL:
    //         "https://drive.google.com/file/d/162RXtAVIZEvfx6LvP3xeBj-cSI9ZpPUX/view?usp=sharing",
    //     },
    //   ],
    // },
    // awards: {
    //   id: "awards",
    //   name: "Awards & Honors",
    //   columns: 1,
    //   visible: true,
    //   separateLinks: false,
    //   icon: "award",
    //   items: [
    //     {
    //       id: "a144bd19-3706-4e4c-ba22-0e0d8302642a",
    //       prize: "1st Prize",
    //       title: "Can Tho City Young Informatics Contest 2014",
    //       date: "2014-05",
    //       grade: "Grade 8",
    //       description:
    //         "- Field: Creative Software\n- Project: Website Hành Trình Khám Phá Miền Tây",
    //       referenceLink:
    //         "https://drive.google.com/file/d/16bia3XoeVbSlfvg4FzVapQf3LVI8wUA-/view?usp=sharing",
    //     },
    //     {
    //       id: "d9dc1a25-7976-47f8-925e-051285822d54",
    //       prize: "Consolation Prize",
    //       title: "National Young Informatics Contest 2014",
    //       date: "2014-09",
    //       grade: "Grade 8",
    //       description:
    //         "- Organized in Hanoi\n- Field: Creative Software\n- Project: Website Hành Trình Khám Phá Miền Tây",
    //       referenceLink:
    //         "https://drive.google.com/file/d/16OOVuKBxFAnROU-pmhkDFkbljkmeO-kc/view?usp=sharing",
    //     },
    //   ],
    // },
    socialLinks: {
      id: "social-links",
      name: "Social Links",
      columns: 1,
      visible: true,
      separateLinks: true,
      icon: "Facebook",
      items: [
        {
          icon: "/images/link-icons/linkedin.webp",
          title: "LinkedIn",
          description: "tonysantana1492",
          href: "https://linkedin.com/in/tonysantana1492",
        },
        {
          icon: "/images/link-icons/github.webp",
          title: "GitHub",
          description: "tonysantana1492",
          href: "https://github.com/tonysantana1492",
        },
      ],
    },
  },
};
