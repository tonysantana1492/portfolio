import type React from "react";

import { Link } from "lucide-react";

import { type ButtonProps, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LinkButtonProps extends ButtonProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function LinkButton({
  href,
  className,
  variant = "default",
  size = "default",
  children,
  tabIndex,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant, size }), className)}
      tabIndex={tabIndex}
    >
      {children}
    </Link>
  );
}
