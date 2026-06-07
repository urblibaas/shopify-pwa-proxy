// File: app/routes/pwa.manifest.js
import { json } from "@react-router/node";

/**
 * Dynamic PWA Manifest — theme-aware
 *
 * The manifest link in theme.liquid should include ?theme=dark or ?theme=light
 * e.g. /apps/pwa-proxy-1/pwa/manifest?theme=dark
 *
 * If no theme param is provided, we default to light.
 */
export async function loader({ request }) {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme") || "light";
  const isDark = theme === "dark";

  // ── Theme-aware colors ──────────────────────────────────────────
  // Light mode (matches Shopify theme defaults)
  const lightColors = {
    theme_color: "#431122",       // burgundy accent — status bar on Android
    background_color: "#ffffff",  // splash screen bg
  };
  // Dark mode (matches settings_data.json: dark_bg #080808, dark_accent #441122)
  const darkColors = {
    theme_color: "#080808",       // near-black status bar
    background_color: "#080808",  // dark splash screen bg
  };

  const colors = isDark ? darkColors : lightColors;

  // ── Theme-aware icons ───────────────────────────────────────────
  // Icons are served by /pwa/icon?theme=dark|light&size=192|512
  const iconBase = "https://shopify-pwa-proxy.vercel.app/apps/pwa-proxy-1/pwa/icon";

  const manifestData = {
    name: "Urb Lihaas Premium Store",
    short_name: "Urb Lihaas",
    description: "Modern Apparel and Streetwear",
    start_url: "/",
    display: "fullscreen",
    background_color: colors.background_color,
    theme_color: colors.theme_color,
    icons: [
      {
        src: `${iconBase}?theme=${theme}&size=192`,
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: `${iconBase}?theme=${theme}&size=512`,
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };

  return json(manifestData, {
    headers: {
      "Content-Type": "application/manifest+json",
      // Short cache so theme switches are picked up quickly
      "Cache-Control": "public, max-age=300",
    },
  });
}
