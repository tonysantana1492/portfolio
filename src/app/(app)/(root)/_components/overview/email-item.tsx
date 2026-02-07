"use client";

import { MailIcon } from "lucide-react";
import { IntroItem } from "@/app/(app)/(root)/_components/overview/intro-item";
import { useIsClient } from "@/hooks/use-is-client";
import { decodeEmail } from "@/lib/string";

export function EmailItem({ email }: { email: string }) {
  const isClient = useIsClient();
  const emailDecoded = decodeEmail(email);

  return (
    <IntroItem
      icon={MailIcon}
      content={isClient ? emailDecoded : "[Email protected]"}
      href={isClient ? `mailto:${emailDecoded}` : "#"}
    />
  );
}
