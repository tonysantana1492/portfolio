import type { IProfile, Metadata } from "@/content/profile";
import prisma from "@/lib/prisma";

// Extended types to handle the new profileId field
interface SubdomainWithProfileId {
  id: string;
  subdomain: string;
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
  profileId?: string | null;
}

/**
 * Associates a subdomain with a profile
 */
export async function associateSubdomainWithProfile(
  subdomain: string,
  profileId: string
): Promise<boolean> {
  try {
    await prisma.subdomain.update({
      where: {
        subdomain: subdomain,
      },
      data: {
        profileId: profileId,
      },
    });
    return true;
  } catch (error) {
    console.error("Error associating subdomain with profile:", error);
    return false;
  }
}

/**
 * Gets a profile by subdomain using the new relationship
 */
export async function getProfileBySubdomainWithRelation(
  subdomain: string
): Promise<IProfile | null> {
  try {
    // Validate subdomain input
    if (
      !subdomain ||
      typeof subdomain !== "string" ||
      subdomain.trim() === ""
    ) {
      return null;
    }

    // Get the subdomain record
    const subdomainRecord = (await prisma.subdomain.findUnique({
      where: {
        subdomain: subdomain.trim(),
      },
    })) as SubdomainWithProfileId | null;

    if (!subdomainRecord) {
      return null;
    }

    // Check if profileId exists
    if (!subdomainRecord.profileId) {
      return null;
    }

    // Get the associated profile
    const profile = await prisma.profile.findUnique({
      where: {
        id: subdomainRecord.profileId,
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
  } catch (error) {
    console.error("Error getting profile by subdomain:", error);
    return null;
  }
}

/**
 * Creates a subdomain and associates it with a profile
 */
export async function createSubdomainWithProfile(
  subdomain: string,
  emoji: string,
  profileId: string
): Promise<boolean> {
  try {
    await prisma.subdomain.create({
      data: {
        subdomain: subdomain,
        emoji: emoji,
        profileId: profileId,
      },
    });
    return true;
  } catch (error) {
    console.error("Error creating subdomain with profile:", error);
    return false;
  }
}

/**
 * Gets all subdomains with their associated profile information
 */
export async function getAllSubdomainsWithProfiles() {
  try {
    const subdomains = (await prisma.subdomain.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })) as SubdomainWithProfileId[];

    const subdomainsWithProfiles = await Promise.all(
      subdomains.map(async (subdomain) => {
        let profileInfo = null;

        if (subdomain.profileId) {
          const profile = await prisma.profile.findUnique({
            where: { id: subdomain.profileId },
            select: {
              username: true,
              displayName: true,
              firstName: true,
              lastName: true,
            },
          });
          profileInfo = profile;
        }

        return {
          subdomain: subdomain.subdomain,
          emoji: subdomain.emoji || "❓",
          createdAt: subdomain.createdAt.getTime(),
          profile: profileInfo,
        };
      })
    );

    return subdomainsWithProfiles;
  } catch (error) {
    console.error("Error fetching all subdomains with profiles:", error);
    return [];
  }
}
