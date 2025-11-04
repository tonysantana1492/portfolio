import { NextResponse } from "next/server";

import sharp from "sharp";
import VCard from "vcard-creator";

import { PROFILE } from "@/content/profile";
import { decodeEmail, decodePhoneNumber } from "@/lib/string";
import { getLastCompany } from "@/services/experience";

export async function GET() {
  const card = new VCard();

  card
    .addName(PROFILE.lastName, PROFILE.firstName)
    .addPhoneNumber(decodePhoneNumber(PROFILE.phoneNumber))
    .addAddress(PROFILE.address)
    .addEmail(decodeEmail(PROFILE.email))
    .addURL(PROFILE.website);

  const photo = await getVCardPhoto(PROFILE.avatar);
  if (photo) {
    card.addPhoto(photo.image, photo.mine);
  }

  const lastCompany = getLastCompany(PROFILE.sections.experiences?.items ?? []);

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
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
      "X-Robots-Tag": "noindex, nofollow",
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
