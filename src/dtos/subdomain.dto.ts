import { z } from "zod";

import { IsoDateSchema, ObjectIdSchema } from "@/dtos/base.dto";

export const SubdomainSchema = z
  .object({
    id: ObjectIdSchema,
    subdomain: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/i, "Only letters, numbers and hyphens"),
    emoji: z.string().min(1),
    profileId: ObjectIdSchema,
    createdAt: IsoDateSchema.optional(),
    updatedAt: IsoDateSchema.optional(),
    deletedAt: IsoDateSchema.optional(),
  })
  .strict();

export const SubdomainCreateSchema = z
  .object({
    ...SubdomainSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    }).shape,
  })
  .strict();

export const SubdomainUpdateSchema = SubdomainCreateSchema.partial().strict();

export type Subdomain = z.infer<typeof SubdomainSchema>;
export type SubdomainCreate = z.infer<typeof SubdomainCreateSchema>;
export type SubdomainUpdate = z.infer<typeof SubdomainUpdateSchema>;
