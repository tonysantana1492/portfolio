import type React from "react";

import type { Metadata } from "next";

import { SITE_INFO } from "@/config/site.config";

export const metadata: Metadata = {
  title: {
    template: `%s – Blog – ${SITE_INFO.name}`,
    default: `Blog – ${SITE_INFO.name}`,
  },
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": [
        {
          url: "/rss",
          title: `${SITE_INFO.name} Blog RSS Feed`,
        },
      ],
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_INFO.name,
    url: "/blog",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
