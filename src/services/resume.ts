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

export function getAllCVs() {
  return getMDXData(path.join(process.cwd(), "src/content/resume")).sort(
    (a, b) =>
      new Date(b.metadata.createdAt).getTime() -
      new Date(a.metadata.createdAt).getTime()
  );
}

export function getCvBySlug(slug: string) {
  return getAllCVs().find((cv) => cv.slug === slug);
}
