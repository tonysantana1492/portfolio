import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { profileRepository } from "@/repository/profile.repository";
import { subdomainRepository } from "@/repository/subdomains.repository";

interface SubdomainWithProfileId {
  id: string;
  subdomain: string;
  emoji: string;
  createdAt: Date;
  updatedAt: Date;
  profileId?: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subdomain, profileId } = body;

    if (!subdomain || !profileId) {
      return NextResponse.json(
        { error: "Subdomain and profileId are required" },
        { status: 400 }
      );
    }

    // Verify subdomain exists
    const existingSubdomain = await subdomainRepository.getSubdomain(subdomain);

    if (!existingSubdomain) {
      return NextResponse.json(
        { error: "Subdomain not found" },
        { status: 404 }
      );
    }

    // Verify profile exists
    const existingProfile = await profileRepository.getProfileById(profileId);

    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Associate subdomain with profile
    const success = await subdomainRepository.associateSubdomainWithProfile(
      subdomain,
      profileId
    );

    if (!success) {
      return NextResponse.json(
        { error: "Failed to associate subdomain with profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subdomain successfully associated with profile",
    });
  } catch (error) {
    console.error("Error associating subdomain with profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json(
        { error: "Subdomain parameter is required" },
        { status: 400 }
      );
    }

    // Get subdomain with profile information
    const subdomainRecord = await subdomainRepository.getSubdomain(subdomain);

    if (!subdomainRecord) {
      return NextResponse.json(
        { error: "Subdomain not found" },
        { status: 404 }
      );
    }

    const subdomainWithProfileId = subdomainRecord as SubdomainWithProfileId;
    let profileInfo = null;

    if (subdomainWithProfileId.profileId) {
      const profile = await profileRepository.getProfileById(
        subdomainWithProfileId.profileId
      );
      profileInfo = profile;
    }

    return NextResponse.json({
      success: true,
      subdomain: subdomainRecord.subdomain,
      emoji: subdomainRecord.emoji,
      profile: profileInfo,
    });
  } catch (error) {
    console.error("Error getting subdomain profile association:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
