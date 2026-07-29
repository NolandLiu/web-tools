# Cloudflare Pages Deep-Link Checklist

The build creates a language-directory `index.html` for each localized home and
a matching `.html` file for every non-home canonical route, plus a top-level
`404.html`, generated `_redirects`, and a generated `sitemap.xml`. Cloudflare
Pages serves these files at extensionless URLs and uses the top-level
`404.html` when no file matches. Using `path.html` instead of
`path/index.html` for non-home routes avoids Cloudflare's automatic trailing
slash redirect. See the official
[Serving Pages documentation](https://developers.cloudflare.com/pages/configuration/serving-pages/)
and
[Pages redirects documentation](https://developers.cloudflare.com/pages/configuration/redirects/).

## Pages project settings

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`
- Do not add a Pages Function that captures these static routes. Cloudflare
  documents that `_redirects` rules do not apply to requests served by Pages
  Functions.

## Preview deployment checks

Run these checks against the preview hostname before promoting a deployment:

1. Confirm status `200` and `Content-Type: text/html` for:
   - `/en/tools/length-converter`
   - `/zh-cn/tools/json-tools`
   - `/zh-tw/tools/qr-code-generator`
   - `/en/categories/unit-converters`
   - `/zh-cn/categories/developer-tools`
   - `/zh-tw/privacy`
2. Fetch each response without executing JavaScript. Confirm its title,
   description, canonical, `html lang`, Open Graph URL, four hreflang links,
   and JSON-LD match the requested route.
3. Confirm `/`, `/about`, `/tools/json-tools`, and
   `/categories/developer-tools` return `301` with an English canonical
   destination.
4. Confirm a random unknown path returns HTTP `404` and the custom not-found
   page, not the homepage.
5. Confirm a built `/assets/*.js` and `/assets/*.css` URL returns `200` and is
   not rewritten to HTML.
6. Fetch `/sitemap.xml`; confirm every listed URL returns `200` directly with
   no redirect.
7. In a browser, repeat tool open, refresh, new-tab direct access, Back,
   Forward, language switch, search, and mobile drawer checks.

## Apex-domain redirect check

The repository cannot configure a redirect from `godeskhub.com` to the Pages
custom hostname because Pages `_redirects` does not support domain-level
redirects. If the existing zone rule is absent or does not preserve paths,
create or update a Cloudflare Single Redirect in the `godeskhub.com` zone:

1. Open **Rules → Overview → Create rule → Redirect Rule**.
2. Rule name: `Redirect apex to GoDeskHub tools`.
3. Select **Wildcard pattern**.
4. Request URL: `http*://godeskhub.com/*`.
5. Target URL: `https://tools.godeskhub.com/${2}`.
6. Status: `301`.
7. Enable **Preserve query string**.
8. Save as Draft for review; deploy only after project-owner approval.
9. Confirm the apex DNS record is proxied by Cloudflare, which is required for
   Single Redirects.
10. Verify:
    - `http://godeskhub.com/` → `https://tools.godeskhub.com/`
    - `https://godeskhub.com/zh-cn/tools/json-tools?source=test` →
      `https://tools.godeskhub.com/zh-cn/tools/json-tools?source=test`
    - no redirect loop occurs on `tools.godeskhub.com`.

The wildcard syntax follows Cloudflare's current
[different-hostname redirect example](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-all-different-hostname/)
and
[dashboard rule instructions](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/).
