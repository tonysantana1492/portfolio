import type { Profile, ProfileCreate } from "@/dtos/profile.dto";

interface ExportError {
  error: string;
}

interface ExportOptions {
  slug: string;
  format: "A4";
}

class ProfileService {
  async exportToPdf(options: ExportOptions): Promise<Blob> {
    const response = await fetch("/api/profiles/export/pdf", {
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

  async createProfile(
    profileData: ProfileCreate
  ): Promise<{ profile: Profile; success: boolean }> {
    const response = await fetch("/api/profiles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error.message || "Error creating profile");
    }

    const result = await response.json();

    return result;
  }
}

export const profileService = new ProfileService();
