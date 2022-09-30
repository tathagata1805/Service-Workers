// COMPLETE CACHING IMPLEMENTATION WITH FETCCHING, ADDING, CLONING AND DELETING CACHE AND HANDLING CACHE STORAGE IN BROWSER ALONG WITH REGISTERING, ACTIVATING AND CONDITIONALLY HANDLING THE RESPONSES USING PROMISES, OBJECTS AND ERROR HANDLING

const APP = {
    SW: null,
    cacheName: "assetCache1",
    init() {
      //called after DOMContentLoaded
      if ("serviceWorker" in navigator) {
        // 1. Register a service worker hosted at the root of the
        // site using the default scope.
        navigator.serviceWorker
          .register("/sw.js", {
            scope: "/",
          })
          .then((registration) => {
            APP.SW =
              registration.installing ||
              registration.waiting ||
              registration.active;
            console.log("Service Worker Registered");
          });
        // 2. See if the page is currently has a service worker.
        if (navigator.serviceWorker.controller) {
          console.log("We have a Service Worker installed");
        }
  
        // 3. Register a handler to detect when a new or
        // updated service worker is installed & activate.
        navigator.serviceWorker.oncontrollerchange = (ev) => {
          console.log("New service worker activated");
        };
  
        // 4. remove/unregister service workers
        navigator.serviceWorker.getRegistrations().then((regs) => {
          for (let reg of regs) {
            reg.unregister().then((isUnreg) => console.log(isUnreg));
          }
        });
        // 5. Listen for messages from the service worker
      } else {
        console.log("Service workers are not supported.");
      }
  
      APP.startCaching();
  
      document
        .querySelector("header>h2")
        .addEventListener("click", APP.deleteCache);
    },
    startCaching() {
      //open a cache and save some responses
      return caches
        .open(APP.cacheName)
        .then((cache) => {
          console.log(`Cache ${APP.cacheName} opened`);
  
          let urlString = "/img/ava-01.png?id=one";
          cache.add(urlString); //add = fetch + put
  
          let url = new URL("http://127.0.0.1:5500/img/ava-01.png?id=two");
          cache.add(url);
  
          let req = new Request("/img/ava-01.png?id=three");
          cache.add(req);
  
          cache.keys().then((keys) => {
            keys.forEach((key, index) => {
              // console.log(index, key);
            });
          });
          return cache;
        })
        .then((cache) => {
          //check if a cache exists
          caches.has(APP.cacheName).then((hasCache) => {
            console.log(`${APP.cacheName} ${hasCache}`);
          });
  
          //search for files in caches
          // cache.match() cache.matchAll()
          // caches.match() - look in all caches
          let urlString = "/img/ava-01.png";
          return caches.match(urlString).then((cacheResponse) => {
            if (
              cacheResponse &&
              cacheResponse.status < 400 &&
              cacheResponse.headers.has("content-type") &&
              cacheResponse.headers.get("content-type").match(/^image\//i)
            ) {
              //not an error if not found
              console.log("Found in the cache");
              // console.log(cacheResponse);
              return cacheResponse;
            } else {
              //no match found
              console.log("Not in cache");
              return fetch(urlString).then((fetchResponse) => {
                if (!fetchResponse.ok) throw fetchResponse.statusText;
                //we have a valid fetch
                cache.put(urlString, fetchResponse.clone());
                return fetchResponse;
              });
            }
          });
        })
        .then((response) => {
          console.log(response);
          document.querySelector("output").textContent = response.url;
          return response.blob();
        })
        .then((blob) => {
          let url = URL.createObjectURL(blob);
          let img = document.createElement("img");
          img.src = url;
          document.querySelector("output").append(img);
        });
    },
    //open a cache and save some responses
    deleteCache() {
      //click the h2 to delete our cache OR something in a cache
      //delete a response from the cache
      caches.open(APP.cacheName).then((cache) => {
        let url = "/img/ava-01.png?id=one";
        cache.delete(url).then((isGone) => {
          console.log(isGone);
        });
      });
      // delete an entire cache
      caches.delete(APP.cacheName).then((isGone) => {
        console.log(isGone);
      });
    },
  };
  
  document.addEventListener("DOMContentLoaded", APP.init);
  