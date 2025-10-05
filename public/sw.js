// const CACHE_VERSION = Date.now();
const CACHE_VERSION = 1;
const CACHE_NAME = `portfolio-v${CACHE_VERSION}`;
const STATIC_CACHE_NAME = `portfolio-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `portfolio-dynamic-v${CACHE_VERSION}`;

// Install event - cache static assets
self.addEventListener("install", () => {
  // Pre-cache static assets
});

// Activate event - clean up old caches aggressively
self.addEventListener("activate", (event) => {
  // Clean up old caches
  event.waitUntil(
    caches
      .delete(CACHE_NAME)
      .then(() => caches.delete(STATIC_CACHE_NAME))
      .then(() => caches.delete(DYNAMIC_CACHE_NAME))
  );
  return self.clients.claim();
});

// Fetch event - intelligent caching strategy

// Background sync for when connectivity is restored
self.addEventListener("sync", () => {
  // Add background sync logic here if needed
});

// Push notifications (optional)
self.addEventListener("push", (event) => {
  const options = {
    body: event.data ? event.data.text() : "New update available!",
    icon: "/images/icon-192x192.png",
    badge: "/images/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View",
        icon: "/images/icon-192x192.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/images/icon-192x192.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Portfolio Update", options)
  );
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handler for communication with main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
