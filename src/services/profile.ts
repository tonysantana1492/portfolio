import type { IProfile, Metadata } from "@/content/profile";
import prisma from "@/lib/prisma";
import { getProfileBySubdomainWithRelation } from "@/services/subdomains";

export async function getProfile(): Promise<IProfile | null> {
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

export async function getProfileBySubdomain(
  subdomain: string
): Promise<IProfile | null> {
  try {
    // First try to get profile using the new relationship approach
    const profileFromRelation = await getProfileBySubdomainWithRelation(
      subdomain
    );
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
        subdomain: subdomain.trim(),
      },
    });

    if (!subdomainRecord) {
      return null;
    }

    // For backward compatibility, get the first active profile if no relation exists
    const profile = await prisma.profile.findFirst({
      where: {
        profileId: subdomainRecord.profileId,
        isActive: true,
      },
    });

    if (!profile) {
      return null;
    }

    // Transform the database profile to match the IProfile interface
    const transformedProfile: IProfile = {
      id: profile.id,
      dateCreated: profile.dateCreated.toISOString().split("T")[0],
      dateUpdated: profile.dateUpdated.toISOString().split("T")[0],
      dateDeleted: profile.dateDeleted?.toISOString().split("T")[0] || "",
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
      metadata: profile.metadata as unknown as Metadata,
      sections: profile.sections as unknown as IProfile["sections"],
    };

    return transformedProfile;
  } catch {
    return null;
  }
}

export async function createProfile(
  profile: IProfile & { userId: string }
): Promise<IProfile> {
  try {
    await prisma.profile.create({
      data: {
        userId: profile.userId,
        profileId: profile.id,
        dateCreated: new Date(profile.dateCreated),
        dateUpdated: new Date(profile.dateUpdated),
        dateDeleted: profile.dateDeleted ? new Date(profile.dateDeleted) : null,
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

export async function updateProfile(profile: IProfile): Promise<IProfile> {
  try {
    await prisma.profile.updateMany({
      where: {
        profileId: profile.id,
      },
      data: {
        dateUpdated: new Date(profile.dateUpdated),
        dateDeleted: profile.dateDeleted ? new Date(profile.dateDeleted) : null,
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

export async function deleteProfile(profileId: string): Promise<void> {
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
