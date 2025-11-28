import type { Activity } from "@/components/shared/contribution-graph";
import { PROFILE } from "@/content/profile";

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export async function getGitHubContributions() {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${PROFILE.githubUserName}?y=last`,
    {
      next: { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
    }
  );
  const data = (await res.json()) as GitHubContributionsResponse;

  return data.contributions;
}
