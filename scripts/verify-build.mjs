import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { SITE_ORIGIN } from "../src/registry.js";
import { buildPath, listCanonicalRoutes } from "../src/lib/routes.js";
import { getRouteMetadata, renderMetadataTags } from "../src/lib/seo.js";

const distDir = resolve("dist");
const routes = listCanonicalRoutes();
assert.equal(routes.length, 93, "Expected exactly 93 canonical routes.");

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
assert.equal(new Set(sitemapUrls).size, 93, "Sitemap URLs must be unique.");
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

const redirects = await readFile(join(distDir, "_redirects"), "utf8");
assert.match(redirects, /^\/ \/en\/ 301$/m);
assert.match(redirects, /^\/tools\/:slug \/en\/tools\/:slug 301$/m);
assert.match(redirects, /^\/categories\/:slug \/en\/categories\/:slug 301$/m);
assert.doesNotMatch(redirects, /^\/\* /m);

globalThis.console.log("Verified 93 static routes, metadata, Sitemap, deep links, redirects, and assets.");
