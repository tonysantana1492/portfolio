import type { NextRequest } from "next/server";

import { ProfileCreateSchema } from "@/dtos/profile.dto";
import type { User } from "@/generated/prisma";
import { jsonError, jsonOk } from "@/lib/http";
import { profileRepository } from "@/repository/profile.repository";
import { subdomainRepository } from "@/repository/subdomains.repository";
import { userRepository } from "@/repository/user.repository";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return jsonError({
      title: "Subdomain is required",
      status: 400,
    });
  }

  try {
    const profile = await profileRepository.getProfileBySubdomain(subdomain);

    return jsonOk({ data: profile });
  } catch (error) {
    return jsonError({
      title: "Failed to fetch profile",
      detail: error,
      status: 500,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { success, error, data } = ProfileCreateSchema.safeParse(body);

    if (!success) {
      return jsonError({
        title: "Invalid profile data",
        detail: error,
        status: 400,
      });
    }

    // Check if username is already taken
    const existingProfile = await profileRepository.getProfileByUserName(
      data.username
    );

    if (existingProfile) {
      return jsonError({ title: "Username is already taken", status: 409 });
    }

    const existingSubdomain = await subdomainRepository.getSubdomain(
      data.username
    );

    if (existingSubdomain) {
      return jsonError({ title: "Username is already taken", status: 409 });
    }

    // Find or create a user
    let user: User | null;
    if (data.userId) {
      user = await userRepository.getUserById(data.userId);

      if (!user) {
        return jsonError({ title: "User not found", status: 404 });
      }
    } else {
      // If no userId provided, create a temporary user or find by email
      user = await userRepository.getUserByEmail(data.email);

      if (!user) {
        // Create a new user with basic information
        user = await userRepository.createUser({
          googleId: `temp_${Date.now()}`, // Temporary google ID
          email: data.email,
          name: `${data.firstName} ${data.lastName}`,
          picture: data.avatar,
          verified: false,
        });
      }
    }

    // Ensure we have a valid user
    if (!user) {
      return jsonError({ title: "Failed to create or find user", status: 500 });
    }

    // Create profile in database
    const newProfile = await profileRepository.createProfile(body);

    const subdomainCreated =
      await subdomainRepository.createSubdomainWithProfile({
        subdomain: data.username,
        emoji: "✨",
        profileId: newProfile.id,
      });

    if (!subdomainCreated) {
      // If subdomain creation fails, we should delete the profile to maintain consistency
      await profileRepository.deleteProfileById(newProfile.id);

      return jsonError({
        title: "Failed to create subdomain. Please try again.",
        status: 500,
      });
    }

    // Return created profile
    return jsonOk({
      data: {
        profile: newProfile,
        subdomain: data.username,
        message: "Profile and subdomain created successfully!",
      },
      status: 201,
    });
  } catch (error) {
    return jsonError({
      title: `Failed to create profile. Please try again: ${error}`,
      status: 500,
    });
  }
}
