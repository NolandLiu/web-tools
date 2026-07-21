# Architecture

The project is a static React + TypeScript SPA built with Vite for Cloudflare Pages.

## Key Modules

- `src/App.tsx`: language and page state, tool directory, policy pages, and top-level navigation actions.
- `src/catalog.ts`: the typed tool registry, category order, icons, related tools, and localized tool metadata.
- `src/i18n.ts`: shared English, Simplified Chinese, and Traditional Chinese UI and field copy.
- `src/components/AppShell.tsx`: responsive top bar, desktop shell, mobile drawer, and footer.
- `src/components/ToolSidebar.tsx`: category-first tree navigation derived from the central registry.
- `src/components/ToolWorkspace.tsx`: shared breadcrumb, tool header, tool body, help copy, and related tools.
- `src/components/Field.tsx`: accessible visible labels, inline validation, and contextual help popovers.
- `src/components/ResultCard.tsx`: shared output surface with clipboard state and reset support.
- `src/components/SwapButton.tsx`: reusable accessible swap action for reversible tools.
- `src/tools/*`: unit, text/developer, calculator, and QR tool families composed from the shared primitives.
- `src/lib/core.js`: shared pure functions for conversions, JSON, Base64, URL, timestamps, calculators, colors, QR validation, and local popular-tool ranking.
- `src/lib/ui.js`: pure navigation, swap, clipboard-state, and structured-result helpers.
- `tests/*.test.mjs`: Node test runner coverage for pure logic and product shell checks.
- `public/_redirects`: Cloudflare Pages SPA fallback.
- `public/robots.txt`, `public/sitemap.xml`, `public/manifest.webmanifest`: SEO and install metadata.

Tool logic is kept outside JSX where practical so tests can import it directly. Local popularity stats are versioned in `localStorage` and treated as replaceable adapter logic for future analytics.

## Responsive layout

- `>= 1100px`: persistent `260px` sidebar and content column.
- `768px - 1099px`: navigation becomes a modal drawer over the content.
- `< 768px`: tool input and output sections stack vertically and controls use full-width touch targets where appropriate.

The drawer closes in the user action that changes navigation state instead of using effects to synchronously derive UI state. QR generation ignores stale asynchronous results after an input or option change.

## Accessibility and copy behavior

Field labels stay visible. Help is available through an icon button and remains connected to the field description for assistive technology. Result cards expose copy success or failure through a polite live region. Empty and invalid results disable copying, and structured outputs are serialized into a portable plain-text representation.
