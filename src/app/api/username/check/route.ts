import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { profileRepository } from "@/repository/profile.repository";
import { subdomainRepository } from "@/repository/subdomains.repository";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Validate username format (match frontend validation)
    const usernameRegex = /^[a-z0-9-]{3,50}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { available: false, error: "Invalid username format" },
        { status: 400 }
      );
    }

    // Check if username exists in Profile table
    const existingProfile = await profileRepository.getProfileByUserName(
      username
    );

    // Check if username exists in Subdomain table
    const existingSubdomain = await subdomainRepository.getSubdomain(username);

    const available = !existingProfile && !existingSubdomain;

    return NextResponse.json({
      available,
      username,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
