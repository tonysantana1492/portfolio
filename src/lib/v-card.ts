import "server-only";

import sharp from "sharp";
import VCard from "vcard-creator";

import type { Profile } from "@/dtos/profile.dto";
import { decodePhoneNumber } from "@/lib/string";

export const generateVCard = (profile: Profile) => {
  const card = new VCard();

  card
    .addName(profile.lastName, profile.firstName)
    .addPhoneNumber(decodePhoneNumber(profile.phoneNumber));
  // .addAddress(profile.address)
  // .addEmail(decodeEmail(profile.email));
  // .addURL(profile.website);

  // const photo = await getVCardPhoto(profile.avatar);
  // if (photo) {
  //   card.addPhoto(photo.image, photo.mine);
  // }

  // if (profile.jobs.length > 0) {
  //   const company = profile.jobs[0];
  //   card.addCompany(company.company).addJobtitle(company.title);
  // }

  return card.toString();
};

export async function getVCardPhoto(url: string) {
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

// async function getVCardPhoto(url: string) {
//   try {
//     const res = await fetch(url);

//     if (!res.ok) {
//       return null;
//     }

//     const buffer = Buffer.from(await res.arrayBuffer());
//     if (buffer.length === 0) {
//       return null;
//     }

//     const contentType = res.headers.get("Content-Type") || "";
//     if (!contentType.startsWith("image/")) {
//       return null;
//     }

//     const jpegBuffer = await convertImageToJpeg(buffer);
//     const image = jpegBuffer.toString("base64");

//     return {
//       image,
//       mine: "jpeg",
//     };
//   } catch {
//     return null;
//   }
// }

// async function convertImageToJpeg(imageBuffer: Buffer): Promise<Buffer> {
//   try {
//     const jpegBuffer = await sharp(imageBuffer)
//       .jpeg({
//         quality: 90,
//         progressive: true,
//         mozjpeg: true,
//       })
//       .toBuffer();

//     return jpegBuffer;
//   } catch (error) {
//     console.error("Error converting image to JPEG:", error);
//     throw error;
//   }
// }
