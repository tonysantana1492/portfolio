"use client";

import { useTheme } from "next-themes";
import { toast } from "sonner";

import { getLogoSVG, Logo } from "@/components/header/logo";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { copyText } from "@/lib/copy";

export function BrandContextMenu({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      <ContextMenuContent className="w-64">
        <ContextMenuItem
          onClick={() => {
            const svg = getLogoSVG(resolvedTheme === "light" ? "#000" : "#fff");
            copyText(svg);
            toast.success("Copied Logo as SVG");
          }}
        >
          <Logo />
          Copy Logo as SVG
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
