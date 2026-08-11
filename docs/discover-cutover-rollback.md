# Discover apex cutover and rollback plan

This document is a preparation checklist only. Do not deploy, change DNS, merge,
or switch Cloudflare production configuration from this task.

## Preconditions

- `godeskhub.com` Discover build passes `npm run discover:build` and `npm run discover:verify`.
- `tools.godeskhub.com` remains the production tools frontend.
- Cloudflare Pages project settings, DNS records, cache rules, redirects, and
  custom domains are reviewed by the site owner before any change.

## Cutover checklist

1. Confirm the Discover deployment artifact contains localized static HTML,
   canonical metadata, hreflang, and JSON-LD.
2. Confirm hidden or draft Catalog resources are absent from public pages.
3. Confirm `tools.godeskhub.com` tool routes, Sitemap, and analytics behavior are
   unchanged.
4. In Cloudflare Pages, attach or switch the apex domain only after explicit
   deployment approval.
5. Purge cache for `godeskhub.com` after the approved deployment.
6. Verify homepage, category pages, resource pages, footer policy links, and
   mobile navigation from production.

## Rollback

1. Revert the apex custom domain to the previous Pages deployment or previous
   site target.
2. Restore previous redirect and cache settings if changed during cutover.
3. Purge Cloudflare cache for `godeskhub.com`.
4. Verify `tools.godeskhub.com` still serves the tools frontend.

## Notes

- No Cloudflare Pages deployment is performed by this document.
- No DNS, Secret, KV, D1, R2, Worker route, or production analytics setting is
  changed here.
