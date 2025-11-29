"use client";

import { CodeXmlIcon, EyeIcon, RepeatIcon } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Code as CodeInline } from "@/components/ui/typography";

import { CodeCollapsibleWrapper } from "./code-collapsible-wrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { OpenInV0Button } from "@/components/shared/v0-open-button";

export function ComponentPreview({
  className,
  name,
  openInV0Url,
  canReplay = false,
  notProse = true,
  codeCollapsible = false,
  remountOnThemeChange = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  name: string;
  openInV0Url?: string;
  canReplay?: boolean;
  notProse?: boolean;
  codeCollapsible?: boolean;
  remountOnThemeChange?: boolean;
}) {
  const { resolvedTheme } = useTheme();

  const [replay, setReplay] = useState(0);

  const Codes = React.Children.toArray(children) as React.ReactElement[];
  const Code = Codes[0];

  const Preview = useMemo(() => {
    const Component = false; //Index[name]?.component;

    if (!Component) {
      return (
        <p className="text-sm text-muted-foreground">
          Component <CodeInline>{name}</CodeInline> not found in registry.
        </p>
      );
    }

    // return <Component />;
  }, [name]);

  return (
    <div
      className={cn("my-[1.25em]", notProse && "not-prose", className)}
      {...props}
    >
      <Tabs defaultValue="preview" className="gap-4">
        <TabsList>
          <TabsTrigger className="px-2.5" value="preview">
            <EyeIcon />
            Preview
          </TabsTrigger>
          <TabsTrigger className="px-2.5" value="code">
            <CodeXmlIcon />
            Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div
            data-slot="preview"
            className="rounded-xl border border-edge p-2"
            // className="bg-zinc-950/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-white/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
          >
            {(canReplay || openInV0Url) && (
              <div data-slot="buttons" className="mb-2 flex justify-end gap-2">
                {canReplay && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="rounded-md"
                        variant="secondary"
                        size="icon:sm"
                        onClick={() => setReplay((v) => v + 1)}
                      >
                        <RepeatIcon />
                      </Button>
                    </TooltipTrigger>

                    <TooltipContent>
                      <p>Replay</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {openInV0Url && <OpenInV0Button url={openInV0Url} />}
              </div>
            )}

            <div
              key={`${replay}-${
                remountOnThemeChange ? resolvedTheme ?? "system" : "static"
              }`}
              data-slot="component-preview"
              className="flex min-h-72 items-center justify-center font-sans"
            >
              <React.Suspense
                fallback={
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    Loading...
                  </div>
                }
              >
                {Preview}
              </React.Suspense>
            </div>

            {(canReplay || openInV0Url) && <div className="mt-2 h-7" />}
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
