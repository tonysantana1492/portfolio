"use client";

import { useCallback } from "react";

import { MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button variant="outline" size="icon" onClick={handleToggle}>
      <MoonStarIcon className="hidden [html.dark_&]:block" />
      <SunIcon className="hidden [html.light_&]:block" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}
