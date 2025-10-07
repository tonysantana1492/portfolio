import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import type { GoogleUserData } from "@/components/auth/auth-popup";
import { userRepository } from "@/repository/user.repository";

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
        { status: 400 },
      );
    }

    const user = await userRepository.createOrGetUser(googleUserData);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in auth/google route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
