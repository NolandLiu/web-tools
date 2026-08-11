# Catalog Pilot Migration Report

## Status

- Status: Phase 2 compare-only pilot
- Date: 2026-08-11
- Program tasks: `TOOLS-P2-001`, `TOOLS-P2-002`, `TOOLS-P2-003`
- Implementation tasks: `TASK-118`, `TASK-119`, `TASK-120`

## Authority Boundary

The Phase 2 pilot is compare-only. The existing registries remain production-authoritative
for public routes, metadata, Sitemap, search, visible content, and runtime tool
rendering. Catalog output is used to validate code bindings and compare
projected records before any later source-of-truth cutover.

## Pilot Resources

| Catalog binding | Legacy registry ID | Current status | Purpose |
| --- | --- | --- | --- |
| `ipv4-network-toolbox` | `ipv4-network` | published | Network routing, SEO, content, and privacy fixture |
| `irr-calculator` | `irr` | published | Financial calculator metadata and local-processing fixture |
| `password-generator` | `password` | published | Privacy-sensitive generator and local-processing fixture |

Hidden IP fixtures remain retained but unpublished:

| Catalog binding | Public projection | Notes |
| --- | --- | --- |
| `ip-info` | none | Retained implementation capability; no public route or search entry |
| `ip-rdap` | none | Retained implementation capability; no public route or search entry |

## Compared Fields

The compatibility adapter compares pilot Catalog projection against the current
registry for stable tool binding, slug, category, kind, locale name, and locale
summary. Conflicts are reported as deterministic diagnostics and are not merged
silently.

Route, SEO, Sitemap, search, static HTML, and runtime behavior remain covered by
the existing regression suite. No user tool input, generated result, password,
financial cash flow, queried IP, or private payload is added to Catalog records,
normalized artifacts, diagnostics, analytics, or logs.

## Rollback

The rollback path is immediate because production reads still use the existing registries.
If a pilot comparison fails, remove the pilot binding from the adapter allowlist
or restore the previous Catalog artifact; no executable tool code needs to
change.
