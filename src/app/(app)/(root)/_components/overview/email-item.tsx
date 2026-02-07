"use client";

import { MailIcon } from "lucide-react";
import { IntroItem } from "@/app/(app)/(root)/_components/overview/intro-item";
import { decodeEmail } from "@/lib/string";

export function EmailItem({ email }: { email: string }) {
  const emailDecoded = decodeEmail(email);

  return (
    <IntroItem
      icon={MailIcon}
      // content={isClient ? emailDecoded : "[Email protected]"}
      content={emailDecoded}
      href={`mailto:${emailDecoded}`}
    />
  );
}
