import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  createProfile,
  getProfileBySubdomain,
  updateProfile,
} from "@/services/profile.service";

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
    const profile = await getProfileBySubdomain(subdomain);

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error in profile API route:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const profileData = await request.json();

    const updatedProfile = await createProfile(profileData);

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

    const updatedProfile = await updateProfile(profileData);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
