import Image from "next/image";

import { ArrowUpRightIcon } from "lucide-react";

import type { SocialLink } from "@/config/social-links.config";
import { cn } from "@/lib/utils";

export function SocialLinkItem({ icon, title, description, href }: SocialLink) {
  return (
    <a
      className={cn(
        "group/link flex cursor-pointer select-none items-center gap-4 rounded-2xl p-4 pr-2 transition-colors",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
      href={href}
      target="_blank"
      rel="noopener"
    >
      <Image
        className="shrink-0"
        src={icon}
        alt={title}
        width={48}
        height={48}
        quality={100}
        unoptimized
      />

      <div className="flex-1">
        <h3 className="flex items-center font-medium underline-offset-4 group-hover/link:underline">
          {title}
        </h3>

        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
        )}
      </div>

      <ArrowUpRightIcon className="size-4 text-muted-foreground" />
    </a>
  );
}
