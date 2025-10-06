import type { MetadataRoute } from "next";

import {
  CircleUserIcon,
  type LucideProps,
  RssIcon,
  UserStarIcon,
} from "lucide-react";

import { Logo } from "@/components/header/logo";
import { getIcon } from "@/components/shared/icons";
import { APP_CONFIG } from "@/config/app.config";
import type { IProfile } from "@/content/profile";

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

export function getSiteInfo(profile?: IProfile): ISiteInfo {
  return {
    name: profile?.displayName ?? "Let's 0",
    url: APP_CONFIG.URL,
    ogImage: profile?.ogImage ?? `${APP_CONFIG.URL}/images/og-image.png`,
    description: profile?.bio ?? "Start from 0 shine like one.",
    keywords:
      profile?.keywords.join(", ") ?? "portfolio, developer, software engineer",
    icons: [
      {
        src: "/images/icon-512x512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
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
}

export function getPWAConfig(profile: IProfile) {
  const siteInfo = getSiteInfo(profile);
  return {
    name: siteInfo.name,
    shortName: profile.displayName,
    description: siteInfo.description,
    themeColor: "#000000",
    backgroundColor: "#000000",
    display: "standalone" as const,
    orientation: "portrait" as const,
    scope: "/",
    startUrl: "/?utm_source=pwa",
    icons: siteInfo.icons,
    screenshots: siteInfo.screenshots,
  };
}

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

export function getUTMParams(website?: string) {
  return {
    utm_source: website ? new URL(website).hostname : "unknown",
    utm_medium: "portfolio_website",
    utm_campaign: "referral",
  };
}

export type CommandLinkItem = {
  title: string;
  href: string;
  icon?: string | React.ComponentType<LucideProps>;
  iconImage?: string;
  keywords?: string[];
  openInNewTab?: boolean;
};

export function getPortfolioLinks(profile: IProfile): CommandLinkItem[] {
  const sections = Object.entries(profile?.sections).map(
    ([_key, section]) => section
  );

  const portfolioLinksFromSections: CommandLinkItem[] = sections.map(
    (section) => ({
      title: section.name,
      href: `/#${section.id}`,
      icon: getIcon(section.icon),
    })
  );

  return [
    ...portfolioLinksFromSections,
    {
      title: "Download vCard",
      href: "/vcard",
      icon: CircleUserIcon,
    },
  ];
}

export function getSocialLinkItems(profile: IProfile): CommandLinkItem[] {
  return (
    profile.sections.socialLinks?.items.map((item) => ({
      title: item.title,
      href: item.href,
      iconImage: item.icon,
      openInNewTab: true,
    })) || []
  );
}
