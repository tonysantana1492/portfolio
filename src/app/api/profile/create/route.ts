import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

import type { IProfile } from "@/content/profile";
import type { User } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { createSubdomainWithProfile } from "@/services/profile-subdomain";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("111111111:", body);
    const {
      username,
      firstName,
      lastName,
      email,
      displayName,
      bio,
      gender = "",
      pronouns = "",
      flipSentences = [],
      twitterUsername = "",
      githubUserName = "",
      address = "",
      phoneNumber = "",
      website = "",
      otherWebsites = [],
      jobTitle = "",
      avatar = "",
      ogImage = "",
      keywords = [],
      userId, // Optional user ID from authentication
    } = body;

    // Validate required fields
    if (!username || !firstName || !email) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: username, firstName, lastName, email",
        },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error:
            "Invalid username format. Use only lowercase letters, numbers, and underscores (3-30 characters)",
        },
        { status: 400 }
      );
    }

    // Check if username is already taken
    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    const existingSubdomain = await prisma.subdomain.findUnique({
      where: { subdomain: username },
    });

    if (existingSubdomain) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    // Find or create a user
    let user: User | null;
    if (userId) {
      // If userId provided, find the existing user
      user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } else {
      // If no userId provided, create a temporary user or find by email
      user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Create a new user with basic information
        user = await prisma.user.create({
          data: {
            googleId: `temp_${Date.now()}`, // Temporary google ID
            email,
            name: `${firstName} ${lastName}`,
            picture: avatar,
            verified: false,
          },
        });
      }
    }

    // Ensure we have a valid user
    if (!user) {
      return NextResponse.json(
        { error: "Failed to create or find user" },
        { status: 500 }
      );
    }

    // Create profile data
    const profileId = uuidv4();
    const now = new Date();

    // Default metadata and sections for new profiles
    const defaultMetadata = {
      title: `${displayName} | lets0`,
      description: bio || `${displayName} - Start from zero, shine like one!`,
      keywords: ["lets0", "portfolio", "profile", ...keywords],
    };

    const defaultSections = {
      about: {
        name: "Sobre mí",
        items: [],
        url: "#about",
        visible: true,
      },
      socialLinks: {
        name: "Enlaces sociales",
        items: [],
        url: "#social",
        visible: true,
      },
      projects: {
        name: "Proyectos",
        items: [],
        url: "#projects",
        visible: true,
      },
      experiences: {
        name: "Experiencia",
        items: [],
        url: "#experience",
        visible: true,
      },
      educations: {
        name: "Educación",
        items: [],
        url: "#education",
        visible: true,
      },
    };

    // Create profile in database
    const newProfile = await prisma.profile.create({
      data: {
        profileId,
        dateCreated: now,
        dateUpdated: now,
        isActive: true,
        userId: user.id,
        firstName,
        lastName,
        displayName: displayName || `${firstName} ${lastName}`,
        username,
        gender,
        pronouns,
        bio:
          bio || `Nuevo miembro de lets0 - Start from zero, shine like one! ✨`,
        flipSentences:
          flipSentences.length > 0
            ? flipSentences
            : [
                `Hola, soy ${firstName}!`,
                "Nuevo en lets0",
                "Listo para brillar ✨",
              ],
        twitterUsername,
        githubUserName,
        address,
        phoneNumber,
        email,
        website,
        otherWebsites,
        jobTitle,
        avatar: avatar || "",
        ogImage: ogImage || "",
        keywords,
        metadata: defaultMetadata,
        sections: defaultSections,
      },
    });

    const subdomainCreated = await createSubdomainWithProfile(
      username,
      "✨",
      newProfile.id
    );

    if (!subdomainCreated) {
      console.error(
        "❌ Failed to create subdomain, rolling back profile creation"
      );
      // If subdomain creation fails, we should delete the profile to maintain consistency
      await prisma.profile.delete({
        where: { id: newProfile.id },
      });

      return NextResponse.json(
        { error: "Failed to create subdomain. Please try again." },
        { status: 500 }
      );
    }

    // Return created profile
    const responseProfile: Partial<IProfile> = {
      id: newProfile.profileId,
      username: newProfile.username,
      firstName: newProfile.firstName,
      lastName: newProfile.lastName,
      displayName: newProfile.displayName,
      email: newProfile.email,
      bio: newProfile.bio,
      isActive: newProfile.isActive,
    };

    return NextResponse.json({
      success: true,
      profile: responseProfile,
      subdomain: username,
      message: "Profile and subdomain created successfully!",
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile. Please try again." },
      { status: 500 }
    );
  }
}
