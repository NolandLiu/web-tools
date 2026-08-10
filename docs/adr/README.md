# GoDeskHub Architecture Decision Register

All decisions below are Accepted for backlog planning. Implementation details may add subordinate ADRs but must not contradict these decisions without an explicit superseding review.

| ADR | Accepted decision |
| --- | --- |
| ADR-001 | GoDeskHub is one Resource Platform. |
| ADR-002 | Discover and Tools are separate frontends sharing one Catalog. |
| ADR-003 | Resource is the core domain entity. |
| ADR-004 | Category, Tag, and Collection are separate concepts. |
| ADR-005 | Entity identity and localization are separate. |
| ADR-006 | FAQ is an independent content entity. |
| ADR-007 | CMS manages content; program code manages tool behavior. |
| ADR-008 | The early Catalog uses Git/YAML. |
| ADR-009 | Catalog is the single source of truth. |
| ADR-010 | Existing Tools migrate progressively; there is no rewrite. |
| ADR-011 | Payload + PostgreSQL is the preferred long-term CMS; Directus is the fallback. |
| ADR-012 | GoDeskHub domain schemas are CMS-neutral. |
| ADR-013 | Future Admin uses `admin.godeskhub.com`. |
| ADR-014 | Admin security combines Cloudflare Access, CMS authentication, and RBAC. |
| ADR-015 | CMS cannot modify executable tool code. |
| ADR-016 | Public frontends remain Cloudflare Pages-first. |
| ADR-017 | Full-stack CMS uses an independent runtime. |
| ADR-018 | Early infrastructure prioritizes low-cost or free options. |
| ADR-019 | Schema changes require Git, migration, review, and CI. |
| ADR-020 | CMS GUI edits the Catalog; it is not the domain model. |
| [ADR-021](./ADR-021-catalog-repository-package-topology.md) | Catalog begins in this repository as an internal npm workspace package; Tools stays at the root and no package is published initially. |
| [ADR-022](./ADR-022-identifier-slug-locale-task-naming.md) | Catalog entities use readable typed immutable IDs; slugs, locales, bindings, and execution task IDs remain separate governed concepts. |
| [ADR-023](./ADR-023-domain-ownership-publication-lifecycle.md) | Domain identity, revisions, public projection, health, and publication lifecycle are separate; every published entity requires complete three-locale content. |
| [ADR-024](./ADR-024-governed-analytics-consent-privacy.md) | Page views remain approved only through a consent-gated, fail-closed event allowlist; local popularity stays local and sensitive content is never sent. |
| [ADR-025](./ADR-025-documentation-private-board-authority.md) | Public counts are registry-derived or dated snapshots; each private task ID has one authority record and support material lives under ignored task artifacts. |
