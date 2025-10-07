import { z } from "zod";

import { IsoDateSchema, ObjectIdSchema } from "@/dtos/base.dto";

export const SubdomainBaseSchema = z
  .object({
    id: ObjectIdSchema,
    subdomain: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/i, "Only letters, numbers and hyphens"),
    emoji: z.string().min(1),
    profileId: ObjectIdSchema,
    createdAt: IsoDateSchema,
    updatedAt: IsoDateSchema,
  })
  .strict();

export const SubdomainCreateSchema = z
  .object({
    subdomain: z
      .string()
      .min(1)
      .regex(/^[a-z0-9-]+$/i, "Only letters, numbers and hyphens"),
    emoji: z.string().min(1),
    profileId: ObjectIdSchema,
  })
  .strict();

export const SubdomainUpdateSchema = SubdomainCreateSchema.partial().strict();

export type SubdomainBase = z.infer<typeof SubdomainBaseSchema>;
export type SubdomainCreate = z.infer<typeof SubdomainCreateSchema>;
export type SubdomainUpdate = z.infer<typeof SubdomainUpdateSchema>;
