import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

import { cookies } from "next/headers";

import { APP_CONFIG, NODE_ENV_ENUM } from "@/config/app.config";
import { META_THEME_COLORS, SITE_INFO } from "@/config/site.config";
import { USER } from "@/config/user.config";
import { fontMono, fontSans } from "@/lib/fonts";
import { Providers } from "@/providers/providers";
import { THEME_COOKIE_NAME } from "@/theme/theme-color.provider";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
  alternates: {
    canonical: "/",
  },
  title: {
    template: `%s – ${SITE_INFO.name}`,
    default: `${USER.displayName} – ${USER.jobTitle}`,
  },
  description: SITE_INFO.description,
  keywords: SITE_INFO.keywords,
  authors: [
    {
      name: USER.displayName,
      url: SITE_INFO.url,
    },
  ],
  creator: USER.displayName,
  openGraph: {
    siteName: SITE_INFO.name,
    url: "/",
    type: "profile",
    firstName: USER.firstName,
    lastName: USER.lastName,
    username: USER.username,
    gender: USER.gender,
    images: [
      {
        url: SITE_INFO.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_INFO.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: USER.twitterUsername, // Twitter username
    images: [SITE_INFO.ogImage],
  },
  icons: {
    icon: [
      {
        url: "https://assets.chanhdai.com/images/favicon.ico",
        sizes: "any",
      },
      {
        url: "https://assets.chanhdai.com/images/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "https://assets.chanhdai.com/images/apple-touch-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: META_THEME_COLORS.light,
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
      {APP_CONFIG.NODE_ENV === NODE_ENV_ENUM.DEVELOPMENT ? (
        <head>
          <script
            src="https://unpkg.com/react-scan/dist/auto.global.js"
            async
          />
        </head>
      ) : null}
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers activeThemeValue={activeThemeValue}>{children}</Providers>
      </body>
    </html>
  );
}
