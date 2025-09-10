"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export const THEME_COOKIE_NAME = "active-theme";
const DEFAULT_THEME = "default";

function setThemeCookie(theme: string) {
  if (typeof window === "undefined") return;

  // biome-ignore lint/suspicious/noDocumentCookie: <explanation >
  document.cookie = `${THEME_COOKIE_NAME}=${theme}; path=/; max-age=31536000; SameSite=Lax; ${
    window.location.protocol === "https:" ? "Secure;" : ""
  }`;
}

interface ThemeContextType {
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface Props extends PropsWithChildren {
  initialTheme?: string;
}

export function ThemeColorProvider({ children, initialTheme }: Props) {
  const [activeTheme, setActiveTheme] = useState<string>(
    () => initialTheme ?? DEFAULT_THEME
  );

  useEffect(() => {
    setThemeCookie(activeTheme);

    Array.from(document.body.classList)
      .filter((className) => className.startsWith("theme-"))
      .forEach((className) => {
        document.body.classList.remove(className);
      });
    document.body.classList.add(`theme-${activeTheme}`);
    if (activeTheme.endsWith("-scaled")) {
      document.body.classList.add("theme-scaled");
    }
  }, [activeTheme]);

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeConfig() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeConfig must be used within an ActiveThemeProvider"
    );
  }
  return context;
}
