"use client";

import { useMemo } from "react";

import { CopyButton } from "./copy-button";
import { getIconForPackageManager } from "./icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NpmCommands } from "@/lib/unist";

export function CodeBlockCommand({ __pnpm__, __yarn__, __npm__, __bun__ }: NpmCommands) {
  // const [config, setConfig] = useConfig();

  const packageManager = "pnpm"; // config.packageManager || "pnpm";

  const tabs = useMemo(() => {
    return {
      pnpm: __pnpm__,
      yarn: __yarn__,
      npm: __npm__,
      bun: __bun__,
    };
  }, [__pnpm__, __yarn__, __npm__, __bun__]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-code">
      <Tabs
        className="gap-0"
        value={packageManager}
        onValueChange={(_value) => {
          // setConfig((prev) => ({
          //   ...prev,
          //   packageManager: value as PackageManager,
          // }));
        }}
      >
        <div className="border-b px-4">
          <TabsList className="h-auto translate-y-px gap-3 rounded-none bg-transparent p-0 dark:bg-transparent [&_svg]:size-4 [&_svg]:text-muted-foreground">
            {getIconForPackageManager(packageManager)}

            {Object.entries(tabs).map(([key]) => {
              return (
                <TabsTrigger
                  key={key}
                  className="h-10 rounded-none border-transparent border-b p-0 font-mono data-[state=active]:border-foreground data-[state=active]:bg-transparent dark:data-[state=active]:inset-shadow-none dark:data-[state=active]:bg-transparent"
                  value={key}
                >
                  {key}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {Object.entries(tabs).map(([key, value]) => {
          return (
            <TabsContent key={key} value={key}>
              <pre>
                <code
                  data-slot="code-block"
                  data-language="bash"
                  className="font-mono text-code-foreground text-sm leading-none"
                >
                  {value}
                </code>
              </pre>
            </TabsContent>
          );
        })}
      </Tabs>

      <CopyButton className="absolute top-2 right-2" value={tabs[packageManager] || ""} />
    </div>
  );
}
