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

  // ── Icons ──────────────────────────────────────────────────────
  // Use uploaded JPG/PNG icons from theme settings if provided,
  // otherwise fall back to the dynamic SVG icon generator.
  const customIconLight = url.searchParams.get("icon_light");
  const customIconDark = url.searchParams.get("icon_dark");
  const customIcon = isDark
    ? customIconDark || customIconLight
    : customIconLight || customIconDark;
  const svgIconBase = "https://shopify-pwa-proxy.vercel.app/pwa/icon";

  const iconSrc = customIcon
    ? customIcon // Use the merchant's uploaded JPG/PNG icon
    : `${svgIconBase}?theme=${theme}&size=512`;
  const iconType = customIcon
    ? "image/jpeg" // Shopify CDN returns JPEG/PNG based on source
    : "image/svg+xml";

  const manifestData = {
    name: "Urb Libaas",
    short_name: "Urb Libaas",
    description: "Modern Apparel and Streetwear",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: colors.background_color,
    theme_color: colors.theme_color,
    icons: [
      {
        src: iconSrc,
        sizes: "512x512",
        type: iconType,
        purpose: "any maskable",
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
