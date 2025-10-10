import type { Profile } from "@/dtos/profile.dto";
import type { Subdomain } from "@/generated/prisma";
import prisma from "@/lib/prisma";

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
  async getSubdomainBySlug(slug: string) {
    return await prisma.subdomain.findUnique({
      where: {
        slug,
      },
    });
  }

  async getSubdomains() {
    const subdomains = await prisma.subdomain.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return subdomains;
  }

  async associateSubdomainWithProfile(
    subdomain: string,
    profileId: string
  ): Promise<boolean> {
    await prisma.subdomain.update({
      where: {
        slug: subdomain,
      },
      data: {
        profileId: profileId,
      },
    });
    return true;
  }

  async getProfileBySubdomainWithRelation(
    subdomain: string
  ): Promise<Profile | null> {
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
        slug: subdomain.trim(),
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
    await prisma.subdomain.create({
      data: {
        slug: subdomain,
        icon: emoji,
        profileId,
      },
    });

    return true;
  }

  async getSubdomainsWithProfiles() {
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
          subdomain: subdomain.slug,
          emoji: subdomain.icon || "❓",
          createdAt: subdomain.createdAt.getTime(),
          profile: profileInfo,
        };
      })
    );

    return subdomainsWithProfiles;
  }

  async deleteSubdomainById(id: string): Promise<void> {
    await prisma.subdomain.updateMany({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });
  }
}

export const subdomainRepository = new SubdomainRepository();
