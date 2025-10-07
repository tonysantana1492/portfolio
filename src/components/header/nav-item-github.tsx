import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/dtos/profile.dto";

export function NavItemGitHub({ profile }: { profile: Profile }) {
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
