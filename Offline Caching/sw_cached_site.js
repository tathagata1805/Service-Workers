const cacheName = "v2";

// CALL INSTALL EVENT:

self.addEventListener("install", (e) => {
  console.log("Service Worker Installed");
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
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // MAKING A CLONE OF THE RESPONSE
        const resClone = res.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch((err) => caches.match(e.request).then((res) => res))
  );
});
