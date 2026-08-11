import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import test from "node:test";

import catalogArtifact from "../catalog/artifacts/catalog.normalized.v1.json" with { type: "json" };
import {
  DEFAULT_LOCALE,
  LOCALE_ROUTE_SEGMENTS,
  SUPPORTED_LOCALES,
  assertPublishedLocaleCompleteness,
  htmlLangForLocale,
  localeToRouteSegment,
  normalizeLocale,
  routeSegmentToLocale,
} from "../src/lib/locale.js";
import { buildPath, listCanonicalRoutes } from "../src/lib/routes.js";
import {
  SEARCH_INDEX_SIZE_BUDGET_GZIP_BYTES,
  buildLocalizedSearchIndex,
  buildSearchDocuments,
  normalizeSearchQuery,
  searchIndex,
} from "../src/lib/search-index.js";
import { createCatalogSearchDocumentOptions } from "../src/lib/search-index-enrichment.js";
import {
  TOOLS_FRONTEND_POLICY,
  resolveCatalogPageMetadata,
  resolveCanonicalUrl,
  resolveHreflangSet,
  resolveRobotsPolicy,
} from "../src/lib/catalog-seo.js";
import { getRouteMetadata } from "../src/lib/seo.js";

test("shared locale resolver uses stable BCP 47 IDs and route segments", () => {
  assert.equal(DEFAULT_LOCALE, "en");
  assert.deepEqual(SUPPORTED_LOCALES, ["en", "zh-CN", "zh-TW"]);
  assert.deepEqual(LOCALE_ROUTE_SEGMENTS, {
    en: "en",
    "zh-CN": "zh-cn",
    "zh-TW": "zh-tw",
  });
  assert.equal(normalizeLocale("zh-cn"), "zh-CN");
  assert.equal(normalizeLocale("ZH-tw"), "zh-TW");
  assert.equal(normalizeLocale("fr"), null);
  assert.equal(localeToRouteSegment("zh-CN"), "zh-cn");
  assert.equal(routeSegmentToLocale("zh-tw"), "zh-TW");
  assert.equal(routeSegmentToLocale("fr"), null);
  assert.equal(htmlLangForLocale("zh-TW"), "zh-TW");
});

test("published locale policy requires complete locale records without silent fallback", () => {
  const report = assertPublishedLocaleCompleteness(catalogArtifact);
  assert.deepEqual(report.diagnostics, []);

  const broken = structuredClone(catalogArtifact);
  const publishedResource = broken.records.resources.find(resource => resource.status === "published");
  broken.records.locales = broken.records.locales.filter(
    locale => !(locale.resourceId === publishedResource.id && locale.locale === "zh-TW"),
  );

  const brokenReport = assertPublishedLocaleCompleteness(broken);
  assert.deepEqual(brokenReport.diagnostics, [{
    code: "missing-published-locale",
    resourceId: publishedResource.id,
    locale: "zh-TW",
    field: "locale",
  }]);
});

test("unified search documents include only published public resources and no private fields", () => {
  const documents = buildSearchDocuments(catalogArtifact, {
    frontendPolicy: TOOLS_FRONTEND_POLICY,
  });
  const publishedResources = catalogArtifact.records.resources.filter(resource => resource.status === "published");

  assert.equal(documents.length, publishedResources.length * SUPPORTED_LOCALES.length);
  assert.ok(documents.some(document => document.type === "tool" && document.locale === "en"));
  assert.ok(documents.every(document => ["tool", "website", "guide"].includes(document.type)));
  assert.ok(documents.every(document => document.status === "published"));
  assert.ok(documents.every(document => document.url.startsWith("/")));
  assert.ok(!documents.some(document => /ip-lookup|ip-whois-rdap|rdap|whois/i.test(`${document.id} ${document.url} ${document.name}`)));
  assert.ok(documents.every(document => !("health" in document) && !("evidence" in document)));
  assert.doesNotMatch(JSON.stringify(documents), /credential|TOKEN|SECRET|API_KEY/);
});

test("localized search index is deterministic, local-only, and within the approved size budget", () => {
  const documents = buildSearchDocuments(catalogArtifact, {
    ...createCatalogSearchDocumentOptions({ frontendPolicy: TOOLS_FRONTEND_POLICY }),
  });
  const left = buildLocalizedSearchIndex(documents);
  const right = buildLocalizedSearchIndex(documents);

  assert.deepEqual(left, right);
  assert.deepEqual(Object.keys(left.locales), SUPPORTED_LOCALES);
  assert.ok(left.locales.en.documents.some(document => document.name === "JSON tools"));
  assert.equal(normalizeSearchQuery(" JSON "), "json");
  assert.equal(normalizeSearchQuery("子网计算"), "子网计算");
  assert.ok(gzipSync(JSON.stringify(left)).byteLength <= SEARCH_INDEX_SIZE_BUDGET_GZIP_BYTES);
  assert.deepEqual(searchIndex, left);
});

test("catalog metadata resolver preserves Tools canonical ownership and current route output", () => {
  const route = { kind: "tool", lang: "zh-CN", toolId: "json" };
  const current = getRouteMetadata(route);
  const resolved = resolveCatalogPageMetadata(route, {
    catalogArtifact,
    frontendPolicy: TOOLS_FRONTEND_POLICY,
  });

  assert.equal(TOOLS_FRONTEND_POLICY.origin, "https://tools.godeskhub.com");
  assert.equal(resolveCanonicalUrl(route, TOOLS_FRONTEND_POLICY), current.canonical);
  assert.deepEqual(resolveHreflangSet(route, TOOLS_FRONTEND_POLICY), current.alternates);
  assert.deepEqual(resolved, current);

  const allCanonicals = listCanonicalRoutes().map(item => resolveCanonicalUrl(item, TOOLS_FRONTEND_POLICY));
  assert.ok(allCanonicals.every(url => url.startsWith("https://tools.godeskhub.com/")));
  assert.equal(new Set(allCanonicals).size, allCanonicals.length);
});

test("publication indexing policy keeps non-public resources out of public artifacts", () => {
  assert.deepEqual(resolveRobotsPolicy({ status: "published", routeKind: "tool" }), {
    robots: "index, follow",
    publishRoute: true,
    includeInSitemap: true,
  });
  assert.deepEqual(resolveRobotsPolicy({ status: "hidden", routeKind: "tool" }), {
    robots: "noindex, nofollow",
    publishRoute: false,
    includeInSitemap: false,
  });
  assert.deepEqual(resolveRobotsPolicy({ status: "deprecated", routeKind: "tool" }), {
    robots: "noindex, nofollow",
    publishRoute: false,
    includeInSitemap: false,
  });
  assert.equal(resolveRobotsPolicy({ status: "published", routeKind: "not-found" }).robots, "noindex, nofollow");

  const paths = listCanonicalRoutes().map(buildPath);
  assert.ok(!paths.some(path => /ip-info-lookup|ip-lookup|ip-whois-rdap/.test(path)));
});
