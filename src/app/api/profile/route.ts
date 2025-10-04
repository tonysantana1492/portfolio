import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { PROFILE } from "@/content/profile"; // Fallback
import { profileService } from "@/services/profile";

export async function GET() {
  try {
    // Try to get profile from database
    const profile = await profileService.getProfile();

    if (profile) {
      return NextResponse.json(profile);
    }

    // If no profile in database, return static PROFILE as fallback
    return NextResponse.json(PROFILE);
  } catch (error) {
    console.error("Error in profile API route:", error);

    // Return static PROFILE as fallback in case of error
    return NextResponse.json(PROFILE);
  }
}

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();

    const updatedProfile = await profileService.createProfile(profileData);

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
    const profileData = await request.json();

    const updatedProfile = await profileService.updateProfile(profileData);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
