import { z } from "zod";

import { IsoDateSchema, ObjectIdSchema } from "@/dtos/base.dto";

/** Enums */
export const PageFormatEnum = z.enum(["a4", "letter"]);
export const FontSubsetEnum = z.enum([
  "latin",
  "latin-ext",
  "cyrillic",
  "cyrillic-ext",
  "greek",
  "greek-ext",
  "vietnamese",
  "devanagari",
  "hebrew",
  "arabic",
]);
export const FontVariantEnum = z.enum([
  "regular",
  "italic",
  "700",
  "700italic",
]);

/** Atomic types */
export const TechStackSchema = z.object({
  key: z.string(),
  title: z.string(),
  href: z.url(),
  categories: z.array(z.string()),
  theme: z.boolean().optional(),
});

export type TechStack = z.infer<typeof TechStackSchema>;

export const SocialLinkSchema = z.object({
  icon: z.string(),
  title: z.string(),
  description: z.string().optional(),
  href: z.url(),
});

export type SocialLink = z.infer<typeof SocialLinkSchema>;

export const ProjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  period: z.object({
    start: z.string(),
    end: z.string().optional(),
  }),
  link: z.url(),
  skills: z.array(z.string()),
  description: z.string().optional(),
  logo: z.string().optional(),
  isExpanded: z.boolean().optional(),
});

export type Project = z.infer<typeof ProjectSchema>;

export const ExperiencePositionSchema = z.object({
  id: z.string(),
  title: z.string(),
  employmentPeriod: z.object({
    start: z.string(),
    end: z.string().optional(),
  }),
  location: z.string().optional(),
  employmentType: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  skills: z.array(z.string()).optional(),
  isExpanded: z.boolean().optional(),
});

export type ExperiencePosition = z.infer<typeof ExperiencePositionSchema>;

export const ExperienceSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  companyLogo: z.string().optional(),
  positions: z.array(ExperiencePositionSchema),
  isCurrentEmployer: z.boolean().optional(),
  website: z.string().url().optional(),
});

export type Experience = z.infer<typeof ExperienceSchema>;

export const CertificationSchema = z.object({
  title: z.string(),
  issuer: z.string(),
  issuerLogoURL: z.string().url().optional(),
  issuerIconName: z.string().optional(),
  issueDate: z.string(),
  credentialID: z.string(),
  credentialURL: z.string().url(),
});

export type Certification = z.infer<typeof CertificationSchema>;

export const AwardSchema = z.object({
  id: z.string(),
  prize: z.string(),
  title: z.string(),
  date: z.string(),
  grade: z.string(),
  description: z.string().optional(),
  referenceLink: z.string().url().optional(),
});

export type Award = z.infer<typeof AwardSchema>;

export const AboutSchema = z.object({
  id: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  content: z.string(),
});

export type About = z.infer<typeof AboutSchema>;

/** Metadata */
export const MetadataSchema = z.object({
  css: z.object({
    value: z.string(),
    visible: z.boolean(),
  }),
  page: z.object({
    format: PageFormatEnum,
    margin: z.number(), // mm
    options: z.object({
      breakLine: z.boolean(),
      pageNumbers: z.boolean(),
    }),
  }),
  theme: z.object({
    text: z.string(),
    primary: z.string(),
    background: z.string(),
  }),
  template: z.string(),
  typography: z.object({
    font: z.object({
      size: z.number(), // px
      family: z.string(),
      subset: FontSubsetEnum,
      variants: z.array(FontVariantEnum),
    }),
    hideIcons: z.boolean(),
    lineHeight: z.number(),
    underlineLinks: z.boolean(),
  }),
});

export type Metadata = z.infer<typeof MetadataSchema>;

/** Section<T> factory */
export const createSectionSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    id: z.string(),
    name: z.string(),
    columns: z.number().int().min(1),
    content: z.string().optional(),
    visible: z.boolean(),
    separateLinks: z.boolean(),
    items: z.array(item),
    icon: z.string(),
  });

/** Sections */
export const AboutSectionSchema = createSectionSchema(AboutSchema);
export const AwardsSectionSchema = createSectionSchema(AwardSchema);
export const TechStackSectionSchema = createSectionSchema(TechStackSchema);
export const ProjectsSectionSchema = createSectionSchema(ProjectSchema);
export const ExperiencesSectionSchema = createSectionSchema(ExperienceSchema);
export const EducationsSectionSchema = createSectionSchema(ExperienceSchema);
export const CertificationsSectionSchema =
  createSectionSchema(CertificationSchema);
export const SocialLinksSectionSchema = createSectionSchema(SocialLinkSchema);

export const ProfileSchema = z.object({
  id: ObjectIdSchema,
  isActive: z.boolean(),
  firstName: z.string(),
  lastName: z.string(),
  displayName: z.string(),
  username: z.string(),
  gender: z.string(),
  pronouns: z.string(),
  bio: z.string(),
  flipSentences: z.array(z.string()),
  twitterUsername: z.string(),
  githubUserName: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  email: z.email(),
  website: z.url(),
  otherWebsites: z.array(z.url()),
  jobTitle: z.string(),
  avatar: z.string(),
  ogImage: z.string(),
  keywords: z.array(z.string()),
  metadata: MetadataSchema,
  userId: ObjectIdSchema,
  sections: z.object({
    about: AboutSectionSchema.optional(),
    awards: AwardsSectionSchema.optional(),
    techStack: TechStackSectionSchema.optional(),
    projects: ProjectsSectionSchema.optional(),
    experiences: ExperiencesSectionSchema.optional(),
    educations: EducationsSectionSchema.optional(),
    certifications: CertificationsSectionSchema.optional(),
    socialLinks: SocialLinksSectionSchema.optional(),
  }),
  createdAt: IsoDateSchema.optional(),
  updatedAt: IsoDateSchema.optional(),
  deletedAt: IsoDateSchema.optional(),
});

export const ProfileCreateSchema = z
  .object({
    ...ProfileSchema.omit({
      id: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    }).shape,
  })
  .strict();

export const ProfileUpdateSchema = ProfileCreateSchema.partial().strict();

export type Profile = z.infer<typeof ProfileSchema>;
export type ProfileCreate = z.infer<typeof ProfileCreateSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;
