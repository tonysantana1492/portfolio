import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

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

    // Validate username format
    const usernameRegex = /^[a-z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { available: false, error: "Invalid username format" },
        { status: 400 }
      );
    }

    // Check if username exists in Profile table
    const existingProfile = await prisma.profile.findUnique({
      where: {
        username: username,
      },
    });

    // Check if username exists in Subdomain table
    const existingSubdomain = await prisma.subdomain.findUnique({
      where: {
        subdomain: username,
      },
    });

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
