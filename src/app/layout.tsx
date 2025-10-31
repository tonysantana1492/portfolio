import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";

import type React from "react";
import { Suspense } from "react";

import Script from "next/script";

import { SITE_INFO } from "@/config/site.config";
import { PROFILE } from "@/content/profile";
import { fontMono, fontSans } from "@/lib/fonts";
import { ProviderCache } from "@/providers/provider-cache";

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_INFO.url}/#org`,
      name: SITE_INFO.name,
      url: SITE_INFO.url,
      logo: `${SITE_INFO.url}${
        SITE_INFO.icons?.[0]?.src || "/images/logo.svg"
      }`,
      sameAs: (PROFILE.sections.socialLinks?.items || []).map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_INFO.url}/#website`,
      url: SITE_INFO.url,
      name: SITE_INFO.name,
      publisher: { "@id": `${SITE_INFO.url}/#org` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_INFO.url}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_INFO.url}/#homepage`,
      url: SITE_INFO.url,
      name: SITE_INFO.name,
      isPartOf: { "@id": `${SITE_INFO.url}/#website` },
    },
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: { color: "black" },
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_INFO.url),
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
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_INFO.name,
  },
  formatDetection: {
    telephone: false,
  },
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
}: React.PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="apple-mobile-web-app-title" content={SITE_INFO.name} />
      <meta name="description" content={SITE_INFO.description} />

      <link rel="manifest" href="/manifest.webmanifest" />

      <Script type="application/ld+json">
        {JSON.stringify(STRUCTURED_DATA)}
      </Script>
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Suspense fallback={null}>
          <ProviderCache>{children}</ProviderCache>
        </Suspense>
      </body>
    </html>
  );
}
