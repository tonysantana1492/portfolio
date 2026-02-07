"use client";

import { useState } from "react";

import { Download, RefreshCw, Share, Smartphone, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePWA } from "@/hooks/use-pwa";
import { getInstallInstructions, shareContent } from "@/lib/pwa-utils";

export function PWAMenu() {
  const {
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    isSupported,
    install,
    skipWaiting,
    checkForUpdates,
  } = usePWA();

  const [showInstructions, setShowInstructions] = useState(false);

  if (!isSupported) {
    return null;
  }

  const instructions = getInstallInstructions();

  const handleShare = () => {
    const success = shareContent({
      title: document.title,
      text: "Check out this awesome portfolio!",
      url: window.location.href,
    });

    if (!success) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href).catch(console.error);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          {isOffline ? (
            <WifiOff className="h-4 w-4 text-orange-500" />
          ) : (
            <Smartphone className="h-4 w-4" />
          )}
          {(isInstallable || isUpdateAvailable) && (
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-blue-500" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>App Status</DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isOffline && (
          <DropdownMenuItem disabled>
            <WifiOff className="mr-2 h-4 w-4 text-orange-500" />
            You're offline
          </DropdownMenuItem>
        )}

        {!isOffline && (
          <DropdownMenuItem disabled>
            <Wifi className="mr-2 h-4 w-4 text-green-500" />
            Online
          </DropdownMenuItem>
        )}

        {isInstalled && (
          <DropdownMenuItem disabled>
            <Smartphone className="mr-2 h-4 w-4 text-green-500" />
            App installed
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {isInstallable && !isInstalled && (
          <DropdownMenuItem onClick={install}>
            <Download className="mr-2 h-4 w-4" />
            Install app
          </DropdownMenuItem>
        )}

        {!isInstallable && !isInstalled && (
          <DropdownMenuItem onClick={() => setShowInstructions(!showInstructions)}>
            <Download className="mr-2 h-4 w-4" />
            Install instructions
          </DropdownMenuItem>
        )}

        {isUpdateAvailable && (
          <DropdownMenuItem onClick={skipWaiting}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Update available
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={checkForUpdates}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Check for updates
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleShare}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>

        {showInstructions && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="font-normal text-muted-foreground text-xs">
              {instructions.platform} Instructions:
            </DropdownMenuLabel>
            {instructions.instructions.map((instruction, index) => (
              <DropdownMenuItem key={instruction} disabled className="text-xs">
                {index + 1}. {instruction}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
