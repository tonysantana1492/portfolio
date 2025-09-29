import type { MetadataRoute } from "next";

import {
  CircleUserIcon,
  type LucideProps,
  RssIcon,
  UserStarIcon,
} from "lucide-react";

import { Logo } from "@/components/header/logo";
import { PROFILE } from "@/content/profile";

interface ISiteInfo {
  name: string;
  url: string;
  ogImage: string;
  description: string;
  keywords: string;
  icons: MetadataRoute.Manifest["icons"];
  screenshots: MetadataRoute.Manifest["screenshots"];
  metadataIcons: {
    icon: { url: string; sizes?: string; type?: string }[];
    apple: { url: string; sizes?: string; type?: string };
  };
}

export const SITE_INFO: ISiteInfo = {
  name: PROFILE.displayName,
  url: process.env.APP_URL || "https://tonysantana.dev",
  ogImage: PROFILE.ogImage,
  description: PROFILE.bio,
  keywords: PROFILE.keywords.join(", "),
  icons: [
    {
      src: "/images/icon-512x512.png",
      type: "image/png",
      sizes: "512x512",
      purpose: "any",
    },
    {
      src: "/images/logo.svg",
      type: "image/svg+xml",
      sizes: "any",
      purpose: "any",
    },
    {
      src: "/images/icon-192x192.png",
      type: "image/png",
      sizes: "192x192",
      purpose: "any",
    },
    {
      src: "/images/icon-192x192.png",
      type: "image/png",
      sizes: "192x192",
      purpose: "maskable",
    },
  ],
  screenshots: [
    {
      src: "/images/screenshot-mobile-dark.webp",
      type: "image/webp",
      sizes: "440x956",
      form_factor: "narrow",
    },
    {
      src: "/images/screenshot-mobile-light.webp",
      type: "image/webp",
      sizes: "440x956",
      form_factor: "narrow",
    },
    {
      src: "/images/screenshot-desktop-dark.webp",
      type: "image/webp",
      sizes: "1920x1080",
      form_factor: "wide",
    },
    {
      src: "/images/screenshot-desktop-light.webp",
      type: "image/webp",
      sizes: "1920x1080",
      form_factor: "wide",
    },
  ],
  metadataIcons: {
    icon: [
      {
        url: "/images/favicon.ico",
        sizes: "180x180",
      },
      {
        url: "/images/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: {
      url: "/images/apple-touch-icon.png",
      type: "image/png",
      sizes: "180x180",
    },
  },
};

export const META_THEME_COLORS = {
  light: "#ffffff",
  dark: "#09090b",
};

export type INavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<LucideProps>;
};

export type SerializableNavItem = {
  title: string;
  href: string;
};

export const MAIN_NAV: INavItem[] = [
  {
    title: "Portfolio",
    href: "/",
    icon: Logo,
  },
  {
    title: "CV",
    href: "/cv/tony-santana",
    icon: UserStarIcon,
  },
  {
    title: "Blog",
    href: "/blog",
    icon: RssIcon,
  },
];

export const UTM_PARAMS = {
  utm_source: PROFILE.website,
  utm_medium: "portfolio_website",
  utm_campaign: "referral",
};

export type CommandLinkItem = {
  title: string;
  href: string;
  icon?: string | React.ComponentType<LucideProps>;
  iconImage?: string;
  keywords?: string[];
  openInNewTab?: boolean;
};

const sections = Object.entries(PROFILE.sections).map(
  ([_key, section]) => section
);

const PORTFOLIO_LINKS_FROM_SECTIONS: CommandLinkItem[] = sections.map(
  (section) => ({
    title: section.name,
    href: `/#${section.id}`,
    icon: section.icon,
  })
);

export const PORTFOLIO_LINKS: CommandLinkItem[] = [
  ...PORTFOLIO_LINKS_FROM_SECTIONS,
  {
    title: "Download vCard",
    href: "/vcard",
    icon: CircleUserIcon,
  },
];

export const SOCIAL_LINK_ITEMS: CommandLinkItem[] =
  PROFILE.sections.socialLinks?.items.map((item) => ({
    title: item.title,
    href: item.href,
    iconImage: item.icon,
    openInNewTab: true,
  })) || [];
