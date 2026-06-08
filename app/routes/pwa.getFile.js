// File: app/routes/pwa.getFile.js

// This route is public — the browser registers the SW without a Shopify session
export const unauthenticated = true;

export async function loader() {
  const serviceWorkerCode = `
    // ── PWA Service Worker for Urb Lihaas ──────────────────────────
    const CACHE_NAME = 'urb-lihaas-shell-v2';

    // ── Pre-cache the app shell on install ─────────────────────────
    self.addEventListener('install', (event) => {
      console.log('[PWA SW] Install — pre-caching app shell');
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          // Pre-cache the root page so PWA launch is instant (no splash delay)
          return cache.add('/').catch((err) => {
            console.warn('[PWA SW] Pre-cache / failed (offline?):', err.message);
          });
        })
      );
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      console.log('[PWA SW] Activated — claiming all clients');
      // Purge old caches
      event.waitUntil(
        caches.keys().then((keys) => {
          return Promise.all(
            keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
          );
        })
      );
      event.waitUntil(self.clients.claim());
    });

    // ── Cache-first for navigation, network-first for everything else ──
    self.addEventListener('fetch', (event) => {
      const { request } = event;
      const url = new URL(request.url);

      // Only handle same-origin GET requests
      if (request.method !== 'GET' || url.origin !== self.location.origin) return;

      // Navigation requests (PWA launch): cache-first for instant load
      if (request.mode === 'navigate') {
        event.respondWith(
          caches.open(CACHE_NAME).then((cache) => {
            return cache.match(request).then((cached) => {
              // Return cached page immediately, then update cache in background
              const fetchPromise = fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  cache.put(request, networkResponse.clone());
                }
                return networkResponse;
              }).catch(() => {
                // Offline — cached version already returned above
              });
              return cached || fetchPromise;
            });
          })
        );
        return;
      }

      // Static assets: stale-while-revalidate
      if (
        request.destination === 'style' ||
        request.destination === 'script' ||
        request.destination === 'image' ||
        request.destination === 'font'
      ) {
        event.respondWith(
          caches.open(CACHE_NAME).then((cache) => {
            return cache.match(request).then((cached) => {
              const fetchPromise = fetch(request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                  cache.put(request, networkResponse.clone());
                }
                return networkResponse;
              });
              return cached || fetchPromise;
            });
          })
        );
      }
    });
  `;

  return new Response(serviceWorkerCode, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      // Allows the SW to control paths outside its own directory.
      // This SW is served from /apps/pwa-proxy-1/pwa/getFile on the storefront
      // but needs to control the storefront root /.
      "Service-Worker-Allowed": "/",
    },
  });
}
