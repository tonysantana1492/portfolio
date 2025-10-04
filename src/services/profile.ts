import type { IProfile, Metadata } from "@/content/profile";
import prisma from "@/lib/prisma";
export interface ProfileService {
  getProfile(): Promise<IProfile | null>;
  createProfile(profile: IProfile): Promise<IProfile>;
  updateProfile(profile: IProfile): Promise<IProfile>;
  deleteProfile(profileId: string): Promise<void>;
}

class ProfileServiceImpl implements ProfileService {
  async getProfile(): Promise<IProfile | null> {
    try {
      // Get the first active profile (assuming single profile for now)
      const profileData = await prisma.profile.findFirst({
        where: {
          isActive: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!profileData) {
        return null;
      }

      // Convert database model to IProfile interface
      const profile: IProfile = {
        id: profileData.profileId,
        dateCreated: profileData.dateCreated.toISOString().split("T")[0],
        dateUpdated: profileData.dateUpdated.toISOString().split("T")[0],
        dateDeleted: profileData.dateDeleted?.toISOString().split("T")[0] || "",
        isActive: profileData.isActive,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        displayName: profileData.displayName,
        username: profileData.username,
        gender: profileData.gender,
        pronouns: profileData.pronouns,
        bio: profileData.bio,
        flipSentences: profileData.flipSentences,
        twitterUsername: profileData.twitterUsername,
        githubUserName: profileData.githubUserName,
        address: profileData.address,
        phoneNumber: profileData.phoneNumber,
        email: profileData.email,
        website: profileData.website,
        otherWebsites: profileData.otherWebsites,
        jobTitle: profileData.jobTitle,
        avatar: profileData.avatar,
        ogImage: profileData.ogImage,
        keywords: profileData.keywords,
        metadata: profileData.metadata as unknown as Metadata,
        sections: profileData.sections as unknown as IProfile["sections"],
      };

      return profile;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  }

  async createProfile(profile: IProfile): Promise<IProfile> {
    try {
      await prisma.profile.create({
        data: {
          profileId: profile.id,
          dateCreated: new Date(profile.dateCreated),
          dateUpdated: new Date(profile.dateUpdated),
          dateDeleted: profile.dateDeleted
            ? new Date(profile.dateDeleted)
            : null,
          isActive: profile.isActive,
          firstName: profile.firstName,
          lastName: profile.lastName,
          displayName: profile.displayName,
          username: profile.username,
          gender: profile.gender,
          pronouns: profile.pronouns,
          bio: profile.bio,
          flipSentences: profile.flipSentences,
          twitterUsername: profile.twitterUsername,
          githubUserName: profile.githubUserName,
          address: profile.address,
          phoneNumber: profile.phoneNumber,
          email: profile.email,
          website: profile.website,
          otherWebsites: profile.otherWebsites,
          jobTitle: profile.jobTitle,
          avatar: profile.avatar,
          ogImage: profile.ogImage,
          keywords: profile.keywords,
          metadata: JSON.parse(JSON.stringify(profile.metadata)),
          sections: JSON.parse(JSON.stringify(profile.sections)),
        },
      });

      return profile;
    } catch (error) {
      console.error("Error creating profile:", error);
      throw new Error("Failed to create profile");
    }
  }

  async updateProfile(profile: IProfile): Promise<IProfile> {
    try {
      await prisma.profile.updateMany({
        where: {
          profileId: profile.id,
        },
        data: {
          dateUpdated: new Date(profile.dateUpdated),
          dateDeleted: profile.dateDeleted
            ? new Date(profile.dateDeleted)
            : null,
          isActive: profile.isActive,
          firstName: profile.firstName,
          lastName: profile.lastName,
          displayName: profile.displayName,
          username: profile.username,
          gender: profile.gender,
          pronouns: profile.pronouns,
          bio: profile.bio,
          flipSentences: profile.flipSentences,
          twitterUsername: profile.twitterUsername,
          githubUserName: profile.githubUserName,
          address: profile.address,
          phoneNumber: profile.phoneNumber,
          email: profile.email,
          website: profile.website,
          otherWebsites: profile.otherWebsites,
          jobTitle: profile.jobTitle,
          avatar: profile.avatar,
          ogImage: profile.ogImage,
          keywords: profile.keywords,
          metadata: JSON.parse(JSON.stringify(profile.metadata)),
          sections: JSON.parse(JSON.stringify(profile.sections)),
        },
      });

      return profile;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw new Error("Failed to update profile");
    }
  }

  async deleteProfile(profileId: string): Promise<void> {
    try {
      await prisma.profile.updateMany({
        where: {
          profileId: profileId,
        },
        data: {
          isActive: false,
          dateDeleted: new Date(),
        },
      });
    } catch (error) {
      console.error("Error deleting profile:", error);
      throw new Error("Failed to delete profile");
    }
  }
}

// Export singleton instance
export const profileService = new ProfileServiceImpl();

export async function migrateProfileToDatabase(
  profile: IProfile
): Promise<void> {
  try {
    // Check if profile already exists
    const existingProfile = await profileService.getProfile();

    if (existingProfile) {
      console.log("Profile already exists in database, updating...");
      await profileService.updateProfile(profile);
    } else {
      console.log("Creating new profile in database...");
      await profileService.createProfile(profile);
    }

    console.log("Profile migration completed successfully!");
  } catch (error) {
    console.error("Error migrating profile to database:", error);
    throw error;
  }
}
