import path from "node:path";
import { getMDXData } from "@/services/blog";

export type CvMetadata = {
  title: string;
  description: string;
  image?: string;
  category?: string;
  new?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Cv = {
  metadata: CvMetadata;
  slug: string;
  content: string;
};

export function getCVs() {
  return getMDXData(path.join(process.cwd(), "src/content/cv")).sort(
    (a, b) =>
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
  );
}

export function getCvBySlug(slug: string) {
  return getCVs().find((cv) => cv.slug === slug);
}
