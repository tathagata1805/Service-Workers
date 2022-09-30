const cacheName = "v1";

const cacheAssets = ["index.html", "/css/style.css", "/js/main.js"];

// CALL INSTALL EVENT:

self.addEventListener("install", (e) => {
  console.log("Service Worker Installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Servvice Worker: Caching file");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// CALL ACTIVATE EVENT:

self.addEventListener("activate", (e) => {
  console.log("Service Worker Activated");

  // REMOVING UNWANTED CACHE
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// CALLING FETCH EVENT
self.addEventListener("fetch", (e) => {
  console.log("Service Worker: Fetching Service Worker");
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
