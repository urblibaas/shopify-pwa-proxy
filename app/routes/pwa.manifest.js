// File: app/routes/pwa.manifest.js

// This route is public — browsers fetch the manifest without a Shopify session
export const unauthenticated = true;

/**
 * Dynamic PWA Manifest — theme-aware
 *
 * The manifest link in theme.liquid includes ?theme=dark or ?theme=light
 * e.g. /apps/pwa-proxy-1/pwa/manifest?theme=dark
 *
 * If no theme param is provided, we default to light.
 */
export async function loader({ request }) {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme") || "light";
  const isDark = theme === "dark";

  // ── Theme-aware colors ──────────────────────────────────────────
  const lightColors = {
    theme_color: "#431122",
    background_color: "#ffffff",
  };
  const darkColors = {
    theme_color: "#080808",
    background_color: "#080808",
  };
  const colors = isDark ? darkColors : lightColors;

  // ── Icon URLs (dynamic SVG icons from pwa.icon.js) ──────────────
  // Browser fetches these directly from Vercel, so path is /pwa/icon (not /apps/pwa/)
  const iconBase =
    "https://shopify-pwa-proxy.vercel.app/pwa/icon";

  const manifestData = {
    name: "Urb Lihaas Premium Store",
    short_name: "Urb Lihaas",
    description: "Modern Apparel and Streetwear",
    start_url: "/",
    scope: "/",
    display: "standalone", // "standalone" is the modern, well-supported value
    background_color: colors.background_color,
    theme_color: colors.theme_color,
    icons: [
      {
        src: `${iconBase}?theme=${theme}&size=192`,
        sizes: "192x192",
        type: "image/svg+xml", // MUST match the Content-Type returned by pwa.icon.js
        purpose: "any",
      },
      {
        src: `${iconBase}?theme=${theme}&size=512`,
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };

  return new Response(JSON.stringify(manifestData), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=300",
    },
  });
}
