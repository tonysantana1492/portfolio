import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { v4 as uuidv4 } from "uuid";

import type { IProfile } from "@/content/profile";
import type { User } from "@/generated/prisma";
import {
  createSubdomainWithProfile,
  getSubdomain,
} from "@/services/subdomains.service";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "@/services/user.service";
import {
  createProfile,
  deleteProfileById,
  getProfileByUserName,
} from "@/services/profile.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    // Check if username is already taken
    const existingProfile = await getProfileByUserName(username);

    if (existingProfile) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 409 }
      );
    }

    const existingSubdomain = await getSubdomain(username);

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
      user = await getUserById(userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
    } else {
      // If no userId provided, create a temporary user or find by email
      user = await getUserByEmail(email);

      if (!user) {
        // Create a new user with basic information
        user = await createUser({
          googleId: `temp_${Date.now()}`, // Temporary google ID
          email,
          name: `${firstName} ${lastName}`,
          picture: avatar,
          verified: false,
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

    // Create profile in database
    const newProfile = await createProfile(body);

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
      await deleteProfileById(newProfile.id);

      return NextResponse.json(
        { error: "Failed to create subdomain. Please try again." },
        { status: 500 }
      );
    }

    // Return created profile
    const responseProfile: Partial<IProfile> = {
      id: newProfile.id,
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
    return NextResponse.json(
      { error: "Failed to create profile. Please try again." },
      { status: 500 }
    );
  }
}
