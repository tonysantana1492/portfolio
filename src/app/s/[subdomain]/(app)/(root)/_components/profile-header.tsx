import { FlipSentences } from "@/app/s/[subdomain]/(app)/(root)/_components/flip-sentences";
import { VCardQR } from "@/components/shared/v-card-qrcode";
import type { IProfile } from "@/content/profile";
import { cn } from "@/lib/utils";

export function ProfileHeader({
  profile,
  className,
}: React.ComponentProps<"div"> & { profile: IProfile }) {
  return (
    <div
      className={cn("screen-line-after flex border-edge border-x", className)}
    >
      <div className="shrink-0 border-edge border-r">
        <div className="mx-[2px] my-[3px]">
          {/** biome-ignore lint/performance/noImgElement: <explanation > */}
          <img
            className="size-32 select-none rounded-full ring-1 ring-border ring-offset-2 ring-offset-background sm:size-40"
            alt={`${profile.displayName}'s avatar`}
            src={profile.avatar}
            fetchPriority="high"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <div
          className={cn(
            "flex grow items-end pb-1 pl-4",
            "bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px] [--pattern-foreground:var(--color-edge)]/56"
          )}
        >
          <div className="line-clamp-1 flex w-full select-none justify-end font-mono text-xs text-zinc-300 max-sm:hidden dark:text-zinc-800">
            {/* {"text-3xl "}
            <span className="inline dark:hidden">text-zinc-950</span>
            <span className="hidden dark:inline">text-zinc-50</span>
            {" font-medium"} */}
            <VCardQR profile={profile} size={70} showDownloadButtons={false} />
          </div>
        </div>

        <div className="border-edge border-t">
          <h1 className="flex items-center pl-4 font-semibold text-3xl">
            {profile.displayName}
          </h1>

          <div className="h-12 border-edge border-t py-1 pl-4 sm:h-auto">
            <FlipSentences sentences={profile.flipSentences} />
          </div>
        </div>
      </div>
    </div>
  );
}
