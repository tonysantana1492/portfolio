import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { GoogleUserData } from "@/components/auth/auth-popup";
import { createOrGetUser } from "@/services/user.service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { googleUserData }: { googleUserData: GoogleUserData } = body;

    if (
      !googleUserData?.id ||
      !googleUserData?.email ||
      !googleUserData?.name
    ) {
      return NextResponse.json(
        { error: "Missing required user data" },
        { status: 400 }
      );
    }

    const user = await createOrGetUser(googleUserData);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        verified: user.verified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in auth/google route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
