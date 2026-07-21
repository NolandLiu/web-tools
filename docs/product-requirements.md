# Lite Tools Product Requirements

Lite Tools is a privacy-first multilingual collection of browser-side utilities for Cloudflare Pages. The MVP must work without login, keep calculator/converter/text/QR input local, and avoid AdSense or third-party tracking unless explicitly approved.

## MVP Scope

- Unit converters: length, weight, temperature, area, volume, speed, time, storage.
- Developer tools: JSON, Base64, URL, UUID, timestamp, text case, text stats, color conversion.
- Calculators: percentage, discount, BMI, compound interest, date interval.
- QR Code generator with local PNG download.
- Pages: home, about, privacy, terms, contact, and SPA 404 fallback.
- Languages: English, Simplified Chinese, Traditional Chinese.

## Acceptance

- `npm ci`, `npm run lint`, `npm run test`, `npm run build`, `npm run verify`, and `npm audit` pass.
- Build output is `dist` and production HTML references built `/assets/*`, not `/src/main.tsx`.
- Private task briefs are ignored and never committed.
