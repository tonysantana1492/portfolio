"use client";

import dayjs from "dayjs";
import {
  ContributionGraphBlock,
  ContributionGraphCalendar,
  ContributionGraphFooter,
  ContributionGraphLegend,
  ContributionGraphTotalCount,
} from "@/components/shared/contribution-graph";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PROFILE } from "@/content/profile";

export const GraphChildren = () => {
  return (
    <>
      <ContributionGraphCalendar className="no-scrollbar px-2">
        {({ activity, dayIndex, weekIndex }) => (
          <Tooltip>
            <TooltipTrigger asChild>
              <g>
                <ContributionGraphBlock
                  activity={activity}
                  // className={cn(
                  //   'data-[level="0"]:fill-[#ebedf0] dark:data-[level="0"]:fill-[#161b22]',
                  //   'data-[level="1"]:fill-[#9be9a8] dark:data-[level="1"]:fill-[#0e4429]',
                  //   'data-[level="2"]:fill-[#40c463] dark:data-[level="2"]:fill-[#006d32]',
                  //   'data-[level="3"]:fill-[#30a14e] dark:data-[level="3"]:fill-[#26a641]',
                  //   'data-[level="4"]:fill-[#216e39] dark:data-[level="4"]:fill-[#39d353]'
                  // )}
                  dayIndex={dayIndex}
                  weekIndex={weekIndex}
                />
              </g>
            </TooltipTrigger>

            <TooltipContent className="font-sans" sideOffset={0}>
              <p>
                {activity.count} contribution{activity.count > 1 ? "s" : null} on{" "}
                {dayjs(activity.date).format("DD.MM.YYYY")}
              </p>
            </TooltipContent>
          </Tooltip>
        )}
      </ContributionGraphCalendar>
      <ContributionGraphFooter className="px-2">
        <ContributionGraphTotalCount>
          {({ totalCount, year }) => (
            <div className="text-muted-foreground">
              {totalCount.toLocaleString("en")} contributions in {year} on{" "}
              <a
                className="font-medium underline underline-offset-4"
                href={`https://github.com/${PROFILE.githubUserName}`}
                target="_blank"
                rel="noopener"
              >
                GitHub
              </a>
              .
            </div>
          )}
        </ContributionGraphTotalCount>

        <ContributionGraphLegend />
      </ContributionGraphFooter>
    </>
  );
};
