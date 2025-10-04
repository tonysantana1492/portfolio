import type { IProfile, Metadata } from "@/content/profile";
import prisma from "@/lib/prisma";

export async function getProfileByUsername(
  username: string
): Promise<IProfile | null> {
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        username: username,
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
    console.error("Error fetching profile:", error);
    return null;
  }
}

export async function getProfileBySubdomain(
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

    // First, get the subdomain record to validate it exists
    const subdomainRecord = await prisma.subdomain.findUnique({
      where: {
        subdomain: subdomain.trim(),
      },
    });

    if (!subdomainRecord) {
      return null;
    }

    // For now, we'll get the first active profile
    // Later you might want to associate profiles with subdomains
    const profile = await prisma.profile.findFirst({
      where: {
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
