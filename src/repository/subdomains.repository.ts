import type { Profile } from "@/dtos/profile.dto";
import type { Subdomain } from "@/generated/prisma";
import prisma from "@/lib/prisma";

// interface SubdomainWithProfileId {
//   id: string;
//   subdomain: string;
//   emoji: string;
//   createdAt: Date;
//   updatedAt: Date;
//   profileId?: string | null;
// }

export function isValidIcon(str: string) {
  if (str.length > 10) {
    return false;
  }

  try {
    // Primary validation: Check if the string contains at least one emoji character
    // This regex pattern matches most emoji Unicode ranges
    const emojiPattern = /[\p{Emoji}]/u;
    if (emojiPattern.test(str)) {
      return true;
    }
  } catch (error) {
    // If the regex fails (e.g., in environments that don't support Unicode property escapes),
    // fall back to a simpler validation
    console.warn(
      "Emoji regex validation failed, using fallback validation",
      error
    );
  }

  // Fallback validation: Check if the string is within a reasonable length
  // This is less secure but better than no validation
  return str.length >= 1 && str.length <= 10;
}

class SubdomainRepository {
  async getSubdomain(subdomain: string) {
    try {
      return await prisma.subdomain.findUnique({
        where: {
          subdomain: subdomain,
        },
      });
    } catch (error) {
      throw new Error("Failed to get subdomain" + error);
    }
  }

  async getSubdomains() {
    try {
      const subdomains = await prisma.subdomain.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return subdomains.map(
        (item: { subdomain: string; emoji: string; createdAt: Date }) => ({
          subdomain: item.subdomain,
          emoji: item.emoji || "❓",
          createdAt: item.createdAt.getTime(),
        })
      );
    } catch (error) {
      throw new Error("Failed to fetch all subdomains" + error);
    }
  }

  async associateSubdomainWithProfile(
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
      throw new Error("Failed to associate subdomain with profile" + error);
    }
  }

  async getProfileBySubdomainWithRelation(
    subdomain: string
  ): Promise<Profile | null> {
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
      })) as Subdomain | null;

      if (!subdomainRecord) {
        return null;
      }

      // Check if profileId exists
      if (!subdomainRecord.profileId) {
        return null;
      }

      // Get the associated profile
      const profile = (await prisma.profile.findUnique({
        where: {
          id: subdomainRecord.profileId,
        },
      })) as Profile | null;

      if (!profile) {
        return null;
      }

      return profile;
    } catch (error) {
      throw new Error("Failed to get profile by subdomain" + error);
    }
  }

  async createSubdomainWithProfile({
    subdomain,
    emoji,
    profileId,
  }: {
    subdomain: string;
    emoji: string;
    profileId: string;
  }): Promise<boolean> {
    try {
      await prisma.subdomain.create({
        data: {
          subdomain,
          emoji,
          profileId,
        },
      });

      return true;
    } catch (error) {
      throw new Error("Failed to create subdomain with profile" + error);
    }
  }

  async getSubdomainsWithProfiles() {
    try {
      const subdomains = (await prisma.subdomain.findMany({
        orderBy: {
          createdAt: "desc",
        },
      })) as Subdomain[];

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
      throw new Error("Failed to get all subdomains with profiles" + error);
    }
  }

  async deleteSubdomainById(id: string): Promise<void> {
    try {
      await prisma.subdomain.updateMany({
        where: {
          id,
        },
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      throw new Error("Failed to delete user" + error);
    }
  }
}

export const subdomainRepository = new SubdomainRepository();
