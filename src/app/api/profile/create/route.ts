import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

import type { IProfile } from "@/content/profile";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
    } = body;

    // Validate required fields
    if (!username || !firstName || !lastName || !email) {
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

    // Create subdomain entry
    await prisma.subdomain.create({
      data: {
        subdomain: username,
        emoji: "✨",
      },
    });

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
      message: "Profile created successfully!",
    });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile. Please try again." },
      { status: 500 }
    );
  }
}
