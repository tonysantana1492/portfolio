import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";

import {
  type Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  CollapsibleWithContext,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function CodeCollapsibleWrapper({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Collapsible>) {
  return (
    <CollapsibleWithContext
      className={cn("group/collapsible not-prose relative my-6", className)}
      {...props}
    >
      <CollapsibleTrigger>
        <div className="absolute top-9 right-14 z-10 flex items-center gap-2">
          <div className="size-6 rounded-md text-neutral-400 dark:text-neutral-600">
            <ChevronsDownUpIcon
              className="hidden group-data-[state=open]/collapsible:block"
              size={16}
            />
            <ChevronsUpDownIcon
              className="hidden group-data-[state=closed]/collapsible:block"
              size={16}
            />
          </div>

          {/* <Separator
            className="data-[orientation=vertical]:h-4"
            orientation="vertical"
          /> */}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent
        className="overflow-hidden data-[state=closed]:max-h-80 data-[state=closed]:rounded-b-lg [&>figure]:my-0"
        forceMount
      >
        {children}
      </CollapsibleContent>

      <CollapsibleTrigger className="absolute inset-x-0 bottom-0 flex h-24 items-end justify-center rounded-b-lg bg-linear-to-t from-25% from-code to-transparent pb-4 font-medium text-muted-foreground text-sm group-data-[state=open]/collapsible:hidden">
        Expand
      </CollapsibleTrigger>
    </CollapsibleWithContext>
  );
}
