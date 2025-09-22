import type { MetadataRoute } from "next";

import {
  BriefcaseBusinessIcon,
  CircleUserIcon,
  LetterTextIcon,
  type LucideProps,
  RssIcon,
} from "lucide-react";

import { USER } from "./user.config";
import { Logo } from "@/components/header/logo";
import { Icons } from "@/components/shared/icons";
import { SOCIAL_LINKS } from "@/config/social-links.config";

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
  name: USER.displayName,
  url: process.env.APP_URL || "https://tonysantana.dev",
  ogImage: USER.ogImage,
  description: USER.bio,
  keywords: USER.keywords,
  icons: [
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
      src: "/images/icon-512x512.png",
      type: "image/png",
      sizes: "512x512",
      purpose: "any",
    },
    {
      src: "/images/logo.png",
      type: "image/png",
      sizes: "512x512",
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
        sizes: "any",
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
};

export const MAIN_NAV: INavItem[] = [
  {
    title: "Portfolio",
    href: "/",
  },
  {
    title: "Blog",
    href: "/blog",
  },
];

export const UTM_PARAMS = {
  utm_source: USER.website,
  utm_medium: "portfolio_website",
  utm_campaign: "referral",
};

export type CommandLinkItem = {
  title: string;
  href: string;

  icon?: React.ComponentType<LucideProps>;
  iconImage?: string;
  keywords?: string[];
  openInNewTab?: boolean;
};

export const MENU_LINKS: CommandLinkItem[] = [
  {
    title: "Portfolio",
    href: "/",
    icon: Logo,
  },
  {
    title: "Blog",
    href: "/blog",
    icon: RssIcon,
  },
];

export const PORTFOLIO_LINKS: CommandLinkItem[] = [
  {
    title: "About",
    href: "/#about",
    icon: LetterTextIcon,
  },
  {
    title: "Tech Stack",
    href: "/#stack",
    icon: Icons.ts,
  },
  {
    title: "Experience",
    href: "/#experience",
    icon: BriefcaseBusinessIcon,
  },
  {
    title: "Projects",
    href: "/#projects",
    icon: Icons.project,
  },
  {
    title: "Honors & Awards",
    href: "/#awards",
    icon: Icons.award,
  },
  {
    title: "Certifications",
    href: "/#certs",
    icon: Icons.certificate,
  },
  {
    title: "Download vCard",
    href: "/vcard",
    icon: CircleUserIcon,
  },
];

export const SOCIAL_LINK_ITEMS: CommandLinkItem[] = SOCIAL_LINKS.map(
  (item) => ({
    title: item.title,
    href: item.href,
    iconImage: item.icon,
    openInNewTab: true,
  })
);
