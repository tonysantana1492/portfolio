export type ExperiencePositionIcon =
  | "code"
  | "design"
  | "education"
  | "business"
  | "idea";

export type ExperiencePosition = {
  id: string;
  title: string;
  employmentPeriod: {
    start: string;
    end?: string;
  };
  employmentType?: string;
  description?: string;
  icon?: ExperiencePositionIcon;
  skills?: string[];
  isExpanded?: boolean;
};

export type Experience = {
  id: string;
  companyName: string;
  companyLogo?: string;
  positions: ExperiencePosition[];
  isCurrentEmployer?: boolean;
};

export const EXPERIENCES: Experience[] = [
  {
    id: "officepuzzle",
    companyName: "OfficePuzzle",
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
];

export const EDUCATIONS: Experience[] = [
  {
    id: "education",
    companyName: "Education",
    companyLogo:
      "https://media.licdn.com/dms/image/v2/C4E0BAQH1ZQoqDBwMag/company-logo_100_100/company-logo_100_100/0/1652597136359/cujaeredsocial_logo?e=1761177600&v=beta&t=zq3iuEsi8h16kFV0qJ_BOyUzyNvzTZPdsgg569oRTFY",
    positions: [
      {
        id: "1",
        title:
          "Telecommunications and Electronics Engineer — Technological University of Havana (CUJAE)",
        employmentPeriod: {
          start: "09.2011",
          end: "06.2016",
        },
        icon: "education",
        description: `- Bachelor's degree in Telecommunications and Electronics Engineering.`,
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
];
