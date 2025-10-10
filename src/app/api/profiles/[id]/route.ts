import type { NextRequest } from "next/server";

import { ProfileUpdateSchema } from "@/dtos/profile.dto";
import { jsonError, jsonOk } from "@/lib/http";
import { profileRepository } from "@/repository/profile.repository";

export interface ParamsWithId {
  params: Promise<{
    id: string;
  }>;
}

export async function PUT(request: NextRequest, { params }: ParamsWithId) {
  const { id } = await params;

  if (!id) {
    return jsonError({
      message: "Invalid ID parameter",
      status: 400,
    });
  }

  const body = await request.json();

  try {
    const { success, data, error } = ProfileUpdateSchema.safeParse(body);

    if (!success) {
      return jsonError({
        message: "Invalid profile data",
        detail: error?.issues,
        status: 400,
      });
    }

    const updatedProfile = await profileRepository.updateProfile(id, data);

    return jsonOk({ data: updatedProfile });
  } catch (error) {
    return jsonError({
      message: "Failed to update profile",
      detail: error,
      status: 500,
    });
  }
}
