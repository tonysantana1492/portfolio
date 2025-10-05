"use client";

import { useState } from "react";

import { Download, RefreshCw, Wifi, WifiOff, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";

export function PWAPrompts() {
  const {
    isInstallable,
    isOffline,
    isUpdateAvailable,
    isSupported,
    install,
    skipWaiting,
  } = usePWA();

  const [dismissedInstall, setDismissedInstall] = useState(false);
  const [dismissedUpdate, setDismissedUpdate] = useState(false);

  if (!isSupported) return null;

  return (
    <>
      {/* Offline Indicator */}
      {isOffline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-white shadow-lg">
          <WifiOff className="h-4 w-4" />
          <span className="font-medium text-sm">You're offline</span>
        </div>
      )}

      {/* Install App Prompt */}
      {/* {isInstallable && !dismissedInstall && (
        <div className="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg border bg-background p-4 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Download className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Install App</p>
                <p className="text-muted-foreground text-xs">
                  Add this app to your home screen for quick access
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissedInstall(true)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={install} className="flex-1">
              Install
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDismissedInstall(true)}
              className="flex-1"
            >
              Not now
            </Button>
          </div>
        </div>
      )} */}

      {/* Update Available Prompt */}
      {isUpdateAvailable && !dismissedUpdate && (
        <div className="fixed right-4 bottom-4 z-50 max-w-sm rounded-lg border bg-background p-4 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-500/10 p-2">
                <RefreshCw className="h-4 w-4 text-blue-500" />
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">Update Available</p>
                <p className="text-muted-foreground text-xs">
                  A new version of the app is ready
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissedUpdate(true)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={skipWaiting} className="flex-1">
              Update Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDismissedUpdate(true)}
              className="flex-1"
            >
              Later
            </Button>
          </div>
        </div>
      )}

      {/* Online Indicator (when coming back online) */}
      {!isOffline && (
        <div className="slide-in-from-bottom fixed bottom-4 left-4 z-50 hidden animate-in items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white shadow-lg duration-300">
          <Wifi className="h-4 w-4" />
          <span className="font-medium text-sm">Back online</span>
        </div>
      )}
    </>
  );
}
