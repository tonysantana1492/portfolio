import type { LucideProps } from "lucide-react";
import { BriefcaseBusinessIcon } from "lucide-react";

import { Icons } from "@/components/shared/icons";

export function ExperienceIcon({
  icon,
  ...props
}: {
  icon: string | undefined;
} & LucideProps) {
  const IconComponent =
    icon && icon in Icons
      ? Icons[icon as keyof typeof Icons]
      : BriefcaseBusinessIcon;
  return <IconComponent {...props} />;
}
