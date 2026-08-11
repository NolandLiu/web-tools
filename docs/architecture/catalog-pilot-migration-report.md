# Catalog Existing Tools Migration Report

## Status

- Status: Phase 2 existing tools migration
- Date: 2026-08-11
- Program tasks: `TOOLS-P2-001` through `TOOLS-P2-012`
- Implementation tasks: `TASK-118` through `TASK-129`

## Authority Boundary

Catalog now owns the published tool resource projection used by public route,
SEO, search, homepage, category, and FAQ consumers. Code-owned bindings still
own runtime identity, component selection, algorithms, unit definitions, and
privacy behavior. The legacy registry remains as a compatibility input for
code-specific fields and rollback, but public metadata consumers read through
the Catalog facade.

## Published Resources

The normalized artifact contains 27 published tool resources, 5 categories, 87
locale records, and independent FAQ records for every published tool. Public
tool bindings are still resolved through the code-owned `toolBindingId`
registry; Catalog data cannot choose a dynamic import path or execute a
component.

Hidden IP fixtures remain retained but unpublished:

| Catalog binding | Public projection | Notes |
| --- | --- | --- |
| `ip-info` | none | Retained implementation capability; no public route, Sitemap, category card, or search entry |
| `ip-rdap` | none | Retained implementation capability; no public route, Sitemap, category card, or search entry |

## Migrated Consumers

- Tool and category routes use the Catalog-backed published tool/category view.
- SEO and static HTML metadata use the Catalog-backed localized tool projection.
- Search aliases and keywords come from Catalog locale records.
- Visible FAQ content and FAQPage JSON-LD are projected from independent Catalog FAQ records.
- Homepage cards, sidebar, category pages, tool feedback, and static content consume the Catalog facade.

No user tool input, generated result, password, financial cash flow, queried IP,
QR content, logo file, or private payload is added to Catalog records,
normalized artifacts, diagnostics, analytics, or logs.

## Rollback

Rollback is limited to restoring the previous Catalog artifact and reverting the
Catalog facade consumer commit. Runtime tools and algorithms remain unchanged,
so rollback does not require deleting or editing tool implementations.
