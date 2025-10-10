import { z } from "zod";

export const CvMetadataSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().max(500),
  image: z.url().optional(),
  category: z.string().max(50).optional(),
  new: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string().optional(),
  deleteAt: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const CvSchema = z.object({
  metadata: CvMetadataSchema,
  slug: z.string().min(2).max(100),
  content: z.string().min(10).max(10000),
});

export type CvType = z.infer<typeof CvSchema>;
export type CvMetadata = z.infer<typeof CvMetadataSchema>;
