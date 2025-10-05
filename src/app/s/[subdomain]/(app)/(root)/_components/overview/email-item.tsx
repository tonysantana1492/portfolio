"use client";

import { MailIcon } from "lucide-react";

import { IntroItem } from "@/app/s/[subdomain]/(app)/(root)/_components/overview/intro-item";
import { useIsClient } from "@/hooks/use-is-client";

export function EmailItem({ email }: { email: string }) {
  const isClient = useIsClient();

  return (
    <IntroItem
      icon={MailIcon}
      content={isClient ? email : "[Email protected]"}
      href={isClient ? `mailto:${email}` : "#"}
    />
  );
}
