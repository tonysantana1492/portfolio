import { z } from "zod";

export const ObjectIdSchema = z
  .string()
  .regex(/^[a-f\d]{24}$/i, "Invalid ObjectId");

export const IsoDateSchema = z.preprocess((v) => {
  if (v instanceof Date) return v;
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return v;
}, z.date({ message: "Invalid date" }));

export const UrlSchema = z.url("Invalid URL");

export const EmailSchema = z
  .email("Invalid email")
  .transform((s) => s.toLowerCase());

export const PhoneSchema = z
  .string()
  .min(5, "Phone too short")
  .max(40, "Phone too long");

export const JsonSchema: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(JsonSchema),
    z.record(z.string(), JsonSchema),
  ])
);
