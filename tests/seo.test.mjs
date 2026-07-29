import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { generateSite } from "../scripts/generate-static-pages.mjs";
import { TOOL_CONTENT } from "../src/content/index.js";
import { listCanonicalRoutes } from "../src/lib/routes.js";
import { getRouteMetadata } from "../src/lib/seo.js";

test("site metadata and public content use the canonical tools subdomain", async () => {
  const paths = [
    "../index.html",
    "../src/App.tsx",
    "../public/robots.txt",
    "../public/manifest.webmanifest",
  ];
  const sources = await Promise.all(
    paths.map(path => readFile(new URL(path, import.meta.url), "utf8")),
  );
  const combined = sources.join("\n");

  assert.doesNotMatch(combined, /https:\/\/godeskhub\.com(?:\/|")/);
  assert.match(combined, /https:\/\/tools\.godeskhub\.com/);
});

test("localized route metadata includes canonical, Open Graph, hreflang, and JSON-LD", () => {
  const metadata = getRouteMetadata({ kind: "tool", lang: "zh-CN", toolId: "json" });

  assert.equal(metadata.lang, "zh-CN");
  assert.equal(metadata.title, "JSON 工具 | GoDeskHub");
  assert.equal(metadata.description, "在本地格式化、压缩并校验 JSON。");
  assert.equal(metadata.canonical, "https://tools.godeskhub.com/zh-cn/tools/json-tools");
  assert.deepEqual(metadata.openGraph, {
    type: "website",
    title: "JSON 工具 | GoDeskHub",
    description: "在本地格式化、压缩并校验 JSON。",
    url: "https://tools.godeskhub.com/zh-cn/tools/json-tools",
  });
  assert.deepEqual(metadata.alternates, [
    { hreflang: "en", href: "https://tools.godeskhub.com/en/tools/json-tools" },
    { hreflang: "zh-CN", href: "https://tools.godeskhub.com/zh-cn/tools/json-tools" },
    { hreflang: "zh-TW", href: "https://tools.godeskhub.com/zh-tw/tools/json-tools" },
    { hreflang: "x-default", href: "https://tools.godeskhub.com/en/tools/json-tools" },
  ]);
  assert.equal(metadata.jsonLd["@context"], "https://schema.org");
  assert.ok(Array.isArray(metadata.jsonLd["@graph"]));
  assert.deepEqual(
    metadata.jsonLd["@graph"].map(item => item["@type"]),
    ["WebApplication", "BreadcrumbList", "FAQPage"],
  );
  const application = metadata.jsonLd["@graph"][0];
  assert.equal(application.url, metadata.canonical);
  assert.equal(application.inLanguage, "zh-CN");
  assert.equal(application.applicationCategory, "DeveloperApplication");
  const faq = metadata.jsonLd["@graph"][2];
  assert.deepEqual(
    faq.mainEntity.map(item => [item.name, item.acceptedAnswer.text]),
    TOOL_CONTENT.json["zh-CN"].faqs.map(item => [item.question, item.answer]),
  );
});

test("home, category, and information pages receive distinct localized metadata", () => {
  const home = getRouteMetadata({ kind: "home", lang: "en" });
  const category = getRouteMetadata({ kind: "category", lang: "en", categoryId: "units" });
  const privacy = getRouteMetadata({ kind: "info", lang: "en", page: "privacy" });

  assert.deepEqual(home.jsonLd["@graph"].map(item => item["@type"]), ["WebSite"]);
  assert.deepEqual(
    category.jsonLd["@graph"].map(item => item["@type"]),
    ["CollectionPage", "ItemList", "BreadcrumbList"],
  );
  assert.deepEqual(privacy.jsonLd["@graph"].map(item => item["@type"]), ["WebPage"]);
  assert.equal(category.jsonLd["@graph"][1].itemListElement.length, 8);
  assert.notEqual(home.title, category.title);
  assert.notEqual(category.title, privacy.title);
  assert.notEqual(home.description, category.description);
});

test("all canonical routes produce complete and unique canonical metadata", () => {
  const routes = listCanonicalRoutes();
  const metadata = routes.map(getRouteMetadata);
  assert.equal(metadata.length, routes.length);
  assert.equal(new Set(metadata.map(item => item.canonical)).size, routes.length);
  for (const item of metadata) {
    assert.ok(item.title);
    assert.ok(item.description);
    assert.equal(item.openGraph.url, item.canonical);
    assert.equal(item.alternates.length, 4);
    assert.equal(item.robots, "index, follow");
    assert.equal(item.jsonLd["@context"], "https://schema.org");
    assert.ok(item.jsonLd["@graph"].length >= 1);
    assert.equal(new Set(item.jsonLd["@graph"].map(entity => entity["@id"])).size, item.jsonLd["@graph"].length);
    assert.doesNotMatch(JSON.stringify(item.jsonLd), /undefined|AggregateRating|Review|Offer/);
  }
});

test("static generation writes localized metadata into deep-link HTML without JavaScript", async () => {
  const tempRoot = await mkdtemp(join(tmpdir(), "godeskhub-static-"));
  await writeFile(
    join(tempRoot, "index.html"),
    '<!doctype html><html lang="en"><head><!-- route-metadata:start --><title>Template</title><!-- route-metadata:end --></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>',
  );

  await generateSite({ distDir: tempRoot });

  const html = await readFile(
    join(tempRoot, "zh-cn", "tools", "json-tools.html"),
    "utf8",
  );
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>JSON 工具 \| GoDeskHub<\/title>/);
  assert.match(html, /name="description" content="在本地格式化、压缩并校验 JSON。"/);
  assert.match(html, /rel="canonical" href="https:\/\/tools\.godeskhub\.com\/zh-cn\/tools\/json-tools"/);
  assert.match(html, /hreflang="en" href="https:\/\/tools\.godeskhub\.com\/en\/tools\/json-tools"/);
  assert.match(html, /hreflang="x-default" href="https:\/\/tools\.godeskhub\.com\/en\/tools\/json-tools"/);
  assert.match(html, /"@graph":\[\{"@id":"https:\/\/tools\.godeskhub\.com\/zh-cn\/tools\/json-tools#application","@type":"WebApplication"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.match(html, /src="\/assets\/app\.js"/);

  const sitemap = await readFile(join(tempRoot, "sitemap.xml"), "utf8");
  const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  assert.equal(locations.length, listCanonicalRoutes().length);
  assert.equal(new Set(locations).size, listCanonicalRoutes().length);
  assert.ok(locations.every(url => url.startsWith("https://tools.godeskhub.com/")));
  assert.ok(locations.every(url => /^https:\/\/tools\.godeskhub\.com\/(en|zh-cn|zh-tw)\//.test(url)));
  assert.ok(locations.includes("https://tools.godeskhub.com/en/tools/length-converter"));
  assert.ok(locations.includes("https://tools.godeskhub.com/zh-cn/categories/developer-tools"));
  assert.ok(locations.includes("https://tools.godeskhub.com/zh-tw/contact"));
  assert.doesNotMatch(sitemap, /https:\/\/godeskhub\.com/);

  const notFound = await readFile(join(tempRoot, "404.html"), "utf8");
  assert.match(notFound, /<meta name="robots" content="noindex, nofollow"/);
  assert.match(notFound, /<title>Page not found \| GoDeskHub<\/title>/);

  const redirects = await readFile(join(tempRoot, "_redirects"), "utf8");
  assert.match(redirects, /^\/ \/en\/ 301$/m);
  assert.match(redirects, /^\/about \/en\/about 301$/m);
  assert.match(redirects, /^\/tools\/:slug \/en\/tools\/:slug 301$/m);
  assert.match(redirects, /^\/categories\/:slug \/en\/categories\/:slug 301$/m);
  assert.doesNotMatch(redirects, /^\/\* /m);
});
