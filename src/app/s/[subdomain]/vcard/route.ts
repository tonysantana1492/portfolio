import { type NextRequest, NextResponse } from "next/server";

import sharp from "sharp";
import VCard from "vcard-creator";

import { decodeEmail, decodePhoneNumber } from "@/lib/string";
import { getLastCompany } from "@/services/experience";
import { getProfileBySubdomain } from "@/services/profile";

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

  const profile = await getProfileBySubdomain(subdomain);

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

  const lastCompany = getLastCompany(profile.sections.experiences?.items ?? []);

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

async function getVCardPhoto(url: string) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length === 0) {
      return null;
    }

    const contentType = res.headers.get("Content-Type") || "";
    if (!contentType.startsWith("image/")) {
      return null;
    }

    const jpegBuffer = await convertImageToJpeg(buffer);
    const image = jpegBuffer.toString("base64");

    return {
      image,
      mine: "jpeg",
    };
  } catch {
    return null;
  }
}

async function convertImageToJpeg(imageBuffer: Buffer): Promise<Buffer> {
  try {
    const jpegBuffer = await sharp(imageBuffer)
      .jpeg({
        quality: 90,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();

    return jpegBuffer;
  } catch (error) {
    console.error("Error converting image to JPEG:", error);
    throw error;
  }
}
