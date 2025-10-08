import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { UserCreateSchema } from "@/dtos/user.dto";
import { userRepository } from "@/repository/user.repository";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { data, success, error } = UserCreateSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: `Invalid user data`, issues: error?.issues },
        { status: 400 }
      );
    }

    const user = await userRepository.createOrGetUser(data);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}
