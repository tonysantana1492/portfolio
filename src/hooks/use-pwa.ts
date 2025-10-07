"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOffline: boolean;
  isUpdateAvailable: boolean;
  isSupported: boolean;
}

interface PWAActions {
  install: () => Promise<void>;
  skipWaiting: () => void;
  checkForUpdates: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}

export function usePWA(): PWAState & PWAActions {
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [registration, setRegistration] =
    useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Check if PWA is supported
    setIsSupported("serviceWorker" in navigator);

    // Check if already installed
    const checkInstalled = () => {
      if (window.matchMedia("(display-mode: standalone)").matches) {
        setIsInstalled(true);
      }
    };
    checkInstalled();

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Listen for online/offline
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Set initial offline state
    setIsOffline(!navigator.onLine);

    // Add event listeners
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          setRegistration(reg);

          // Check for updates immediately
          reg.update();

          // Check for updates more frequently
          const updateCheckInterval = setInterval(() => {
            reg.update();
          }, 30000); // Check every 30 seconds

          // Check for updates
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  setIsUpdateAvailable(true);
                  clearInterval(updateCheckInterval);
                }
              });
            }
          });

          // Listen for controlling service worker change
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            clearInterval(updateCheckInterval);
            window.location.reload();
          });

          // Clean up interval on component unmount
          return () => {
            clearInterval(updateCheckInterval);
          };
        })
        .catch((error) => {
          console.error("Service Worker registration failed", error);
        });
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
        setIsInstallable(false);
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error("Installation failed", error);
    }
  };

  const skipWaiting = () => {
    if (!registration || !registration.waiting) return;

    registration.waiting.postMessage({ type: "SKIP_WAITING" });
    setIsUpdateAvailable(false);
  };

  const checkForUpdates = async () => {
    if (registration) {
      try {
        await registration.update();

        // Also clear dynamic cache to force fresh content
        if ("caches" in window) {
          const cacheNames = await caches.keys();
          const dynamicCaches = cacheNames.filter((name) =>
            name.includes("dynamic"),
          );
          await Promise.all(dynamicCaches.map((name) => caches.delete(name)));
        }
      } catch (error) {
        console.error("Failed to check for updates:", error);
      }
    }
  };

  const forceRefresh = async () => {
    try {
      // Clear all caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      // Unregister service worker and reload
      if (registration) {
        await registration.unregister();
      }

      // Force reload from server
      window.location.reload();
    } catch (error) {
      console.error("Failed to force refresh:", error);
      // Fallback to simple reload
      window.location.reload();
    }
  };

  return {
    isInstallable,
    isInstalled,
    isOffline,
    isUpdateAvailable,
    isSupported,
    install,
    skipWaiting,
    checkForUpdates,
    forceRefresh,
  };
}
