import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

import { cookies } from "next/headers";

import { getSiteInfo } from "@/config/site.config";
import { fontMono, fontSans } from "@/lib/fonts";
import { Providers } from "@/providers/providers";
import { profileRepository } from "@/repository/profile.repository";
import { THEME_COOKIE_NAME } from "@/theme/theme-color.provider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> => {
  const { subdomain } = await params;
  const profile = await profileRepository.getProfileBySubdomain(subdomain);

  if (!profile) {
    return {};
  }

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
      creator: profile.twitterUsername, // Twitter username
      images: [siteInfo.ogImage],
      title: siteInfo.name,
      description: siteInfo.description,
      siteId: "",
      creatorId: "",
    },
    icons: siteInfo.metadataIcons,
  };
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get(THEME_COOKIE_NAME)?.value;

  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="apple-mobile-web-app-title" content={"Let's 0 portfolio"} />
      <link rel="manifest" href="/manifest.webmanifest" />
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers activeThemeValue={activeThemeValue}>{children}</Providers>
      </body>
    </html>
  );
}
