import Link from "next/link";

import { ArrowRightIcon } from "lucide-react";

import { Logo } from "@/components/header/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NotFound({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[calc(100svh-5.5rem)] flex-col items-center justify-center",
        className,
      )}
    >
      <Logo className="h-54 w-54" />

      <h1 className="mt-8 mb-6 font-medium font-mono text-8xl">404</h1>

      <Button variant="default" asChild>
        <Link href="/">
          Go to Home
          <ArrowRightIcon />
        </Link>
      </Button>
    </div>
  );
}
