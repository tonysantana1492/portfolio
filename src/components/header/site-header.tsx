import Link from "next/link";

import { BrandContextMenu } from "@/components/header/brand-context-menu";
import { CommandMenu } from "@/components/header/command-menu";
import { DesktopNav } from "@/components/header/desktop-nav";
import { MobileNav } from "@/components/header/mobile-nav";
import { NavItemGitHub } from "@/components/header/nav-item-github";
import { SiteHeaderMark } from "@/components/header/site-header-mark";
import { SiteHeaderWrapper } from "@/components/header/site-header-wrapper";
import { MAIN_NAV } from "@/config/site.config";
import type { IProfile } from "@/content/profile";
import { cn } from "@/lib/utils";
import { getAllPosts } from "@/services/blog";
import { ToggleTheme } from "@/theme/toggle-theme";

export function SiteHeader({ profile }: { profile: IProfile }) {
  const posts = getAllPosts();

  // Create serializable nav items for client components (exclude icon property)
  const navItems = MAIN_NAV.map(({ title, href }) => ({ title, href }));

  return (
    <SiteHeaderWrapper
      className={cn(
        "sticky inset-0 top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2",
        "data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black]/80",
        "not-dark:data-[affix=true]:**:data-header-container:after:bg-border",
        "transition-shadow duration-300"
      )}
    >
      <div
        className="screen-line-before screen-line-after mx-auto flex h-12 items-center justify-between gap-2 border-edge border-x px-2 after:z-1 after:transition-[background-color] sm:gap-4 md:max-w-3xl"
        data-header-container
      >
        <BrandContextMenu>
          <Link href="/" aria-label="Home" className="[&_svg]:h-8">
            <SiteHeaderMark />
          </Link>
        </BrandContextMenu>

        <div className="flex-1" />

        <DesktopNav items={navItems} />

        <div className="flex items-center gap-2">
          <CommandMenu posts={posts} />
          <NavItemGitHub profile={profile} />
          <ToggleTheme />
          <MobileNav className="sm:hidden" items={navItems} />
        </div>
      </div>
    </SiteHeaderWrapper>
  );
}
