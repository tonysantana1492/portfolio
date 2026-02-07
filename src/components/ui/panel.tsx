import type React from "react";

import { Slot as SlotPrimitive } from "radix-ui";

const Slot = SlotPrimitive.Slot;

import { cn } from "@/lib/utils";

function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="panel"
      className={cn("screen-line-before screen-line-after border-edge border-x", className)}
      {...props}
    />
  );
}

function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="panel-header" className={cn("screen-line-after px-4", className)} {...props} />
  );
}

function PanelTitle({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"h2"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "h2";

  return (
    <Comp data-slot="panel-title" className={cn("font-semibold text-3xl", className)} {...props} />
  );
}

function PanelContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-body" className={cn("p-4", className)} {...props} />;
}

export { Panel, PanelContent, PanelHeader, PanelTitle };
