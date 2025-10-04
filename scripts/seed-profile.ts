import { PROFILE } from "@/content/profile";
import prisma from "@/lib/prisma";

async function seedProfile() {
  try {
    console.log("🌱 Seeding profile data...");

    // First, let's check if profile already exists
    const existingProfile = await prisma.profile.findUnique({
      where: {
        username: PROFILE.username,
      },
    });

    if (existingProfile) {
      console.log("📝 Updating existing profile...");

      await prisma.profile.update({
        where: {
          username: PROFILE.username,
        },
        data: {
          dateUpdated: new Date(),
          firstName: PROFILE.firstName,
          lastName: PROFILE.lastName,
          displayName: PROFILE.displayName,
          gender: PROFILE.gender,
          pronouns: PROFILE.pronouns,
          bio: PROFILE.bio,
          flipSentences: PROFILE.flipSentences,
          twitterUsername: PROFILE.twitterUsername,
          githubUserName: PROFILE.githubUserName,
          address: PROFILE.address,
          phoneNumber: PROFILE.phoneNumber,
          email: PROFILE.email,
          website: PROFILE.website,
          otherWebsites: PROFILE.otherWebsites,
          jobTitle: PROFILE.jobTitle,
          avatar: PROFILE.avatar,
          ogImage: PROFILE.ogImage,
          keywords: PROFILE.keywords,
          metadata: JSON.parse(JSON.stringify(PROFILE.metadata)),
          sections: JSON.parse(JSON.stringify(PROFILE.sections)),
          isActive: PROFILE.isActive,
        },
      });

      console.log("✅ Profile updated successfully!");
    } else {
      console.log("🆕 Creating new profile...");

      await prisma.profile.create({
        data: {
          profileId: PROFILE.id,
          dateCreated: new Date(PROFILE.dateCreated),
          dateUpdated: new Date(PROFILE.dateUpdated),
          dateDeleted: PROFILE.dateDeleted
            ? new Date(PROFILE.dateDeleted)
            : null,
          firstName: PROFILE.firstName,
          lastName: PROFILE.lastName,
          displayName: PROFILE.displayName,
          username: PROFILE.username,
          gender: PROFILE.gender,
          pronouns: PROFILE.pronouns,
          bio: PROFILE.bio,
          flipSentences: PROFILE.flipSentences,
          twitterUsername: PROFILE.twitterUsername,
          githubUserName: PROFILE.githubUserName,
          address: PROFILE.address,
          phoneNumber: PROFILE.phoneNumber,
          email: PROFILE.email,
          website: PROFILE.website,
          otherWebsites: PROFILE.otherWebsites,
          jobTitle: PROFILE.jobTitle,
          avatar: PROFILE.avatar,
          ogImage: PROFILE.ogImage,
          keywords: PROFILE.keywords,
          metadata: JSON.parse(JSON.stringify(PROFILE.metadata)),
          sections: JSON.parse(JSON.stringify(PROFILE.sections)),
          isActive: PROFILE.isActive,
        },
      });

      console.log("✅ Profile created successfully!");
    }

    const existingSubdomain = await prisma.subdomain.findUnique({
      where: {
        subdomain: PROFILE.username,
      },
    });

    if (!existingSubdomain) {
      await prisma.subdomain.create({
        data: {
          subdomain: PROFILE.username,
          emoji: "💼",
        },
      });
    }
  } catch (error) {
    throw error;
  }
}

seedProfile()
  .then(() => {
    console.log("🎉 Seeding completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seeding failed:", error);
    process.exit(1);
  });
