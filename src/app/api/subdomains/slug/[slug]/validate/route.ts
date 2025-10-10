import type { NextRequest } from "next/server";

import { SubdomainSlugSchema } from "@/dtos/subdomain.dto";
import { jsonError, jsonOk } from "@/lib/http";
import { subdomainRepository } from "@/repository/subdomains.repository";

export interface ParamsWithSlug {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: ParamsWithSlug) {
  try {
    const { slug } = await params;

    if (!slug) {
      return jsonError({ message: "Slug is required", status: 400 });
    }

    // Validate username format (match frontend validation)
    const { success } = SubdomainSlugSchema.safeParse({ slug });
    if (!success) {
      return jsonError({
        message: "Invalid username format",
        status: 400,
      });
    }

    // Check if username exists in Subdomain table
    const existingSubdomain = await subdomainRepository.getSubdomainBySlug(
      slug
    );

    const available = !existingSubdomain;

    return jsonOk({
      data: {
        available,
        slug,
      },
    });
  } catch {
    return jsonError({ message: "Internal server error", status: 500 });
  }
}
