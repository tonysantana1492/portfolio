import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { associateSubdomainWithProfile } from "@/services/profile-subdomain";

// Extended type to handle the new profileId field
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
    const existingSubdomain = await prisma.subdomain.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    if (!existingSubdomain) {
      return NextResponse.json(
        { error: "Subdomain not found" },
        { status: 404 }
      );
    }

    // Verify profile exists
    const existingProfile = await prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Associate subdomain with profile
    const success = await associateSubdomainWithProfile(subdomain, profileId);

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
    const subdomainRecord = await prisma.subdomain.findUnique({
      where: {
        subdomain: subdomain,
      },
    });

    if (!subdomainRecord) {
      return NextResponse.json(
        { error: "Subdomain not found" },
        { status: 404 }
      );
    }

    const subdomainWithProfileId = subdomainRecord as SubdomainWithProfileId;
    let profileInfo = null;

    if (subdomainWithProfileId.profileId) {
      const profile = await prisma.profile.findUnique({
        where: {
          id: subdomainWithProfileId.profileId,
        },
        select: {
          id: true,
          username: true,
          displayName: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });
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
