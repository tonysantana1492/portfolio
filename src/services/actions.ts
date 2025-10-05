"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { PROTOCOL, ROOT_DOMAIN } from "@/config/app.config";
import prisma from "@/lib/prisma";
import { isValidIcon } from "@/services/subdomains";

export async function createSubdomainAction(
  _prevState: unknown,
  formData: FormData
) {
  const subdomain = formData.get("subdomain") as string;
  const icon = formData.get("icon") as string;

  if (!subdomain || !icon) {
    return { success: false, error: "Subdomain and icon are required" };
  }

  if (!isValidIcon(icon)) {
    return {
      subdomain,
      icon,
      success: false,
      error: "Please enter a valid emoji (maximum 10 characters)",
    };
  }

  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "");

  if (sanitizedSubdomain !== subdomain) {
    return {
      subdomain,
      icon,
      success: false,
      error:
        "Subdomain can only have lowercase letters, numbers, and hyphens. Please try again.",
    };
  }

  const subdomainAlreadyExists = await prisma.subdomain.findUnique({
    where: {
      subdomain: sanitizedSubdomain,
    },
  });

  if (subdomainAlreadyExists) {
    return {
      subdomain,
      icon,
      success: false,
      error: "This subdomain is already taken",
    };
  }

  await prisma.subdomain.create({
    data: {
      subdomain: sanitizedSubdomain,
      emoji: icon,
    },
  });

  redirect(`${PROTOCOL}://${sanitizedSubdomain}.${ROOT_DOMAIN}`);
}

export async function deleteSubdomainAction(
  _prevState: unknown,
  formData: FormData
) {
  const subdomain = formData.get("subdomain") as string;

  try {
    await prisma.subdomain.delete({
      where: {
        subdomain: subdomain,
      },
    });

    revalidatePath("/admin");
    return { success: "Domain deleted successfully" };
  } catch (error) {
    console.error("Error deleting subdomain:", error);
    return { success: false, error: "Failed to delete domain" };
  }
}
