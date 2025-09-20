import { cn } from "@/lib/utils";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto border-edge border-x md:max-w-3xl">
      <div
        className={cn(
          "h-8 px-2",
          "screen-line-after",
          "before:-left-[100vw] before:-z-1 before:absolute before:h-full before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56",
        )}
      />

      {children}
    </div>
  );
}
