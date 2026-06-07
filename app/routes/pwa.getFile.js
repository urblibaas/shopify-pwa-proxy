// File: app/routes/pwa.getFile.js

export async function loader() {
  // 1. Define your core Progressive Web App script text
  const serviceWorkerCode = `
    self.addEventListener('install', (event) => {
      console.log('PWA Service Worker running natively from the live Vercel Backend!');
      self.skipWaiting();
    });

    self.addEventListener('activate', (event) => {
      console.log('PWA Service Worker activated successfully!');
    });

    self.addEventListener('fetch', (event) => {
      // Custom PWA storefront offline page or caching schemas go here
    });
  `;

  // 2. Transmit the script file along with global scope override safety permissions
  return new Response(serviceWorkerCode, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
      // CRITICAL: Overrides browser directory constraints so the app controls the root store domain
      "Service-Worker-Allowed": "/",
    },
  });
}
