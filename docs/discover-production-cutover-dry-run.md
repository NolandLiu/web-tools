# Discover production cutover dry run

Dry run only. Do not deploy. Do not change DNS. Do not modify Cloudflare
Dashboard settings during this task.

## Scope

This document prepares a future cutover of `godeskhub.com` to the Discover app.
The current task only verifies the plan and rollback path.

## Preflight

- Confirm the worktree is on the approved Discover release branch.
- Confirm `npm run lint`, `npm run test`, `npm run build`, `npm run verify`,
  `npm run discover:build`, and `npm run discover:verify` pass.
- Confirm `dist-discover/` contains localized home, browse, resource, category,
  tag, info, 404, and `sitemap.xml` output.
- Confirm `tools.godeskhub.com` remains the canonical owner for tool execution.
- Confirm hidden and draft resources do not appear in Discover routes, search,
  Sitemap, or static HTML.

## Cloudflare Pages dry-run checks

- Review the Cloudflare Pages project that will host Discover.
- Confirm the intended build command and output directory are documented before
  making any setting change.
- Confirm no KV, D1, R2, Worker secret, analytics event, or server-side search
  dependency is required for Discover.

## Cutover stop conditions

- Stop if any verification command fails.
- Stop if `dist-discover/sitemap.xml` contains the wrong canonical origin.
- Stop if Collections appear in public Discover routes.
- Stop if hidden, draft, private task, or user-input content appears in static
  output.
- Stop if rollback ownership or DNS control is unclear.

## Future execution outline

The future approved cutover task should:

1. Build the exact release commit.
2. Upload the Discover output to the approved Cloudflare Pages project.
3. Change DNS or Pages custom-domain binding only after explicit approval.
4. Verify `https://godeskhub.com/en/`, `/zh-cn/`, `/zh-tw/`, `sitemap.xml`,
   canonical links, hreflang links, and selected resource pages.
5. Verify `https://tools.godeskhub.com/` still serves the Tools app.

## Rollback

- Restore the previous Cloudflare Pages deployment or DNS binding.
- Recheck `godeskhub.com` and `tools.godeskhub.com`.
- Keep the failed release commit available for postmortem.

This dry run does not authorize production deployment.
