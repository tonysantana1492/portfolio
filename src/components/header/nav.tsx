import type React from "react";

import Link from "next/link";

import type { INavItem } from "@/config/site.config";
import { cn } from "@/lib/utils";

export function Nav({
  items,
  activeId,
  className,
}: {
  items: INavItem[];
  activeId?: string | null;
  className?: string;
}) {
  return (
    <nav className={cn("flex items-center gap-4", className)}>
      {items.map(({ title, href }) => {
        const active =
          activeId === href || (href !== "/" && activeId?.startsWith(href));

        return (
          <NavItem key={href} href={href} active={active}>
            {title}
          </NavItem>
        );
      })}
    </nav>
  );
}

export function NavItem({
  active,
  ...props
}: React.ComponentProps<typeof Link> & {
  active?: boolean;
}) {
  return (
    <Link
      className={cn(
        "font-medium font-mono text-muted-foreground text-sm transition-all duration-300",
        active && "text-foreground"
      )}
      {...props}
    />
  );
}
