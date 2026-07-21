# Lite Tools Product Requirements

Lite Tools is a privacy-first multilingual collection of browser-side utilities for Cloudflare Pages. The MVP must work without login, keep calculator/converter/text/QR input local, and avoid AdSense or third-party tracking unless explicitly approved.

## MVP Scope

- Unit converters: length, weight, temperature, area, volume, speed, time, storage.
- Developer tools: JSON, Base64, URL, UUID, timestamp, text case, text stats, color conversion.
- Calculators: percentage, discount, BMI, compound interest, date interval.
- QR Code generator with local PNG download.
- Pages: home, about, privacy, terms, contact, and SPA 404 fallback.
- Languages: English, Simplified Chinese, Traditional Chinese.
- Navigation: a persistent category/tool tree on desktop and an accessible drawer on smaller screens.
- Tool workspace: breadcrumb, clear title and description, named input/output regions, contextual help, and related tools.
- Reversible tools: a keyboard-accessible swap action that preserves or promotes a valid result.
- Results: every textual or numeric output has a consistent quick-copy action and visible feedback.
- Visual system: balanced English/Chinese typography, consistent icon sizes, `44px` minimum interactive targets, and responsive spacing.

## Acceptance

- `npm ci`, `npm run lint`, `npm run test`, `npm run build`, `npm run verify`, and `npm audit` pass.
- Build output is `dist` and production HTML references built `/assets/*`, not `/src/main.tsx`.
- Private task briefs are ignored and never committed.
- All visible inputs and outputs have names; contextual help is discoverable without permanently adding visual noise.
- Copy actions are disabled for empty or invalid output and announce completion to assistive technology.
- Navigation and core tool workflows remain usable by keyboard at mobile and desktop breakpoints.
