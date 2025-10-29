import { Suspense } from "react";

import { Panel } from "../panel";
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph";

export function GitHubContributions() {
  return (
    <Panel>
      <h2 className="sr-only">GitHub Contributions</h2>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph />
      </Suspense>
    </Panel>
  );
}
