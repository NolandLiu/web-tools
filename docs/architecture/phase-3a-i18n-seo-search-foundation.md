# Phase 3A I18N, SEO, and Search Foundation

## Status

- Date: 2026-08-11
- Program scope: `I18N-P3-001`, `I18N-P3-002`, `SEARCH-P3-001`, `SEARCH-P3-002`, `SEO-P3-001`, and `SEO-P3-002`
- Implementation tasks: `TASK-130` through `TASK-136`

## Locale Contract

The shared locale contract uses BCP 47 IDs `en`, `zh-CN`, and `zh-TW`.
Route segments remain `en`, `zh-cn`, and `zh-tw`. English is the default
locale and `x-default` points to the English canonical route.

Published public resources must have complete localized records for all three
supported locales. Phase 3A does not allow silent mixed-language fallback for
published resources. Draft, review, hidden, and deprecated resources do not
enter public routes unless a later task defines a reviewed preview or migration
policy.

## Canonical and Indexing Policy

Tools pages remain canonical on `https://tools.godeskhub.com`. The future
Discover frontend should link to Tools canonical pages for owned tools unless a
separate approved task creates distinct, non-duplicate Discover detail pages.

The frontend origin is configuration-owned, not authored Catalog content. Hidden
and deprecated resources are excluded from public routes, Sitemap, and search
index output by default. Deprecated resources require a resource-specific
migration task before any redirect, `410`, or indexed notice page is published.

## Search Index Contract

The unified search document schema supports `tool`, `website`, and `guide`
resource types. Phase 3A builds a deterministic static local index from the
normalized Catalog artifact. The Tools frontend still displays tool results
only until Discover routes exist for websites and guides.

Search remains browser-local. Raw queries, normalized query tokens, no-result
queries, tool inputs, generated outputs, health evidence, and secret-like fields
must not leave the browser or enter generated public artifacts.

The initial compressed search-index budget is 50 KB. Exceeding that budget fails
the build gate and requires an explicit review before increasing the limit.

## Verification

`npm run catalog:build` now regenerates both:

- `catalog/artifacts/catalog.normalized.v1.json`
- `catalog/artifacts/search-index.v1.json`

The generated module variants are committed for browser-compatible static
imports. Verification must continue through `npm run verify`, which runs
Catalog validation, artifact generation, tests, build, and static artifact
checks.
