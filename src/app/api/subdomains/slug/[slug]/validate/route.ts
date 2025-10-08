import type { NextRequest } from "next/server";

import { jsonError, jsonOk } from "@/lib/http";
import { subdomainRepository } from "@/repository/subdomains.repository";

export async function GET(
  _request: NextRequest,
  ctx: { params: { slug: string } }
) {
  try {
    const slug = ctx.params.slug;

    if (!slug) {
      return jsonError({ title: "slug is required", status: 400 });
    }

    // Validate username format (match frontend validation)
    const usernameRegex = /^[a-z0-9-]{3,50}$/;
    if (!usernameRegex.test(slug)) {
      return jsonError({
        title: "Invalid username format",
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
    return jsonError({ title: "Internal server error", status: 500 });
  }
}
