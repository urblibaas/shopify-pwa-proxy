// File: app/routes/pwa.icon.js
//
// Dynamically generates PWA icons based on the current theme.
// Called as: /pwa/icon?theme=dark|light&size=192|512
//
// Returns an SVG icon that works in Chrome/Edge/Android manifests.
// For iOS (apple-touch-icon) you'll want a PNG — see notes at the bottom.

export async function loader({ request }) {
  const url = new URL(request.url);
  const theme = url.searchParams.get("theme") || "light";
  const size = parseInt(url.searchParams.get("size") || "192", 10);
  const isDark = theme === "dark";

  // ── Theme-aware color palette ──────────────────────────────────
  const palettes = {
    light: {
      bg: "#ffffff",
      accent: "#431122",   // burgundy — matches theme_color
      text: "#431122",
      ring: "#431122",
    },
    dark: {
      bg: "#080808",       // near-black — matches dark_bg setting
      accent: "#441122",   // dark burgundy accent
      text: "#f0f0f0",
      ring: "#441122",
    },
  };

  const p = palettes[isDark ? "dark" : "light"];

  // ── Build SVG icon ─────────────────────────────────────────────
  // A clean, modern icon: rounded square with "U" letterform
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${p.bg}"/>
      <stop offset="100%" style="stop-color:${p.bg}"/>
    </linearGradient>
  </defs>
  <!-- Background rounded square -->
  <rect width="512" height="512" rx="128" fill="${p.bg}"/>
  <!-- Subtle inner ring -->
  <rect x="24" y="24" width="464" height="464" rx="112" fill="none" stroke="${p.ring}" stroke-width="8" opacity="0.3"/>
  <!-- "U" letterform -->
  <text x="256" y="340" font-family="system-ui,-apple-system,sans-serif" font-size="280" font-weight="700"
        fill="${p.text}" text-anchor="middle" letter-spacing="-8">U</text>
  <!-- Small dot accent -->
  <circle cx="380" cy="180" r="20" fill="${p.accent}" opacity="0.8"/>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=300",
    },
  });
}
