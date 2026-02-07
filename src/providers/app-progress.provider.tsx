"use client";

import { ProgressProvider as AppProgressProviderPrimitive } from "@bprogress/next/app";

export const AppProgressProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProgressProviderPrimitive
      color="var(--foreground)"
      height="2px"
      delay={200}
      options={{ showSpinner: false }}
    >
      {children}
    </AppProgressProviderPrimitive>
  );
};
