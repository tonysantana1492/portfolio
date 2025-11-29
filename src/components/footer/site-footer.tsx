import { RssIcon } from "lucide-react";

import { SITE_INFO } from "@/config/site.config";
import type { IProfile } from "@/content/profile";
import { cn } from "@/lib/utils";

export function SiteFooter({
  profile,
  className,
}: React.ComponentProps<"footer"> & { profile: IProfile }) {
  return (
    <footer className={cn(className, "max-w-screen overflow-x-hidden px-2")}>
      <div className="screen-line-before mx-auto border-edge border-x pt-4 md:max-w-3xl">
        <p className="mb-1 text-balance px-4 text-center font-mono text-muted-foreground text-sm"></p>

        <p className="mb-4 text-balance px-4 text-center font-mono text-muted-foreground text-sm">
          Built by{" "}
          <a
            className="link"
            href={profile.sections.socialLinks?.items[1].href}
            target="_blank"
            rel="noopener"
          >
            {profile.sections.socialLinks?.items[1].description}
          </a>
          . The source code is available on{" "}
          <a
            className="link"
            href={`https://github.com/${profile.githubUserName}`}
            target="_blank"
            rel="noopener"
          >
            GitHub
          </a>
          .
        </p>

        <div
          className={cn(
            "screen-line-before screen-line-after flex w-full before:z-1 after:z-1",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/56"
          )}
        >
          <div className="mx-auto flex items-center justify-center gap-3 border-edge border-x bg-background px-4">
            <a
              className="flex font-medium font-mono text-muted-foreground text-xs"
              href={`${SITE_INFO.url}/llms.txt`}
              target="_blank"
              rel="noopener noreferrer"
            >
              llms.txt
            </a>

            <Separator />

            <a
              className="flex font-medium font-mono text-muted-foreground text-xs"
              href={`${SITE_INFO.url}/sitemap.xml`}
              target="_blank"
              rel="noopener noreferrer"
            >
              sitemap.xml
            </a>

            <Separator />

            <a
              className="flex items-center text-muted-foreground transition-colors hover:text-foreground"
              href={`${SITE_INFO.url}/blog/rss`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <RssIcon className="size-4" />
              <span className="sr-only">RSS</span>
            </a>
          </div>
        </div>
      </div>
      <div className="pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-2" />
      </div>
    </footer>
  );
}

function Separator() {
  return <div className="flex h-11 w-px bg-edge" />;
}
