/**
 * PWA utility functions
 */

export function isPWA(): boolean {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    // Check for iOS Safari standalone mode
    ("standalone" in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

export function isIOS(): boolean {
  if (typeof window === "undefined") return false;

  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false;

  return /Android/.test(navigator.userAgent);
}

export function isMobile(): boolean {
  if (typeof window === "undefined") return false;

  return isIOS() || isAndroid() || window.innerWidth <= 768;
}

export function canInstallPWA(): boolean {
  if (typeof window === "undefined") return false;

  // Check if browser supports PWA installation
  return "serviceWorker" in navigator && "BeforeInstallPromptEvent" in window;
}

export function getInstallInstructions(): {
  platform: string;
  instructions: string[];
} {
  if (isIOS()) {
    return {
      platform: "iOS Safari",
      instructions: [
        "Tap the Share button",
        'Scroll down and tap "Add to Home Screen"',
        'Tap "Add" to install the app',
      ],
    };
  }

  if (isAndroid()) {
    return {
      platform: "Android Chrome",
      instructions: [
        "Tap the menu button (⋮)",
        'Tap "Add to Home screen"',
        'Tap "Add" to install the app',
      ],
    };
  }

  return {
    platform: "Desktop",
    instructions: [
      "Look for the install icon in the address bar",
      "Click it to install the app",
      'Or use the browser menu > "Install app"',
    ],
  };
}

export function shareContent(data: {
  title?: string;
  text?: string;
  url?: string;
}) {
  if (typeof window === "undefined") return false;

  if (navigator.share) {
    navigator.share(data).catch(console.error);
    return true;
  }

  return false;
}
