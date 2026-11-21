const CACHE = "lampe-v5";
const FILES = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png",
  "vendor/jspdf.umd.min.js", "vendor/CourierPrime-Regular.ttf", "vendor/CourierPrime-Italic.ttf",
  "vendor/sounds/map.json", "vendor/sounds/samt.wav", "vendor/sounds/creme.wav", "vendor/sounds/thock.wav"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// Netz zuerst (damit Updates ankommen), offline aus dem Cache
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
