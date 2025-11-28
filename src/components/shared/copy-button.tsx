"use client";

import { useOptimistic, useTransition } from "react";

import { CheckIcon, CircleXIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const motionIconVariants = {
  initial: { opacity: 0, scale: 0.8, filter: "blur(2px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.8 },
};

export const motionIconProps = {
  variants: motionIconVariants,
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

export function CopyButton({
  value,
  className,
  ...props
}: {
  value: string;
  className?: string;
}) {
  const [state, setState] = useOptimistic<"idle" | "copied" | "failed">("idle");
  const [, startTransition] = useTransition();

  return (
    <Button
      size="icon"
      variant="secondary"
      className={cn("z-10 size-6 rounded-md", className)}
      onClick={() => {
        startTransition(async () => {
          try {
            await navigator.clipboard.writeText(value);
            setState("copied");
          } catch {
            setState("failed");
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
        });
      }}
      {...props}
    >
      {state === "idle" ? (
        <CopyIcon className="size-3" />
      ) : state === "copied" ? (
        <CheckIcon className="size-3" />
      ) : state === "failed" ? (
        <CircleXIcon className="size-3" />
      ) : null}
      <span className="sr-only">Copy</span>
    </Button>
  );
}
