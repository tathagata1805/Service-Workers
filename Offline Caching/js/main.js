//  MAKE SURE THAT SERVICE WORKERS ARE SUPPORTED

if('serviceWorker' in navigator) {
    console.log("Service Worker enabled")
    // REGISTERING SERVICE WORKER
    window.addEventListener('load', () => {
        navigator.serviceWorker
        .register("../sw_cached_site.js")
        .then(reg => console.log("Service Worker: Registered"))
        .catch(err => console.log(`Service Worker Error: ${err}`));
    })
}