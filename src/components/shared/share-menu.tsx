"use client";

import { LinkIcon, Share2Icon, ShareIcon } from "lucide-react";
import { toast } from "sonner";
import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyText } from "@/lib/copy";

export function ShareMenu({ url }: { url: string }) {
  const absoluteUrl = url.startsWith("http")
    ? url
    : typeof window !== "undefined"
      ? new URL(url, window.location.origin).toString()
      : url;

  const urlEncoded = encodeURIComponent(absoluteUrl);

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        // text: "Check out this page",
        url: absoluteUrl,
      });
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    copyText(absoluteUrl);
    toast.success("Copied link");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon:sm">
          <ShareIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon />
          Copy link
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleShareLink}>
          <Share2Icon />
          Share
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite?url=${urlEncoded}`}
            target="_blank"
            rel="noopener"
          >
            <Icons.linkedin />
            Share on LinkedIn
          </a>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <a href={`https://x.com/intent/tweet?url=${urlEncoded}`} target="_blank" rel="noopener">
            <Icons.x />
            Share on X
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
