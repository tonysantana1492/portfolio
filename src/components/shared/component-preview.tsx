"use client";

import React, { useMemo, useState } from "react";

import { RepeatIcon } from "lucide-react";

import { CodeCollapsibleWrapper } from "@/components/shared/code-collapsible-wrapper";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { Code as CodeInline } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export function ComponentPreview({
  className,
  name,
  openInV0Url,
  canReplay = false,
  notProse = true,
  codeCollapsible = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  openInV0Url?: string;
  canReplay?: boolean;
  notProse?: boolean;
  codeCollapsible?: boolean;
}) {
  const [replay, setReplay] = useState(0);

  const Codes = React.Children.toArray(children) as React.ReactElement[];
  const Code = Codes[0];

  const Preview = useMemo(() => {
    return (
      <p className="text-muted-foreground text-sm">
        Component <CodeInline>{name}</CodeInline> not found in registry.
      </p>
    );
  }, [name]);

  return (
    <div className={cn("my-6", notProse && "not-prose", className)} {...props}>
      <Tabs defaultValue="preview" className="gap-4">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="rounded-lg border border-edge bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-center bg-size-[10px_10px] bg-zinc-950/0.75 p-4 [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5">
            {(canReplay || openInV0Url) && (
              <div className="flex justify-end gap-2">
                {canReplay && (
                  <SimpleTooltip content="Replay">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setReplay((v) => v + 1)}
                    >
                      <RepeatIcon />
                    </Button>
                  </SimpleTooltip>
                )}

                {/* {openInV0Url && <OpenInV0Button url={openInV0Url} />} */}
              </div>
            )}

            <div
              key={replay}
              className="flex min-h-80 items-center justify-center font-sans"
            >
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center text-muted-foreground text-sm">
                    Loading...
                  </div>
                }
              >
                {Preview}
              </React.Suspense>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="code" className="[&>figure]:m-0">
          {codeCollapsible ? (
            <CodeCollapsibleWrapper className="my-0">
              {Code}
            </CodeCollapsibleWrapper>
          ) : (
            Code
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
