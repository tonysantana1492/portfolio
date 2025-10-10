import type { Profile, ProfileCreate, ProfileUpdate } from "@/dtos/profile.dto";
import prisma from "@/lib/prisma";
import { subdomainRepository } from "@/repository/subdomains.repository";

export class ProfileRepository {
  async getProfileById(id: string) {
    const existingProfile = await prisma.profile.findUnique({
      where: {
        id,
      },
    });

    return existingProfile;
  }

  async getProfile(): Promise<Profile | null> {
    try {
      // Get the first active profile (assuming single profile for now)
      const profile = (await prisma.profile.findFirst({
        where: {
          isActive: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      })) as Profile | null;

      if (!profile) {
        return null;
      }

      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  async getProfileBySubdomain(subdomain: string): Promise<Profile | null> {
    try {
      // First try to get profile using the new relationship approach
      const profileFromRelation =
        await subdomainRepository.getProfileBySubdomainWithRelation(subdomain);

      if (profileFromRelation) {
        return profileFromRelation;
      }

      // Fallback to the old approach for backward compatibility
      // Validate subdomain input
      if (
        !subdomain ||
        typeof subdomain !== "string" ||
        subdomain.trim() === ""
      ) {
        return null;
      }

      // First, get the subdomain record to validate it exists
      const subdomainRecord = await prisma.subdomain.findUnique({
        where: {
          slug: subdomain.trim(),
        },
      });

      if (!subdomainRecord) {
        return null;
      }

      // For backward compatibility, get the first active profile if no relation exists
      const profile = (await prisma.profile.findFirst({
        where: {
          id: subdomainRecord.profileId,
          isActive: true,
        },
      })) as Profile | null;

      if (!profile) {
        return null;
      }

      return profile;
    } catch {
      return null;
    }
  }

  async createProfile(profile: ProfileCreate): Promise<Profile> {
    try {
      const newProfile = (await prisma.profile.create({
        data: profile,
      })) as Profile;

      return newProfile;
    } catch (error) {
      throw new Error(`Failed to create profile: ${error}`);
    }
  }

  async updateProfile(
    profileId: string,
    profile: ProfileUpdate
  ): Promise<Profile> {
    try {
      const profileUpdated = (await prisma.profile.updateMany({
        where: {
          id: profileId,
        },
        data: {
          ...profile,
        },
      })) as unknown as Profile;

      return profileUpdated;
    } catch (error) {
      throw new Error(`Failed to update profile ${error}`);
    }
  }

  async deleteProfileById(id: string): Promise<void> {
    try {
      await prisma.profile.updateMany({
        where: {
          id,
        },
        data: {
          isActive: false,
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw new Error(`Failed to delete profile ${error}`);
    }
  }
}

export const profileRepository = new ProfileRepository();
