# Architecture

GoDeskHub is a static React + TypeScript application built with Vite for
Cloudflare Pages. It uses client-side History navigation while generating real
HTML for every canonical route at build time.

## Key Modules

- `src/App.tsx`: URL-driven route state, tool directory, policy pages, metadata synchronization, and top-level navigation actions.
- `src/registry.js`: canonical origin, languages, stable slugs, categories, tools, and localized SEO copy.
- `src/content/*`: locale-split tool guidance and category content, keyed by the same stable registry IDs.
- `src/catalog.ts`: compatibility views derived from the canonical registry for existing tool components.
- `src/lib/routes.js`: route parsing, building, language switching, and canonical route enumeration.
- `src/lib/content.js`: build-time validation for multilingual content coverage, FAQs, references, and placeholders.
- `src/lib/seo.js`: per-route metadata, hreflang, Open Graph, and a page-specific JSON-LD `@graph`.
- `src/lib/search.js`: dependency-free localized search across names, aliases, keywords, summaries, scenarios, and categories.
- `src/lib/feedback.js`: allowlisted feedback context and encoded user-initiated email links.
- `src/lib/static-content.js`: escaped semantic HTML generated from the shared route and content registries.
- `src/i18n.ts`: shared English, Simplified Chinese, and Traditional Chinese UI and field copy.
- `src/components/AppShell.tsx`: responsive top bar, desktop shell, mobile drawer, and footer.
- `src/components/ToolSidebar.tsx`: category-first tree navigation derived from the central registry.
- `src/components/ToolWorkspace.tsx`: shared breadcrumb, tool header, tool body, help copy, and related tools.
- `src/components/ToolContentSections.tsx`: localized scenarios, steps, examples, limits, FAQs, references, and related tools below the interactive controls.
- `src/components/SearchDialog.tsx`: global local-search dialog with keyboard selection and current-language routes.
- `src/components/ToolFeedback.tsx`: four tool-level feedback categories without tool input or output.
- `src/components/Field.tsx`: accessible visible labels, inline validation, and contextual help popovers.
- `src/components/ResultCard.tsx`: shared output surface with clipboard state and reset support.
- `src/components/SwapButton.tsx`: reusable accessible swap action for reversible tools.
- `src/tools/*`: unit, text/developer, calculator, and QR tool families composed from the shared primitives.
- `src/lib/core.js`: shared pure functions for conversions, JSON, Base64, URL, timestamps, calculators, colors, QR validation, and local popular-tool ranking.
- `src/lib/ui.js`: pure navigation, swap, clipboard-state, and structured-result helpers.
- `tests/*.test.mjs`: Node test runner coverage for pure logic and product shell checks.
- `scripts/generate-static-pages.mjs`: generates 93 static route documents, Sitemap, redirects, and 404.
- `scripts/verify-build.mjs`: validates generated HTML, assets, Sitemap, redirects, and install metadata.
- `public/_redirects`: explicit language-less legacy redirects; there is no catch-all rewrite.
- `public/robots.txt`, `public/manifest.webmanifest`: crawler and install metadata.

Tool logic is kept outside JSX where practical so tests can import it directly. Local popularity stats are versioned in `localStorage` and treated as replaceable adapter logic for future analytics.

Public compliance pages are rendered by `InfoPage` in `src/App.tsx`. They use
the canonical tools subdomain and support email, while preserving the
no-AdSense-script and no-tool-input-analytics constraints.

## Routing and static SEO

English is the deterministic default for language-less legacy redirects. The
canonical paths use `/en/`, `/zh-cn/`, and `/zh-tw/`; tools use stable English
slugs under `/tools/`, and categories use stable slugs under `/categories/`.
Client navigation uses `pushState`, refresh reconstructs state from the URL,
and `popstate` handles Back and Forward.

Vite first produces the shared asset bundle. The static generator validates the
content registry, then copies the built HTML shell to every canonical route and
injects route-specific title, description, canonical, Open Graph, hreflang,
HTML language, visible route content, and one JSON-LD `@graph`. Tool graphs
include `WebApplication`, visible FAQ data, and breadcrumbs; category graphs
include `CollectionPage`, `ItemList`, and breadcrumbs. A top-level `404.html`
disables Cloudflare Pages' implicit SPA
fallback so unknown paths retain real 404 behavior.

React replaces the generated content inside `#root` when JavaScript runs. The
interactive tool stays above the guidance content, while crawlers and
no-JavaScript readers still receive the localized summary, guide, FAQ,
references, related links, and feedback entry in the original response HTML.

## Responsive layout

- `>= 1100px`: persistent `260px` sidebar and content column.
- `768px - 1099px`: navigation becomes a modal drawer over the content.
- `< 768px`: tool input and output sections stack vertically and controls use full-width touch targets where appropriate.

The drawer closes in the user action that changes navigation state instead of using effects to synchronously derive UI state. QR generation ignores stale asynchronous results after an input or option change.

## Accessibility and copy behavior

Field labels stay visible. Help is available through an icon button and remains connected to the field description for assistive technology. Result cards expose copy success or failure through a polite live region. Empty and invalid results disable copying, and structured outputs are serialized into a portable plain-text representation.
