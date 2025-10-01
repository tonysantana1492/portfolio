const CACHE_NAME = "portfolio-v1";
const STATIC_CACHE_NAME = "portfolio-static-v1";
const DYNAMIC_CACHE_NAME = "portfolio-dynamic-v1";

// Assets to cache immediately
const STATIC_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/images/icon-192x192.png",
  "/images/icon-512x512.png",
  "/images/favicon.ico",
  "/images/favicon.svg",
  "/images/apple-touch-icon.png",
  "/images/logo.svg",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Skip waiting");
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME
            ) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => {
        console.log("Service Worker: Claiming clients");
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Skip Chrome extensions and other non-http(s) requests
  if (!request.url.startsWith("http")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache", request.url);
        return cachedResponse;
      }

      // Clone the request because it's a stream and can only be consumed once
      const fetchRequest = request.clone();

      return fetch(fetchRequest)
        .then((response) => {
          // Check if response is valid
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response because it's a stream and can only be consumed once
          const responseToCache = response.clone();

          // Determine which cache to use
          let cacheName = DYNAMIC_CACHE_NAME;

          // Cache static assets in static cache
          if (STATIC_ASSETS.some((asset) => request.url.includes(asset))) {
            cacheName = STATIC_CACHE_NAME;
          }

          // Add to cache
          caches.open(cacheName).then((cache) => {
            console.log("Service Worker: Caching new resource", request.url);
            cache.put(request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline page for navigation requests
          if (request.destination === "document") {
            return caches.match("/");
          }

          // Return placeholder for images
          if (request.destination === "image") {
            return caches.match("/images/logo.svg");
          }
        });
    })
  );
});

// Background sync for when connectivity is restored
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync", event.tag);
  // Add background sync logic here if needed
});

// Push notifications (optional)
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push message received");

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
  console.log("Service Worker: Notification click received", event);

  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Message handler for communication with main thread
self.addEventListener("message", (event) => {
  console.log("Service Worker: Message received", event.data);

  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data && event.data.type === "GET_VERSION") {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
