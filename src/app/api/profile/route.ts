import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { profileService } from "@/services/profile";

export async function GET() {
  try {
    // Try to get profile from database
    const profile = await profileService.getProfile();

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error in profile API route:", error);
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
