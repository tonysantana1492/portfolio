import { z } from "zod";

import { EmailSchema, IsoDateSchema, ObjectIdSchema } from "@/dtos/base.dto";
import { ProfileSchema } from "@/dtos/profile.dto";

export const UserSchema = z.object({
  id: ObjectIdSchema,
  googleId: z.string().min(1),
  email: EmailSchema,
  name: z.string().min(1),
  picture: z.url().optional(),
  verified: z.boolean().default(false),
  createdAt: IsoDateSchema.optional(),
  updatedAt: IsoDateSchema.optional(),
  deletedAt: IsoDateSchema.optional(),
  isActive: z.boolean().default(true),
});

export const UserCreateSchema = z.object({
  ...UserSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
    isActive: true,
  }).shape,
});

export const UserUpdateSchema = UserCreateSchema.partial();

export type User = z.infer<typeof UserSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;

export const UserWithProfilesSchema = UserSchema.extend({
  profiles: z.array(ProfileSchema).default([]),
});
export type UserWithProfiles = z.infer<typeof UserWithProfilesSchema>;
