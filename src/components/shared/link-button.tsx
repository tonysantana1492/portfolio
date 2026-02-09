import type React from "react";

import Link from "next/link";

import { type ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LinkButtonProps extends ButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  download?: string;
}

export function LinkButton({
  href,
  className,
  variant = "default",
  size = "default",
  children,
  tabIndex,
  download,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      tabIndex={tabIndex}
      {...(download ? { download } : {})}
    >
      {children}
    </Link>
  );
}
