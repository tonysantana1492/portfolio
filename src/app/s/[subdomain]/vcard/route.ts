import { type NextRequest, NextResponse } from "next/server";

import VCard from "vcard-creator";

import { decodeEmail, decodePhoneNumber } from "@/lib/string";
import { getVCardPhoto } from "@/lib/v-card";
import { profileRepository } from "@/repository/profile.repository";
import { profileService } from "@/services/profile.service";

export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{
    subdomain: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { subdomain } = await params;
  // Validate subdomain parameter
  if (!subdomain || typeof subdomain !== "string" || subdomain.trim() === "") {
    return NextResponse.json({ error: "Invalid subdomain" }, { status: 400 });
  }

  const profile = await profileRepository.getProfileBySubdomain(subdomain);

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const card = new VCard();

  card
    .addName(profile.lastName, profile.firstName)
    .addPhoneNumber(decodePhoneNumber(profile.phoneNumber))
    .addAddress(profile.address)
    .addEmail(decodeEmail(profile.email))
    .addURL(profile.website);

  const photo = await getVCardPhoto(profile.avatar);
  if (photo) {
    card.addPhoto(photo.image, photo.mine);
  }

  const lastCompany = profileService.getLastCompany(
    profile.sections.experiences?.items ?? []
  );

  if (lastCompany) {
    card
      .addCompany(lastCompany.companyName)
      .addJobtitle(lastCompany.positions[0].title);
  }

  return new NextResponse(card.toString(), {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": "inline; filename=contact.vcf",
    },
  });
}
