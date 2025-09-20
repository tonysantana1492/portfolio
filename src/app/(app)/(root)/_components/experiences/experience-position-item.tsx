import {
  ChevronsDownUpIcon,
  ChevronsUpDownIcon,
  InfinityIcon,
} from "lucide-react";

import { ExperienceIcon } from "./experience-position-icon";
import { Markdown } from "@/components/shared/markdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { Tag } from "@/components/ui/tag";
import { Prose } from "@/components/ui/typography";
import type { ExperiencePosition } from "@/config/experiences";
import { cn } from "@/lib/utils";

export function ExperiencePositionItem({
  position,
}: {
  position: ExperiencePosition;
}) {
  const { start, end } = position.employmentPeriod;
  const isOngoing = !end;

  return (
    <Collapsible defaultOpen={position.isExpanded} asChild>
      <div className="relative last:before:absolute last:before:h-full last:before:w-4 last:before:bg-background">
        <CollapsibleTrigger
          className={cn(
            "group/experience block w-full select-none text-left",
            "after:-top-1 after:-right-1 after:-bottom-1.5 after:-z-1 relative after:absolute after:left-7 after:rounded-lg hover:after:bg-accent/50",
          )}
        >
          <div className="relative z-1 mb-1 flex items-center gap-3">
            <div
              className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground dark:inset-shadow-[1px_1px_1px,0px_0px_1px] dark:inset-shadow-white/15"
              aria-hidden
            >
              <ExperienceIcon className="size-4" icon={position.icon} />
            </div>

            <h4 className="flex-1 text-balance font-medium">
              {position.title}
            </h4>

            <div
              className="shrink-0 text-muted-foreground [&_svg]:size-4"
              aria-hidden
            >
              <ChevronsDownUpIcon className="hidden group-data-[state=open]/experience:block" />
              <ChevronsUpDownIcon className="hidden group-data-[state=closed]/experience:block" />
            </div>
          </div>

          <div className="flex items-center gap-2 pl-9 text-muted-foreground text-sm">
            {position.employmentType && (
              <>
                <dl>
                  <dt className="sr-only">Employment Type</dt>
                  <dd>{position.employmentType}</dd>
                </dl>

                <Separator
                  className="data-[orientation=vertical]:h-4"
                  orientation="vertical"
                />
              </>
            )}

            <dl>
              <dt className="sr-only">Employment Period</dt>
              <dd className="flex items-center gap-0.5">
                <span>{start}</span>
                <span className="font-mono">—</span>
                {isOngoing ? (
                  <>
                    <InfinityIcon
                      className="size-4.5 translate-y-[0.5px]"
                      aria-hidden
                    />
                    <span className="sr-only">Present</span>
                  </>
                ) : (
                  <span>{end}</span>
                )}
              </dd>
            </dl>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden duration-300 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          {position.description && (
            <Prose className="pt-2 pl-9">
              <Markdown>{position.description}</Markdown>
            </Prose>
          )}

          {Array.isArray(position.skills) && position.skills.length > 0 && (
            <ul className="flex flex-wrap gap-1.5 pt-2 pl-9">
              {position.skills.map((skill) => (
                <li key={skill} className="flex">
                  <Tag>{skill}</Tag>
                </li>
              ))}
            </ul>
          )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
