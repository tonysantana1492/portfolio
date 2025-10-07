import { z } from "zod";

import {
  EmailSchema,
  IsoDateSchema,
  JsonSchema,
  ObjectIdSchema,
  PhoneSchema,
  UrlSchema,
} from "@/dtos/base.dto";
import {
  SubdomainBaseSchema,
  SubdomainCreateSchema,
} from "@/dtos/subdomain.dto";
import { UserBaseSchema } from "@/dtos/user.dto";

const StringArraySchema = z
  .array(z.string().transform((s) => s.trim()))
  .transform((arr) => arr.filter((s) => s.length > 0));

const BasicsSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  displayName: z.string().min(1),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9._-]+$/i, "Only letters, numbers, dot, underscore, hyphen")
    .transform((s) => s.trim()),
  gender: z.string().min(1),
  pronouns: z.string().min(1),
  bio: z.string().min(1),
  flipSentences: StringArraySchema,
  twitterUsername: z.string().min(1),
  githubUserName: z.string().min(1),
  address: z.string().min(1),
  phoneNumber: PhoneSchema,
  email: EmailSchema,
  website: UrlSchema,
  otherWebsites: z.array(UrlSchema).default([]),
  jobTitle: z.string().min(1),
  avatar: UrlSchema,
  ogImage: UrlSchema,
  keywords: StringArraySchema,
});

export const ProfileBaseSchema = z
  .object({
    id: ObjectIdSchema,
    profileId: z.string().min(1),
    isActive: z.boolean().default(true),

    userId: ObjectIdSchema,

    subdomains: z.array(SubdomainBaseSchema).optional(),

    // BASICS
    ...BasicsSchema.shape,

    // JSON
    sections: JsonSchema,

    createdAt: IsoDateSchema.default(() => new Date()),
    updatedAt: IsoDateSchema.default(() => new Date()),
  })
  .strict();

export const ProfileCreateSchema = z
  .object({
    profileId: z.string().min(1),
    isActive: z.boolean().optional(),

    userId: ObjectIdSchema,

    subdomains: z.array(SubdomainCreateSchema).optional(),

    // BASICS
    ...BasicsSchema.shape,

    sections: JsonSchema,
    createdAt: IsoDateSchema.default(() => new Date()),
    updatedAt: IsoDateSchema.default(() => new Date()),
  })
  .strict();

export const ProfileUpdateSchema = ProfileCreateSchema.partial().strict();

export type Profile = z.infer<typeof ProfileBaseSchema>;
export type ProfileCreate = z.infer<typeof ProfileCreateSchema>;
export type ProfileUpdate = z.infer<typeof ProfileUpdateSchema>;

export const UserWithProfilesSchema = UserBaseSchema.extend({
  profiles: z.array(ProfileBaseSchema).default([]),
}).strict();
export type UserWithProfiles = z.infer<typeof UserWithProfilesSchema>;
