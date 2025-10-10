import type { NextRequest } from "next/server";

import { jsonError, jsonOk } from "@/lib/http";
import { profileRepository } from "@/repository/profile.repository";
import { subdomainRepository } from "@/repository/subdomains.repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subdomain, profileId } = body;

    if (!subdomain || !profileId) {
      return jsonError({
        message: "Subdomain and profileId are required",
        status: 400,
      });
    }

    // Verify subdomain exists
    const existingSubdomain = await subdomainRepository.getSubdomainBySlug(
      subdomain
    );

    if (!existingSubdomain) {
      return jsonError({ message: "Subdomain not found", status: 404 });
    }

    // Verify profile exists
    const existingProfile = await profileRepository.getProfileById(profileId);

    if (!existingProfile) {
      return jsonError({ message: "Profile not found", status: 404 });
    }

    // Associate subdomain with profile
    const success = await subdomainRepository.associateSubdomainWithProfile(
      subdomain,
      profileId
    );

    if (!success) {
      return jsonError({
        message: "Failed to associate subdomain with profile",
        status: 500,
      });
    }

    return jsonOk({
      data: {
        success: true,
        message: "Subdomain successfully associated with profile",
      },
    });
  } catch (error) {
    return jsonError({
      message: "Internal server error",
      detail: error,
      status: 500,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return jsonError({
        message: "Subdomain parameter is required",
        status: 400,
      });
    }

    // Get subdomain with profile information
    const subdomainRecord = await subdomainRepository.getSubdomainBySlug(
      subdomain
    );

    if (!subdomainRecord) {
      return jsonError({ message: "Subdomain not found", status: 404 });
    }

    let profileInfo = null;

    if (subdomainRecord.profileId) {
      const profile = await profileRepository.getProfileById(
        subdomainRecord.profileId
      );
      profileInfo = profile;
    }

    return jsonOk({
      data: {
        success: true,
        subdomain: subdomainRecord.slug,
        icon: subdomainRecord.icon,
        profile: profileInfo,
      },
    });
  } catch (error) {
    return jsonError({
      message: "Internal server error",
      detail: error,
      status: 500,
    });
  }
}
