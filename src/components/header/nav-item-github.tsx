import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { PROFILE } from "@/content/profile";

export function NavItemGitHub() {
  return (
    <Button variant="outline" size="icon">
      <a href={PROFILE.githubUrl} target="_blank" rel="noopener">
        <Icons.github />
        <span className="sr-only">GitHub</span>
      </a>
    </Button>
  );
}
