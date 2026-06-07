// File: app/routes/pwa.manifest.js
import { json } from "@react-router/node";

export async function loader() {
  const manifestData = {
    name: "Urb Lihaas Premium Store",
    short_name: "Urb Lihaas",
    description: "Modern Apparel and Streetwear",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "https://shopify-pwa-proxy.vercel.app", // Replace with actual icon URL
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "https://shopify-pwa-proxy.vercel.app",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return json(manifestData, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
