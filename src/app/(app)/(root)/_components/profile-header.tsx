import "server-only";

import Image from "next/image";

import { ExportButton } from "@/app/(app)/(docs)/resume/[slug]/_components/export-button";
import { FlipSentences } from "@/app/(app)/(root)/_components/flip-sentences";
import { VCardQR } from "@/components/shared/v-card-qrcode";
import { type IProfile, PROFILE } from "@/content/profile";
import { cn } from "@/lib/utils";

export function ProfileHeader({
  profile,
  className,
}: React.ComponentProps<"div"> & { profile: IProfile }) {
  return (
    <div className={cn("screen-line-after flex border-edge border-x", className)}>
      <div className="shrink-0 border-edge border-r">
        <div className="mx-0.5 my-0.75">
          <Image
            className="size-32 select-none rounded-full ring-1 ring-border ring-offset-2 ring-offset-background sm:size-40"
            alt={`${profile.displayName}'s avatar`}
            src={profile.avatar}
            width={160}
            height={160}
            fetchPriority="high"
            priority
          />
        </div>
      </div>
      <div className="flex flex-1 flex-col">
        <div
          className={cn(
            "flex grow items-end pb-1 pl-4",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/56",
          )}
        >
          <div className="line-clamp-1 flex w-full select-none justify-end font-mono text-xs text-zinc-300 max-sm:hidden dark:text-zinc-800">
            <VCardQR size={70} showDownloadButtons={false} />
          </div>
        </div>

        <div className="border-edge border-t">
          <div className="flex items-center justify-start gap-4 px-2 py-1 sm:justify-between">
            <h1 className="flex items-center font-semibold text-3xl">{PROFILE.displayName}</h1>
            <ExportButton
              className="hidden sm:flex"
              slug={"tony-santana"}
              fileName={profile.displayName}
              text="Download Resume"
            />
            <ExportButton
              className="sm:hidden"
              slug={"tony-santana"}
              fileName={profile.displayName}
              tooltipText="Download Resume"
            />
          </div>

          <div className="h-12 border-edge border-t py-1 pl-4 sm:h-auto">
            <FlipSentences sentences={PROFILE.flipSentences} />
          </div>
        </div>
      </div>
    </div>
  );
}
