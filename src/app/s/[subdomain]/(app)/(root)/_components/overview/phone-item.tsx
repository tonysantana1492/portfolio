"use client";

import { PhoneIcon } from "lucide-react";

import { IntroItem } from "@/app/s/[subdomain]/(app)/(root)/_components/overview/intro-item";
import { useIsClient } from "@/hooks/use-is-client";
import { formatPhoneNumber } from "@/lib/string";

export function PhoneItem({ phoneNumber }: { phoneNumber: string }) {
  const isClient = useIsClient();

  return (
    <IntroItem
      icon={PhoneIcon}
      content={isClient ? formatPhoneNumber(phoneNumber) : "[Phone protected]"}
      href={isClient ? `tel:${phoneNumber}` : "#"}
    />
  );
}
