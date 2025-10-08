import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { details } from "motion/react-m";
import { id } from "zod/v4/locales";

import { ProfileUpdateSchema } from "@/dtos/profile.dto";
import { profileRepository } from "@/repository/profile.repository";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const subdomain = searchParams.get("subdomain");

  if (!subdomain) {
    return NextResponse.json(
      { error: "Subdomain is required" },
      { status: 400 }
    );
  }

  try {
    const profile = await profileRepository.getProfileBySubdomain(subdomain);

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error in profile API route:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();

    const updatedProfile = await profileRepository.createProfile(profileData);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    const { success, data, error } = ProfileUpdateSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: "Invalid profile data", issues: error?.issues },
        { status: 400 }
      );
    }

    const updatedProfile = await profileRepository.updateProfile(id, data);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile", details: error },
      { status: 500 }
    );
  }
}
