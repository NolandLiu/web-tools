import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function read(path) {
  return readFile(new URL(path, root), "utf8");
}

test("Discover exposes a typed local route model, shell, and shared resource cards", async () => {
  const app = await read("apps/discover/src/App.tsx");
  const data = await read("apps/discover/src/discover-data.js");
  const shell = await read("apps/discover/src/components/AppShell.tsx");
  const card = await read("apps/discover/src/components/ResourceCard.tsx");
  const search = await read("apps/discover/src/components/SearchBox.tsx");

  for (const expected of ["locale", "resourceType", "slug", "categorySlug", "tagSlug"]) {
    assert.match(data, new RegExp(expected));
  }

  assert.match(app, /<AppShell/);
  assert.match(app, /<HomePage/);
  for (const expected of ["Tools", "Websites", "Guides", "Collections", "About", "Contact", "Privacy", "Terms"]) {
    assert.match(data, new RegExp(expected));
  }
  assert.match(shell, /t\.nav\.tools/);
  assert.match(shell, /t\.footer\.about/);
  assert.doesNotMatch(shell, /footer[\s\S]*(Tools|Websites|Guides|Collections)/);
  assert.match(card, /resource\.type/);
  assert.match(card, /status !== "published"/);
  assert.match(card, /startsWith\("http"\)/);
  assert.match(card, /noreferrer/);
  assert.match(search, /role="search"/);
  assert.doesNotMatch(search, /sendBeacon|fetch\(|XMLHttpRequest|gtag\(/);
});

test("Discover projections derive homepage, categories, tags, and related resources from Catalog", async () => {
  const data = await read("apps/discover/src/discover-data.js");

  assert.match(data, /buildDiscoverHome/);
  assert.match(data, /listDiscoverCategories/);
  assert.match(data, /listDiscoverTags/);
  assert.match(data, /getRelatedResources/);
  assert.match(data, /status === "published"/);
  assert.doesNotMatch(data, /JSON Formatter[\s\S]*MDN Web Docs[\s\S]*Privacy basics/);
});

test("Discover build verifies localized static HTML, SEO metadata, and privacy boundaries", async () => {
  const packageJson = JSON.parse(await read("package.json"));
  assert.match(packageJson.scripts["discover:build"], /generate-discover-static-pages\.mjs/);

  const verifier = await read("apps/discover/scripts/verify-discover-build.mjs");
  for (const expected of [
    "dist-discover/en/index.html",
    "dist-discover/zh-cn/index.html",
    "dist-discover/zh-tw/index.html",
    "application/ld+json",
    "hreflang",
    "godeskhub.com",
    "raw query",
  ]) {
    assert.match(verifier, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(verifier, /html\.includes\("noindex"\)/);
});

test("Discover cutover and rollback plan is documented without performing deployment", async () => {
  const docs = await read("docs/discover-cutover-rollback.md");
  assert.match(docs, /godeskhub\.com/);
  assert.match(docs, /Cloudflare Pages/);
  assert.match(docs, /Rollback/);
  assert.match(docs, /Do not deploy/);
});
