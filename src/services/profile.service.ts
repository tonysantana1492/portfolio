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
import type { Profile, ProfileCreate } from "@/dtos/profile.dto";

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

  async createProfile(profileData: ProfileCreate) {
    const response = await fetch("/api/profile/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Error:", errorData);
      throw new Error(errorData.error || "Error creating profile");
    }

    const result = await response.json();

    return result;
  }
}

export const profileService = new ProfileService();
