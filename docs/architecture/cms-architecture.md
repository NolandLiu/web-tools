# CMS Architecture

## Status

Target architecture. Payload and PostgreSQL are not installed or deployed by this planning task.

## Role of the CMS

The CMS is an editor for the GoDeskHub Catalog. It manages resource metadata, localization, taxonomy, collections, FAQ, relations, SEO, publication workflow, and operational content health. It cannot create, edit, or deploy executable tool code.

## Runtime boundary

The future CMS runs independently from the Cloudflare Pages frontends and is expected at `admin.godeskhub.com`. The preferred PoC stack is Payload + PostgreSQL; Directus remains a fallback only if the Payload PoC fails its operator or platform criteria.

## PoC gate

Phase 5 validates the domain mapping, localization, workflow, RBAC, migrations, preview, and an operator journey using a small synthetic dataset. Phase 6 production migration cannot begin until the PoC has a documented Go decision.

## Publication flow

```text
Editor change
  → private working revision
  → schema, locale, relation, SEO, privacy, and projection validation
  → draft / review workflow with complete three-locale publication gate
  → reviewer approval
  → published Catalog snapshot or read API
  → static frontend build / cache refresh
```

The last approved published revision remains public while a replacement revision is in draft or review. Deprecated content retains its route with a localized notice but leaves Sitemap and primary discovery. Hidden content has no public projection. ResourceHealth creates review signals and cannot automatically publish, deprecate, hide, or delete content.

Schema changes require Git, migration files, review, and CI. Content changes may use the CMS GUI after the domain schema and publication controls are established.

## Source-of-truth transition

Git/YAML is the early authoritative Catalog. A production cutover may temporarily use controlled dual-read comparison, but only one source may authorize publication at a time. After reconciliation and rollback validation, the CMS becomes the Catalog editor and authoritative data source.
