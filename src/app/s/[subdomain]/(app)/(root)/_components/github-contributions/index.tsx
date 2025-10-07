import { Suspense } from "react";

import { Panel } from "../panel";
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph";
import type { Profile } from "@/dtos/profile.dto";
import { getGitHubContributions } from "@/services/github-contributions.service";

interface GitHubContributionsProps {
  profile: Profile;
}

export function GitHubContributions({
  profile,
}: React.ComponentProps<typeof Panel> & GitHubContributionsProps) {
  const contributions = getGitHubContributions(profile.githubUserName);

  return (
    <Panel>
      <h2 className="sr-only">GitHub Contributions</h2>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph
          contributions={contributions}
          githubUserName={profile.githubUserName}
        />
      </Suspense>
    </Panel>
  );
}
