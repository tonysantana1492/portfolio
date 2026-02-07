"use client";

import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/use-pwa";

export function PWAInstallButton() {
  const { isInstallable, isInstalled, install } = usePWA();

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <Button onClick={install} variant="outline" size="sm" className="gap-2">
      <Download className="h-4 w-4" />
      Install App
    </Button>
  );
}

export function PWAStatus() {
  const { isInstalled, isOffline, isSupported } = usePWA();

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-muted-foreground text-sm">
      <Smartphone className="h-4 w-4" />
      {isInstalled && <span>App Installed</span>}
      {isOffline && <span className="text-orange-500">Offline</span>}
      {!isInstalled && !isOffline && <span>PWA Ready</span>}
    </div>
  );
}
