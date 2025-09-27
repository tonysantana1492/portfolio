"use client";

import { usePathname } from "next/navigation";

import { Nav } from "@/components/header/nav";
import type { SerializableNavItem } from "@/config/site.config";

export function DesktopNav({ items }: { items: SerializableNavItem[] }) {
  const pathname = usePathname();

  return <Nav className="max-sm:hidden" items={items} activeId={pathname} />;
}
