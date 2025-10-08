import { z } from "zod";

import { IsoDateSchema, ObjectIdSchema } from "@/dtos/base.dto";

export const SubdomainSchema = z
  .object({
    id: ObjectIdSchema,
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/i, "Only letters, numbers and hyphens"),
    icon: z.string().min(1),
    profileId: ObjectIdSchema,
    createdAt: IsoDateSchema.optional(),
    updatedAt: IsoDateSchema.optional(),
    deletedAt: IsoDateSchema.optional(),
    isActive: z.boolean().default(true),
  })
  .strict();

export const SubdomainCreateSchema = z
  .object({
    ...SubdomainSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      isActive: true,
    }).shape,
  })
  .strict();

export const SubdomainUpdateSchema = SubdomainCreateSchema.partial().strict();

export type Subdomain = z.infer<typeof SubdomainSchema>;
export type SubdomainCreate = z.infer<typeof SubdomainCreateSchema>;
export type SubdomainUpdate = z.infer<typeof SubdomainUpdateSchema>;
