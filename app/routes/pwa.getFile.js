// File: app/routes/pwa.getFile.js

// This route is public — the browser registers the SW without a Shopify session
export const unauthenticated = true;

export async function loader() {
  const serviceWorkerCode = `
    // ── PWA Service Worker for Urb Lihaas ──────────────────────────
    const CACHE_NAME = 'urb-lihaas-v1';

    self.addEventListener('install', (event) => {
      console.log('[PWA SW] Install event — skipping wait');
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      console.log('[PWA SW] Activated — claiming all clients');
      // Take control of all open pages immediately
      event.waitUntil(self.clients.claim());
    });

    self.addEventListener('fetch', (event) => {
      // Pass through all requests by default (no caching yet).
      // The browser handles the request normally when we don't call
      // event.respondWith().
      //
      // To add offline support later, add a respondWith() that checks
      // the cache first and falls back to network.
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
