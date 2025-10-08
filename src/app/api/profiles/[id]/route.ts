import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { IdParamSchema } from "@/dtos/base.dto";
import { ProfileUpdateSchema } from "@/dtos/profile.dto";
import { profileRepository } from "@/repository/profile.repository";

function parseParams(ctx: { params: { id?: string } }) {
  return IdParamSchema.parse(ctx.params);
}

export async function PUT(
  request: NextRequest,
  ctx: { params: { id?: string } }
) {
  const { id } = parseParams(ctx);
  try {
    const body = await request.json();

    const { success, data, error } = ProfileUpdateSchema.safeParse(body);

    if (!success) {
      return NextResponse.json(
        { error: "Invalid profile data", issues: error?.issues },
        { status: 400 }
      );
    }

    const updatedProfile = await profileRepository.updateProfile(id, data);

    return NextResponse.json(updatedProfile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update profile", details: error },
      { status: 500 }
    );
  }
}
