// public/sw.js
const CACHE_NAME = 'lightning-mcfilm-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/icon-maskable-512.png',
  '/logo-header.png'
];

// public/sw.js
const CACHE = "mcfilm-v1";

self.addEventListener("install", e => {
  console.log("SW instalado – KA-CHOW!");
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  console.log("SW activado");
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  // Esto es obligatorio para que Chrome lo considere válido
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});