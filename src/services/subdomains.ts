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

export async function getSubdomainData(subdomain: string) {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

  try {
    const data = await prisma.subdomain.findUnique({
      where: {
        subdomain: sanitizedSubdomain,
      },
      select: {
        emoji: true,
        createdAt: true,
      },
    });

    return data;
  } catch (error) {
    console.error("Error fetching subdomain:", error);
    return null;
  }
}

export async function getAllSubdomains() {
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
    console.error("Error fetching all subdomains:", error);
    return [];
  }
}
