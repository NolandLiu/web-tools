# GoDeskHub Repository Architecture Baseline

## Status and scope

- Status: Frozen architecture baseline
- Evidence date: 2026-08-11
- Source commit: `main@21c3eb8dab2205b5ea78ea7b53bf0fbd76bb81ee`
- Owner task: `ARCH-P0-001`

This document records the current Tools repository before Catalog migration.
It does not describe a production deployment guarantee, implement a migration,
or resolve the gaps it records.

## Authority and state boundaries

Evidence is interpreted in this order:

1. source, registries, lockfile, and configuration at the source commit;
2. deterministic build output and verification commands from that commit;
3. repository CI and Cloudflare configuration;
4. read-only observation of preview or production environments;
5. explanatory prose such as README and roadmap documents.

The source commit, local `main`, and the locally cached `origin/main` reference
resolved to the same SHA when this baseline was captured. The planning branch
`docs/TASK-095-platform-architecture-planning` adds architecture documentation
only; its tracked product-code diff from `main` was empty at capture time.

Production and Cloudflare Dashboard observations are external evidence rather
than repository authority. A difference is recorded as deployment drift and
does not silently redefine this baseline.

## Repository and runtime

| Item | Baseline evidence |
| --- | --- |
| Repository | `NolandLiu/web-tools` |
| Application | Root React + TypeScript + Vite application |
| Node | `v22.23.1`; package contract `>=22.13.0 <23` |
| npm | `10.9.8`; dependency graph locked by `package-lock.json` |
| React | `19.2.6` |
| TypeScript | `5.9.3` |
| Vite | `8.1.5` |
| Build output | `dist` |
| Private work tracking | `tasks/` is ignored and has no tracked files |

The runtime and dependency versions come from `node --version`, `npm --version`,
`package.json`, and the lockfile. No environment file, token, user data, or
production request payload is part of this baseline.

## Published registry and routes

The executable registry and `listCanonicalRoutes()` reported:

| Entity | Count |
| --- | ---: |
| Public tools | 27 |
| Categories | 5 |
| Locales | 3 |
| Information pages | 4 |
| Canonical static routes | 111 |

The route total is `3 × (1 home + 27 tools + 5 categories + 4 information
pages)`. Canonical URLs, hreflang, Open Graph, JSON-LD, Sitemap, legacy
redirects, and the custom 404 are generated from repository registries. Fixed
counts in prose are snapshots, not the normative route contract.

## Current ownership map

| Concern | Authority at the baseline |
| --- | --- |
| Tools, categories, locales, slugs, and basic metadata | `src/registry.js` |
| Compatibility tool/category views | `src/catalog.ts` |
| Long-form tool content and embedded FAQ | `src/content/*` |
| Category content | `src/content/category-content.js` |
| Tool behavior contracts | `src/lib/tool-contracts.js` |
| Route parsing and enumeration | `src/lib/routes.js` |
| SEO and JSON-LD | `src/lib/seo.js` |
| Search | `src/lib/search.js` |
| Static visible HTML | `src/lib/static-content.js` |
| Build-time route generation | `scripts/generate-static-pages.mjs` |
| Static artifact verification | `scripts/verify-build.mjs` |
| Executable tool behavior | `src/tools/*` and shared `src/lib/*` functions |

There is no CMS-neutral Catalog package, Git/YAML Catalog, Discover application,
Payload application, or PostgreSQL dependency at this baseline.

## Build, CI, and Cloudflare

`package.json` defines:

- `npm run lint` → ESLint;
- `npm run test` → Node built-in test runner;
- `npm run typecheck` → TypeScript project build;
- `npm run build` → typecheck, Vite build, and static-page generation;
- `npm run verify` → lint, tests, build, and static artifact verification.

GitHub Actions runs `npm ci`, lint, test, and build for `main` pushes and pull
requests. Because the workflow does not call `npm run verify` or
`npm run verify:build` directly, generated-artifact verification is a recorded
CI gap rather than an assumed hosted check.

Cloudflare configuration at the baseline is:

| Item | Value |
| --- | --- |
| Pages project name | `web-tools-nl1` |
| Output directory | `dist` |
| Compatibility date | `2026-07-17` |
| Repository bindings | None |
| Published Functions include rule | `/__disabled-functions-placeholder` only |

IP Lookup and RDAP Function source files remain in the repository, but their
API paths are absent from `_routes.json` and their public tools are absent from
the registry, search, static pages, and Sitemap. They are retained unpublished
source, not a current public capability.

## Privacy and analytics state

Published tool calculations and user content remain browser-local. Tool inputs
and outputs are excluded from URL state, feedback, metadata, JSON-LD, storage,
and analytics by existing contracts and tests.

The HTML template currently loads the standard Google tag without the consent
gate defined by ADR-024. The approved target is a fail-closed adapter that sends
only a canonical, query-free page view after affirmative consent. That adapter
is not implemented in this baseline, and no additional analytics event is
authorized by this document.

## Verification snapshot

On 2026-08-11 the approved baseline verification reported:

| Command | Result |
| --- | --- |
| `npm ci` | Exit 0 |
| `npm run lint` | Exit 0 |
| `npm run test` | Exit 0; 159 passed, 0 failed, 0 skipped |
| `npm run build` | Exit 0; 111 canonical static pages generated |
| `npm run verify` | Exit 0; 111 routes, metadata, Sitemap, deep links, redirects, and assets verified |

The count script imported `src/registry.js` and `src/lib/routes.js`; it did not
copy counts from prose. Verification was performed without production user
data.

## Recorded gaps

1. Current metadata and content ownership is distributed across several
   tool-site modules rather than one CMS-neutral Catalog.
2. Website and guide Resources, Tags, Collections, explicit Relations, health,
   and publication lifecycle records do not exist in the current registry.
3. Search covers tools only, and FAQ remains embedded in localized tool content.
4. The unconditional Google tag has not migrated to the ADR-024 consent model.
5. Hosted CI does not run the full static artifact verifier.
6. This repository baseline does not prove current production DNS, redirects,
   response headers, or Cloudflare Dashboard state.

These gaps require their own approved tasks. They must not be repaired silently
while using this document as a comparison source.

## Change and rollback rule

Future migration evidence compares against this commit and its deterministic
outputs. A later baseline requires a new approved task and a new dated evidence
record; it does not rewrite this snapshot without preserving Git history.

This documentation-only baseline can be rolled back by reverting its planning
documents. Rollback does not alter application code, Cloudflare configuration,
or production state.
