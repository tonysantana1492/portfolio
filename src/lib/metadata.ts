import type { Metadata } from "next";

import { getSiteInfo } from "@/config/site.config";
import type { IProfile } from "@/content/profile";

export function generateDynamicMetadata(profile: IProfile): Metadata {
  const siteInfo = getSiteInfo(profile);

  return {
    metadataBase: new URL(siteInfo.url),
    alternates: {
      canonical: "/",
    },
    title: {
      template: `%s – ${siteInfo.name}`,
      default: `${profile.displayName} – ${profile.jobTitle}`,
    },
    description: siteInfo.description,
    keywords: siteInfo.keywords,
    authors: [
      {
        name: profile.displayName,
        url: siteInfo.url,
      },
    ],
    creator: profile.displayName,
    manifest: "/manifest.webmanifest",
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: siteInfo.name,
    },
    formatDetection: {
      telephone: false,
    },
    openGraph: {
      siteName: siteInfo.name,
      url: "/",
      type: "profile",
      firstName: profile.firstName,
      lastName: profile.lastName,
      username: profile.username,
      gender: profile.gender,
      images: [
        {
          url: siteInfo.ogImage,
          width: 1200,
          height: 630,
          alt: siteInfo.name,
        },
      ],
      locale: "en_US",
      title: siteInfo.name,
      description: siteInfo.description,
    },
    twitter: {
      card: "summary_large_image",
      creator: profile.twitterUsername,
      images: [siteInfo.ogImage],
      title: siteInfo.name,
      description: siteInfo.description,
      siteId: "",
      creatorId: "",
    },
    icons: siteInfo.metadataIcons,
  };
}
