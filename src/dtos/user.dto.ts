import { z } from "zod";

import {
  EmailSchema,
  IsoDateSchema,
  ObjectIdSchema,
  UrlSchema,
} from "@/dtos/base.dto";

export const UserBaseSchema = z
  .object({
    id: ObjectIdSchema,
    googleId: z.string().min(1),
    email: EmailSchema,
    name: z.string().min(1),
    picture: z.string().url().optional(),
    verified: z.boolean().default(false),
    createdAt: IsoDateSchema,
    updatedAt: IsoDateSchema,
  })
  .strict();

export const UserCreateSchema = z
  .object({
    googleId: z.string().min(1),
    email: EmailSchema,
    name: z.string().min(1),
    picture: UrlSchema.optional(),
    verified: z.boolean().optional(),
  })
  .strict();

export const UserUpdateSchema = UserCreateSchema.partial().strict();

export type UserBase = z.infer<typeof UserBaseSchema>;
export type UserCreate = z.infer<typeof UserCreateSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
