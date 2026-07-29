import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { CATEGORIES, INFO_PAGES, LANGUAGES, SITE_ORIGIN, TOOLS } from "../src/registry.js";
import { CATEGORY_CONTENT, TOOL_CONTENT } from "../src/content/index.js";
import { validateContentRegistry } from "../src/lib/content.js";
import { buildPath, listCanonicalRoutes } from "../src/lib/routes.js";
import { getRouteMetadata, renderMetadataTags } from "../src/lib/seo.js";

const distDir = resolve("dist");
const routes = listCanonicalRoutes();
const expectedRouteCount = LANGUAGES.length * (1 + TOOLS.length + CATEGORIES.length + INFO_PAGES.length);
assert.equal(routes.length, expectedRouteCount, "Canonical route count must match the registry.");
assert.deepEqual(validateContentRegistry(), {
  toolCount: TOOLS.length,
  categoryCount: 4,
  languageCount: 3,
});

function escapeVisibleText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function outputPath(route) {
  const relativePath = buildPath(route).replace(/^\/|\/$/g, "");
  return route.kind === "home"
    ? join(distDir, relativePath, "index.html")
    : join(distDir, `${relativePath}.html`);
}

for (const route of routes) {
  const html = await readFile(outputPath(route), "utf8");
  const metadata = getRouteMetadata(route);
  assert.match(html, new RegExp(`<html lang="${metadata.lang}">`));
  assert.ok(html.includes(renderMetadataTags(metadata)), `Incomplete metadata for ${buildPath(route)}`);
  assert.doesNotMatch(html, /\/src\/main\.tsx/);
  assert.match(html, /\/assets\/[^"]+\.js/);
  assert.match(html, /\/assets\/[^"]+\.css/);
  assert.match(html, new RegExp(`data-static-route="${route.kind}"`));
  const jsonLdScripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(jsonLdScripts.length, 1, `Expected one JSON-LD graph for ${buildPath(route)}`);
  const jsonLd = JSON.parse(jsonLdScripts[0][1]);
  assert.equal(jsonLd["@context"], "https://schema.org");
  assert.ok(Array.isArray(jsonLd["@graph"]) && jsonLd["@graph"].length > 0);
  if (route.kind === "tool") {
    const content = TOOL_CONTENT[route.toolId][route.lang];
    assert.ok(html.includes(escapeVisibleText(content.summary)), `Missing summary for ${buildPath(route)}`);
    for (const item of content.faqs) {
      assert.ok(html.includes(escapeVisibleText(item.question)), `Missing visible FAQ for ${buildPath(route)}`);
      assert.ok(html.includes(escapeVisibleText(item.answer)), `Missing visible FAQ answer for ${buildPath(route)}`);
    }
    assert.match(html, /mailto:support@godeskhub\.com/);
    const faq = jsonLd["@graph"].find(entity => entity["@type"] === "FAQPage");
    assert.deepEqual(
      faq.mainEntity.map(entity => [entity.name, entity.acceptedAnswer.text]),
      content.faqs.map(item => [item.question, item.answer]),
    );
  }
  if (route.kind === "category") {
    const content = CATEGORY_CONTENT[route.categoryId][route.lang];
    assert.ok(html.includes(escapeVisibleText(content.introduction)), `Missing category introduction for ${buildPath(route)}`);
    assert.ok(html.includes(escapeVisibleText(content.distinction)), `Missing category distinction for ${buildPath(route)}`);
  }
}

const rootHtml = await readFile(join(distDir, "index.html"), "utf8");
const assetPaths = [...rootHtml.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)]
  .map(match => match[1]);
assert.ok(assetPaths.length >= 2, "Built root HTML must reference JavaScript and CSS assets.");
for (const assetPath of assetPaths) {
  await access(join(distDir, assetPath.replace(/^\//, "")));
}

const sitemap = await readFile(join(distDir, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const expectedUrls = routes.map(route => `${SITE_ORIGIN}${buildPath(route)}`);
assert.deepEqual(sitemapUrls, expectedUrls, "Sitemap must match canonical route order and content.");
assert.equal(new Set(sitemapUrls).size, expectedRouteCount, "Sitemap URLs must be unique.");
assert.ok(sitemapUrls.every(url => url.startsWith("https://tools.godeskhub.com/")));
assert.doesNotMatch(sitemap, /https:\/\/godeskhub\.com/);

const robots = await readFile(join(distDir, "robots.txt"), "utf8");
assert.match(robots, /Sitemap: https:\/\/tools\.godeskhub\.com\/sitemap\.xml/);

const manifest = JSON.parse(await readFile(join(distDir, "manifest.webmanifest"), "utf8"));
assert.equal(manifest.start_url, "/en/");
assert.equal(manifest.scope, "/");

const notFound = await readFile(join(distDir, "404.html"), "utf8");
assert.match(notFound, /<meta name="robots" content="noindex, nofollow"/);
assert.match(notFound, /<title>Page not found \| GoDeskHub<\/title>/);
assert.match(notFound, /data-static-route="not-found"/);

const redirects = await readFile(join(distDir, "_redirects"), "utf8");
assert.match(redirects, /^\/ \/en\/ 301$/m);
assert.match(redirects, /^\/tools\/:slug \/en\/tools\/:slug 301$/m);
assert.match(redirects, /^\/categories\/:slug \/en\/categories\/:slug 301$/m);
assert.doesNotMatch(redirects, /^\/\* /m);

globalThis.console.log(`Verified ${expectedRouteCount} static routes, metadata, Sitemap, deep links, redirects, and assets.`);
