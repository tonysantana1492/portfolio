"use client";

import type { PropsWithChildren } from "react";

import { AppProgressProvider } from "@bprogress/next";
import { LazyMotion, domMax as loadFeatures } from "motion/react";
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
          height="2px"
          delay={200}
          options={{ showSpinner: false }}
        >
          <LazyMotion features={loadFeatures} strict>
            {children}
          </LazyMotion>
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
