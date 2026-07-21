# Architecture

The project is a static React + TypeScript SPA built with Vite for Cloudflare Pages.

## Key Modules

- `src/App.tsx`: application shell, language state, navigation, tool registry, tool UI, policy pages, and QR Code integration.
- `src/lib/core.js`: shared pure functions for conversions, JSON, Base64, URL, timestamps, calculators, colors, QR validation, and local popular-tool ranking.
- `tests/*.test.mjs`: Node test runner coverage for pure logic and product shell checks.
- `public/_redirects`: Cloudflare Pages SPA fallback.
- `public/robots.txt`, `public/sitemap.xml`, `public/manifest.webmanifest`: SEO and install metadata.

Tool logic is kept outside JSX where practical so tests can import it directly. Local popularity stats are versioned in `localStorage` and treated as replaceable adapter logic for future analytics.
