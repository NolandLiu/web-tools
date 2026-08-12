# Discover Publication Readiness Checklist

This checklist prepares the Discover application for a future `godeskhub.com` publication review. It does not authorize deployment.

## Scope to verify

- Header exposes Tools, Websites, Guides, and AI Skills.
- Header and footer do not expose Collections as a public top-level destination.
- AI Skills list pages and detail pages exist in English, Simplified Chinese, and Traditional Chinese.
- Tools, Websites, Guides, and AI Skills search results point to canonical Discover or Tools URLs.
- Hidden and draft resources do not appear in public pages, search results, static HTML, metadata, or JSON-LD.

## Local verification

Run these commands before any future publication decision:

```bash
npm run lint
npm run test
npm run build
npm run verify
npm run discover:build
npm run discover:verify
```

## Manual browser checks

- Open `/en/`, `/zh-cn/`, and `/zh-tw/`.
- Open `/en/ai-skills/` and a representative `/en/resources/ai-skill/.../` page.
- Confirm language switching preserves the current page semantics.
- Search for `prompt`, `提示词`, and `隱私` without sending the query to an external service.
- Confirm footer links go only to About, Contact, Privacy, and Terms.

## Privacy checks

- AI Skills are guidance resources only; they do not execute prompts on this site.
- Do not send search query text to analytics.
- Do not include raw user input, private prompts, uploaded files, or generated AI output in metadata, JSON-LD, URLs, logs, or feedback links.

## Deployment boundary

- Do not deploy from this checklist.
- Do not change DNS.
- Do not modify Cloudflare Pages settings.
- Do not switch `godeskhub.com` apex routing.
- Do not merge or publish without a separate approval.

## Rollback concept for a future release

If a future Discover publication causes issues, roll back by restoring the previous Cloudflare Pages deployment or returning apex routing to the last known good target. Validate `tools.godeskhub.com` independently because it remains the owned tools runtime.
