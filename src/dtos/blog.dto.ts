import { z } from "zod";

export const PostMetadataSchema = z.object({
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

export const PostSchema = z.object({
  metadata: PostMetadataSchema,
  slug: z.string().min(2).max(100),
  content: z.string().min(10).max(10000),
});

export type PostMetadata = z.infer<typeof PostMetadataSchema>;
export type Post = z.infer<typeof PostSchema>;
