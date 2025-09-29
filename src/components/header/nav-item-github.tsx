import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import type { IProfile } from "@/content/profile";

export function NavItemGitHub({ profile }: { profile: IProfile }) {
  return (
    <Button variant="outline" size="icon">
      <a
        href={`https://github.com/${profile.githubUserName}`}
        target="_blank"
        rel="noopener"
      >
        <Icons.github />
        <span className="sr-only">GitHub</span>
      </a>
    </Button>
  );
}
