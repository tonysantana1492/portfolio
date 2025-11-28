"use client";

import type { PropsWithChildren } from "react";

import { AppProgressProvider } from "@bprogress/next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LazyMotion, domMax as loadFeatures } from "motion/react";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { PWAPrompts } from "@/components/shared/pwa-prompts";
import { Toaster } from "@/components/ui/sonner";
import { ThemeColorProvider } from "@/theme/theme-color.provider";

interface Props extends PropsWithChildren {
  activeThemeValue: string | undefined;
}

export const Providers = ({ children, activeThemeValue }: Props) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
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
            <NuqsAdapter>{children}</NuqsAdapter>
          </LazyMotion>
        </AppProgressProvider>
      </ThemeColorProvider>
      <Toaster
        richColors
        visibleToasts={4}
        closeButton
        duration={5000}
        expand={false}
        toastOptions={{
          classNames: {
            loading: "!bg-primary !text-primary-foreground",
          },
        }}
      />
      <SpeedInsights sampleRate={0.5} />
      <Analytics />
      <PWAPrompts />
    </ThemeProvider>
  );
};
