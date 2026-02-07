"use client";

import { PhoneIcon } from "lucide-react";
import { IntroItem } from "@/app/(app)/(root)/_components/overview/intro-item";
import { decodePhoneNumber, formatPhoneNumber } from "@/lib/string";

export function PhoneItem({ phoneNumber }: { phoneNumber: string }) {
  const phoneNumberDecoded = decodePhoneNumber(phoneNumber);

  return (
    <IntroItem
      icon={PhoneIcon}
      // content={isClient ? formatPhoneNumber(phoneNumberDecoded) : "[Phone protected]"}
      content={formatPhoneNumber(phoneNumberDecoded)}
      href={`tel:${phoneNumberDecoded}`}
    />
  );
}
