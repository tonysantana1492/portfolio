import type { NextRequest } from "next/server";

import { jsonError, jsonOk } from "@/lib/http";
import { userRepository } from "@/repository/user.repository";

const getUserFromGoogle = async ({ email }: { email: string }) => {
  return {
    googleId: `temp_${Date.now()}`, // Temporary google ID
    email,
    name: "Tony Santana",
    picture: "https://i.pravatar.cc/300",
    verified: true,
  };
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.email) {
      return jsonError({
        message: `Email is required`,
        status: 400,
      });
    }

    const user = await getUserFromGoogle({ email: body.email });

    if (!user) {
      return jsonError({
        message: `Invalid user data`,
        status: 404,
      });
    }

    const userAuth = await userRepository.createOrGetUser(user);

    return jsonOk({
      data: {
        success: true,
        user: userAuth,
      },
    });
  } catch (error) {
    console.log(error);

    return jsonError({
      message: "Internal server error",
      detail: error,
      status: 500,
    });
  }
}
