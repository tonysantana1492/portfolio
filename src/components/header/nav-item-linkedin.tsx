"use client";

import { MessagesSquare } from "lucide-react";
import { ButtonWithTooltip } from "@/components/shared/button-with-tooltip";
import type { IProfile } from "@/content/profile";

export function NavItemLinkedIn({ profile }: { profile: IProfile }) {
  const profileUrl = `https://www.linkedin.com/messaging/compose/?recipient=${encodeURIComponent(
    profile?.linkedinUserName ?? ""
  )}`;

  const onClick = () => {
    // Always open profile in a new tab
    window.open(profileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <ButtonWithTooltip
      variant="outline"
      size="icon"
      onClick={onClick}
      aria-label="Chat with me on LinkedIn"
      tooltipText="Chat with me on LinkedIn"
    >
      <MessagesSquare />
      <span className="sr-only">Chat with me on LinkedIn</span>
    </ButtonWithTooltip>
  );
}
