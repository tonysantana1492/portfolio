import type { Metadata } from "next";
import "@/styles/globals.css";

import { cookies } from "next/headers";

import { SITE_INFO } from "@/config/site.config";
import { PROFILE } from "@/content/profile";
import { fontMono, fontSans } from "@/lib/fonts";
import { Providers } from "@/providers/providers";
import { THEME_COOKIE_NAME } from "@/theme/theme-color.provider";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  themeColor: "#000000",
  alternates: {
    canonical: "/",
  },
  title: {
    template: `%s – ${SITE_INFO.name}`,
    default: `${PROFILE.displayName} – ${PROFILE.jobTitle}`,
  },
  description: SITE_INFO.description,
  keywords: SITE_INFO.keywords,
  authors: [
    {
      name: PROFILE.displayName,
      url: SITE_INFO.url,
    },
  ],
  creator: PROFILE.displayName,
  openGraph: {
    siteName: SITE_INFO.name,
    url: "/",
    type: "profile",
    firstName: PROFILE.firstName,
    lastName: PROFILE.lastName,
    username: PROFILE.username,
    gender: PROFILE.gender,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_INFO.name,
      },
    ],
    locale: "en_US",
    title: SITE_INFO.name,
    description: SITE_INFO.description,
  },
  twitter: {
    card: "summary_large_image",
    creator: PROFILE.twitterUsername, // Twitter username
    images: [SITE_INFO.ogImage],
    title: SITE_INFO.name,
    description: SITE_INFO.description,
    siteId: "",
    creatorId: "",
  },
  icons: SITE_INFO.metadataIcons,
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
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers activeThemeValue={activeThemeValue}>{children}</Providers>
      </body>
    </html>
  );
}
