import type { Activity } from "@/components/shared/contribution-graph";

type GitHubContributionsResponse = {
  contributions: Activity[];
};

export async function getGitHubContributions(githubUsername: string) {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${githubUsername}?y=last`,
    {
      next: { revalidate: 86400 }, // Cache for 1 day (86400 seconds)
    },
  );
  const data = (await res.json()) as GitHubContributionsResponse;

  return data.contributions;
}
