"use client";

import { Tabs } from "@/components/ui/tabs";

export function CodeTabs(props: React.ComponentProps<typeof Tabs>) {
  // const [config, setConfig] = useConfig();

  const installationType = "cli"; //config.installationType || "cli";

  return (
    <Tabs
      value={installationType}
      onValueChange={(_value) => {
        // setConfig((prev) => ({
        //   ...prev,
        //   installationType: value as InstallationType,
        // }));
      }}
      {...props}
    />
  );
}
