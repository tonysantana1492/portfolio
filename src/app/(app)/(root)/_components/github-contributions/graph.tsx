import { LoaderIcon } from "lucide-react";

import { GraphChildren } from "@/app/(app)/(root)/_components/github-contributions/graph-children";
import { ContributionGraph } from "@/components/shared/contribution-graph";
import { getGitHubContributions } from "@/content/github-contributions";

export async function GitHubContributionGraph() {
  const contributions = await getGitHubContributions();

  return (
    <ContributionGraph
      className="mx-auto py-2"
      data={contributions}
      blockSize={11}
      blockMargin={3}
      blockRadius={0}
    >
      <GraphChildren />
    </ContributionGraph>
  );
}

export function GitHubContributionFallback() {
  return (
    <div className="flex h-[162px] w-full items-center justify-center">
      <LoaderIcon className="animate-spin text-muted-foreground" />
    </div>
  );
}
