interface ExportError {
  error: string;
}

interface ExportOptions {
  slug: string;
  format: "A4";
}

import path from "node:path";
import { getMDXData } from "@/lib/blog";

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

import type { Experience } from "@/content/profile";

class ProfileService {
  async exportToPdf(options: ExportOptions): Promise<Blob> {
    const response = await fetch("/api/export/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    if (!response.ok) {
      let errorMessage = "Unknown error occurred";

      try {
        const errorData: ExportError = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.blob();
  }

  getCVs() {
    return getMDXData(path.join(process.cwd(), "src/content/cv")).sort(
      (a, b) =>
        new Date(b.metadata.createdAt).getTime() -
        new Date(a.metadata.createdAt).getTime()
    );
  }

  getLastCompany = (experiences: Experience[]) => {
    return (
      experiences.find((job) => job.isCurrentEmployer) ||
      experiences.slice(-1)[0]
    );
  };

  getCvBySlug(slug: string) {
    return this.getCVs().find((cv) => cv.slug === slug);
  }

  getPosts() {
    return getMDXData(path.join(process.cwd(), "src/content/blog")).sort(
      (a, b) =>
        new Date(b.metadata.createdAt).getTime() -
        new Date(a.metadata.createdAt).getTime()
    );
  }

  getPostBySlug(slug: string) {
    return this.getPosts().find((post) => post.slug === slug);
  }

  getPostsByCategory(category: string) {
    return this.getPosts().filter(
      (post) => post.metadata?.category === category
    );
  }
}

export const profileService = new ProfileService();
