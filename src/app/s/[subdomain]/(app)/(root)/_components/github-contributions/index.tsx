import { Suspense } from "react";

import { Panel } from "../panel";
import { GitHubContributionFallback, GitHubContributionGraph } from "./graph";
import type { IProfile } from "@/content/profile";
import { getGitHubContributions } from "@/services/github-contributions";

interface GitHubContributionsProps {
  profile: IProfile;
}

export function GitHubContributions({ profile }: GitHubContributionsProps) {
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
