"use client";

import Link from "next/link";

import { DownloadIcon, TriangleDashedIcon, TypeIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { getMarkSVG, Mark } from "@/components/header/mark";
import { getWordmarkSVG } from "@/components/header/wordmark";
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
            const svg = getMarkSVG(resolvedTheme === "light" ? "#000" : "#fff");
            copyText(svg);
            toast.success("Copied Mark as SVG");
          }}
        >
          <Mark />
          Copy Mark as SVG
        </ContextMenuItem>

        <ContextMenuItem
          onClick={() => {
            const svg = getWordmarkSVG(
              resolvedTheme === "light" ? "#000" : "#fff"
            );
            copyText(svg);
            toast.success("Copied Logotype as SVG");
          }}
        >
          <TypeIcon />
          Copy Logotype as SVG
        </ContextMenuItem>

        <ContextMenuItem asChild>
          <Link href="/blog/chanhdai-brand">
            <TriangleDashedIcon />
            Brand Guidelines
          </Link>
        </ContextMenuItem>

        <ContextMenuItem asChild>
          <a href="https://assets.chanhdai.com/chanhdai-brand.zip" download>
            <DownloadIcon />
            Download Brand Assets
          </a>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
