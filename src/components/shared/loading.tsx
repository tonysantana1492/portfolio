import { Logo } from "@/components/header/logo";
import { cn } from "@/lib/utils";

export function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-[calc(100svh-5.5rem)] flex-col items-center justify-center",
        className
      )}
    >
      <Logo className="h-32 w-32" />
    </div>
  );
}
