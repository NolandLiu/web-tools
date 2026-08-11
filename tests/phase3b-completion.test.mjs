import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

import catalogArtifact from "../catalog/artifacts/catalog.normalized.v1.mjs";
import { generateSite } from "../scripts/generate-static-pages.mjs";
import { resolveCatalogPageMetadata } from "../src/lib/catalog-seo.js";
import { validateTranslationCompleteness } from "../src/lib/catalog-localization.js";
import { buildCatalogSitemapUrls, resolvePublicationIndexingPolicy } from "../src/lib/catalog-publication.js";
import { searchResources } from "../src/lib/search-ranking.js";
import { searchTools } from "../src/lib/search.js";

const execFileAsync = promisify(execFile);

test("translation completeness reports exact published locale gaps without failing hidden resources", () => {
  const complete = validateTranslationCompleteness(catalogArtifact);
  assert.equal(complete.ok, true);
  assert.deepEqual(complete.diagnostics, []);

  const incomplete = structuredClone(catalogArtifact);
  incomplete.records.locales = incomplete.records.locales.filter(locale => !(
    locale.resourceId === "res_tool_json-tools" && locale.locale === "zh-TW"
  ));
  const result = validateTranslationCompleteness(incomplete);
  assert.equal(result.ok, false);
  assert.deepEqual(result.diagnostics, [{
    code: "missing-published-locale",
    resourceId: "res_tool_json-tools",
    locale: "zh-TW",
    field: "locale",
    severity: "error",
  }]);

  const hiddenOnly = structuredClone(catalogArtifact);
  hiddenOnly.records.locales = hiddenOnly.records.locales.filter(locale => !(
    locale.resourceId === "res_tool_ip-lookup" && locale.locale === "zh-TW"
  ));
  assert.equal(validateTranslationCompleteness(hiddenOnly).ok, true);
});

test("translation completeness CLI exits nonzero for incomplete published locale fixtures", async () => {
  await execFileAsync("node", ["scripts/check-translations.mjs", "--artifact", "catalog/artifacts/catalog.normalized.v1.json"], {
    cwd: new URL("../", import.meta.url),
  });

  const tempRoot = await mkdtemp(join(tmpdir(), "godeskhub-translations-"));
  const fixturePath = join(tempRoot, "catalog.incomplete.json");
  const incomplete = structuredClone(catalogArtifact);
  incomplete.records.locales = incomplete.records.locales.filter(locale => !(
    locale.resourceId === "res_tool_json-tools" && locale.locale === "zh-CN"
  ));
  await writeFile(fixturePath, `${JSON.stringify(incomplete, null, 2)}\n`, "utf8");

  await assert.rejects(
    execFileAsync("node", ["scripts/check-translations.mjs", "--artifact", fixturePath], {
      cwd: new URL("../", import.meta.url),
    }),
    error => {
      assert.equal(error.code, 1);
      assert.match(error.stderr, /missing-published-locale\tres_tool_json-tools\tzh-CN\tlocale/);
      return true;
    },
  );
});

test("catalog publication policy drives conservative sitemap and indexing decisions", () => {
  const urls = buildCatalogSitemapUrls(catalogArtifact, { frontend: "tools" });
  assert.equal(urls.length, new Set(urls).size);
  assert.ok(urls.length > 0);
  assert.ok(urls.every(url => url.startsWith("https://tools.godeskhub.com/")));
  assert.ok(urls.every(url => /^https:\/\/tools\.godeskhub\.com\/(en|zh-cn|zh-tw)\//.test(url)));
  assert.ok(!urls.some(url => /ip-lookup|ip-whois-rdap|godeskhub\.com\/tools/.test(url)));
  assert.ok(urls.includes("https://tools.godeskhub.com/en/tools/json-tools"));

  assert.deepEqual(resolvePublicationIndexingPolicy({ status: "published", routeKind: "tool" }), {
    robots: "index, follow",
    publishRoute: true,
    includeInSitemap: true,
    httpStatus: 200,
  });
  assert.deepEqual(resolvePublicationIndexingPolicy({ status: "hidden", routeKind: "tool" }), {
    robots: "noindex, nofollow",
    publishRoute: false,
    includeInSitemap: false,
    httpStatus: 404,
  });
  assert.deepEqual(resolvePublicationIndexingPolicy({ status: "deprecated", routeKind: "tool", replacementUrl: "/en/tools/json-tools" }), {
    robots: "noindex, nofollow",
    publishRoute: false,
    includeInSitemap: false,
    httpStatus: 301,
    replacementUrl: "/en/tools/json-tools",
  });
});

test("catalog metadata emits structured data from visible published content without false claims", () => {
  const metadata = resolveCatalogPageMetadata({ kind: "tool", lang: "en", toolId: "json" });
  const serialized = JSON.stringify(metadata.jsonLd);
  assert.equal(metadata.canonical, "https://tools.godeskhub.com/en/tools/json-tools");
  assert.deepEqual(metadata.alternates.map(item => item.hreflang), ["en", "zh-CN", "zh-TW", "x-default"]);
  assert.doesNotMatch(serialized, /AggregateRating|Review|Offer|price|userCount|undefined/);
  const faq = metadata.jsonLd["@graph"].find(entity => entity["@type"] === "FAQPage");
  assert.ok(faq.mainEntity.length >= 2);
  assert.ok(faq.mainEntity.every(entity => entity.name && entity.acceptedAnswer.text));
});

test("localized multi-resource search ranks deterministic public resource results", () => {
  const json = searchResources("JSON format", "en", { limit: 5 });
  assert.equal(json[0].resourceId, "res_tool_json-tools");
  assert.equal(json[0].type, "tool");
  assert.equal(json[0].path, "/en/tools/json-tools");
  assert.ok(json[0].score > 0);
  assert.deepEqual(json, searchResources("JSON format", "en", { limit: 5 }));

  assert.equal(searchResources("内部收益率", "zh-CN", { limit: 1 })[0].resourceId, "res_tool_irr-calculator");
  assert.equal(searchResources("QR Code", "zh-TW", { limit: 1 })[0].resourceId, "res_tool_qr-code-generator");
  assert.deepEqual(searchResources("RDAP WHOIS", "en"), []);
  assert.deepEqual(searchResources("", "en"), []);
});

test("Tools search consumes the unified index while preserving current result shape and privacy", async () => {
  assert.equal(searchTools("JSON", "en")[0].toolId, "json");
  assert.equal(searchTools("内部收益率", "zh-CN")[0].path, "/zh-cn/tools/irr-calculator");
  assert.deepEqual(searchTools("RDAP WHOIS", "en"), []);

  const source = await readFile(new URL("../src/lib/search.js", import.meta.url), "utf8");
  assert.match(source, /searchResources/);
  assert.doesNotMatch(source, /fetch\s*\(|sendBeacon|localStorage|sessionStorage|gtag|analytics/i);
});

test("static artifact generation uses Catalog sitemap and metadata policy helpers", async () => {
  const source = await readFile(new URL("../scripts/generate-static-pages.mjs", import.meta.url), "utf8");
  assert.match(source, /buildCatalogSitemapUrls/);
  assert.match(source, /resolveCatalogPageMetadata/);

  const tempRoot = await mkdtemp(join(tmpdir(), "godeskhub-phase3b-static-"));
  await writeFile(
    join(tempRoot, "index.html"),
    '<!doctype html><html lang="en"><head><!-- route-metadata:start --><title>Template</title><!-- route-metadata:end --></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>',
  );
  await generateSite({ distDir: tempRoot });
  const sitemap = await readFile(join(tempRoot, "sitemap.xml"), "utf8");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.deepEqual(locations, buildCatalogSitemapUrls(catalogArtifact, { frontend: "tools" }));
});

test("search privacy contract forbids raw query, normalized query, and token analytics", async () => {
  const contract = await readFile(new URL("../docs/architecture/search-privacy-contract.md", import.meta.url), "utf8");
  for (const required of [
    "Raw search queries must not leave the browser.",
    "Normalized queries and query tokens must not leave the browser.",
    "Allowed future signals are aggregate counters only.",
    "passwords, JSON, URLs, amounts, IP addresses, and free-form text",
  ]) {
    assert.match(contract, new RegExp(required.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
