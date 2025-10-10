import type { NextRequest } from "next/server";

import { ProfileCreateSchema } from "@/dtos/profile.dto";
import { jsonError, jsonOk } from "@/lib/http";
import { profileRepository } from "@/repository/profile.repository";
import { subdomainRepository } from "@/repository/subdomains.repository";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return jsonError({
      message: "Subdomain is required",
      status: 400,
    });
  }

  try {
    const profile = await profileRepository.getProfileBySubdomain(subdomain);

    return jsonOk({ data: profile });
  } catch (error) {
    return jsonError({
      message: "Failed to fetch profile",
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
        message: "Invalid profile data",
        detail: error,
        status: 400,
      });
    }

    const existingSubdomain = await subdomainRepository.getSubdomainBySlug(
      data.username
    );

    if (existingSubdomain) {
      return jsonError({ message: "Username is already taken", status: 409 });
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
        message: "Failed to create subdomain. Please try again.",
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
      message: `Failed to create profile. Please try again: ${error}`,
      status: 500,
    });
  }
}
