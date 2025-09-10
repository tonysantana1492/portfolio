"use client";

import type { PropsWithChildren } from "react";

import { AppProgressProvider } from "@bprogress/next";
import { ThemeProvider } from "next-themes";

import { TailwindIndicator } from "@/components/shared/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { ThemeColorProvider } from "@/theme/theme-color.provider";

interface Props extends PropsWithChildren {
  activeThemeValue: string | undefined;
}

export const Providers = ({ children, activeThemeValue }: Props) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ThemeColorProvider initialTheme={activeThemeValue}>
        <AppProgressProvider
          color="var(--foreground)"
          height="10px"
          delay={500}
          options={{ showSpinner: false }}
        >
          {children}
        </AppProgressProvider>
      </ThemeColorProvider>
      <Toaster
        richColors
        // visibleToasts={2}
        closeButton
        duration={5000}
        expand={false}
      />
      <TailwindIndicator />
    </ThemeProvider>
  );
};
