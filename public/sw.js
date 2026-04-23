/**
 * Minimal PWA service worker — lifecycle only.
 * No `fetch` handler: the browser handles all requests natively, which avoids rare
 * “tab keeps loading” cases where a pass-through SW + slow networks interact badly.
 */
self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
