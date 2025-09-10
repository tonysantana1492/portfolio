import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import { USER } from "@/config/user.config";

export function NavItemGitHub() {
  return (
    <Button variant="outline" size="icon">
      <a href={USER.githubUrl} target="_blank" rel="noopener">
        <Icons.github />
        <span className="sr-only">GitHub</span>
      </a>
    </Button>
  );
}
