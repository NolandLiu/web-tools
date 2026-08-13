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
  for (const expected of ["Tools", "Websites", "Guides", "AI Skills", "About", "Contact", "Privacy", "Terms"]) {
    assert.match(data, new RegExp(expected));
  }
  assert.doesNotMatch(data, /Collections/);
  assert.match(shell, /t\.nav\.tools/);
  assert.match(shell, /t\.nav\.aiSkills/);
  assert.doesNotMatch(shell, /t\.nav\.collections/);
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

  const generator = await read("apps/discover/scripts/generate-discover-static-pages.mjs");
  assert.match(generator, /buildDiscoverSitemap/);
  assert.match(generator, /sitemap\.xml/);
  assert.match(generator, /xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
  assert.match(generator, /hreflang="x-default"/);
  assert.match(generator, /route\.kind !== "not-found"/);
  assert.doesNotMatch(generator, /collection/);

  const verifier = await read("apps/discover/scripts/verify-discover-build.mjs");
  for (const expected of [
    "dist-discover/en/index.html",
    "dist-discover/zh-cn/index.html",
    "dist-discover/zh-tw/index.html",
    "dist-discover/sitemap.xml",
    "application/ld+json",
    "hreflang",
    "x-default",
    "godeskhub.com",
    "raw query",
  ]) {
    assert.match(verifier, new RegExp(expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(verifier, /html\.includes\("noindex"\)/);
  assert.match(verifier, /https:\/\/godeskhub\.com\/en\/ai-skills\//);
  assert.match(verifier, /https:\/\/godeskhub\.com\/en\/resources\/ai-skill\/prompt-brief-refiner\//);
  assert.match(verifier, /assertNoDuplicateSitemapUrls/);
});

test("Discover cutover and rollback plan is documented without performing deployment", async () => {
  const docs = await read("docs/discover-cutover-rollback.md");
  assert.match(docs, /godeskhub\.com/);
  assert.match(docs, /Cloudflare Pages/);
  assert.match(docs, /Rollback/);
  assert.match(docs, /Do not deploy/);
});

test("Discover Phase 6 publication readiness checklist is documented without deployment", async () => {
  const docs = await read("docs/discover-publication-readiness-checklist.md");
  assert.match(docs, /AI Skills/);
  assert.match(docs, /Collections/);
  assert.match(docs, /npm run verify/);
  assert.match(docs, /Do not deploy/);
  assert.match(docs, /Do not change DNS/);
});

test("Discover homepage visual system uses cohesive typography, icons, spacing, and footer navigation", async () => {
  const styles = await read("apps/discover/src/styles.css");
  const card = await read("apps/discover/src/components/ResourceCard.tsx");
  const icons = await read("apps/discover/src/components/DiscoverIcon.tsx");
  const shell = await read("apps/discover/src/components/AppShell.tsx");
  const search = await read("apps/discover/src/components/SearchBox.tsx");

  for (const token of [
    "--font-discover-display",
    "--font-discover-ui",
    "--space-discover-section",
    "--color-discover-accent",
    "--shadow-discover-interactive",
  ]) {
    assert.match(styles, new RegExp(token), `expected visual token ${token}`);
  }

  assert.match(styles, /text-wrap:\s*balance/);
  assert.match(styles, /font-variant-numeric:\s*tabular-nums/);
  assert.match(styles, /\.discover-resource-card:hover/);
  assert.match(styles, /\.discover-resource-card:focus-within/);
  assert.match(styles, /\.discover-search-panel:focus-within/);
  assert.match(styles, /\.discover-footer-brand/);
  assert.match(styles, /\.discover-resource-card[\s\S]*display:\s*grid/);
  assert.match(styles, /\.discover-resource-card[\s\S]*grid-template-rows:\s*auto 1fr auto/);

  assert.match(icons, /export function DiscoverIcon/);
  assert.match(icons, /type:\s*"tool" \| "website" \| "guide" \| "ai-skill" \| "collection" \| "category"/);
  assert.match(card, /<DiscoverIcon/);
  assert.doesNotMatch(card, /slice\(0,\s*1\)/);

  assert.match(search, /discover-search-kbd/);
  assert.doesNotMatch(search, /<select|All resources|Categories/);
  assert.match(shell, /discover-footer-brand/);
  assert.doesNotMatch(shell, /discover-footer[\s\S]*t\.nav\./);
});

test("Discover visual refinement gives tools distinct icons, readable locale typography, and semantic locale switching", async () => {
  const styles = await read("apps/discover/src/styles.css");
  const card = await read("apps/discover/src/components/ResourceCard.tsx");
  const icons = await read("apps/discover/src/components/DiscoverIcon.tsx");
  const shell = await read("apps/discover/src/components/AppShell.tsx");
  const switcher = await read("apps/discover/src/components/LocaleSwitcher.tsx");
  const data = await read("apps/discover/src/discover-data.js");

  assert.match(icons, /toolIconPaths/);
  assert.match(icons, /canonicalSlug\?:\s*string/);
  assert.match(card, /canonicalSlug=\{resource\.canonicalSlug\}/);

  assert.match(shell, /lang=\{t\.htmlLang\}/);
  assert.match(styles, /\.discover-shell:lang\(en\)/);
  assert.match(styles, /\.discover-shell:lang\(zh-CN\)/);
  assert.match(styles, /\.discover-shell:lang\(zh-TW\)/);
  assert.match(styles, /letter-spacing:\s*-0\.01em/);
  assert.doesNotMatch(styles, /font-weight:\s*800/);

  assert.match(data, /switchDiscoverLocalePath/);
  assert.match(switcher, /switchDiscoverLocalePath/);
  assert.doesNotMatch(switcher, /window\.location\.href = `\/\$\{localeSegment\(event\.currentTarget\.value\)\}\/`/);

  const module = await import("../apps/discover/src/discover-data.js");
  assert.equal(
    module.switchDiscoverLocalePath("/en/resources/tool/password-generator/", "zh-CN"),
    "/zh-cn/resources/tool/password-generator/",
  );
  assert.equal(module.switchDiscoverLocalePath("/zh-tw/privacy/", "en"), "/en/privacy/");
  assert.equal(module.switchDiscoverLocalePath("/en/categories/network-ip/", "zh-TW"), "/zh-tw/categories/network-ip/");
});

test("Discover browse and information pages use dedicated layouts instead of placeholder panels", async () => {
  const browse = await read("apps/discover/src/pages/BrowsePage.tsx");
  const info = await read("apps/discover/src/pages/InfoPage.tsx");
  const styles = await read("apps/discover/src/styles.css");

  assert.match(browse, /discover-browse-hero/);
  assert.match(browse, /discover-resource-list/);
  assert.match(browse, /route\.resourceType === "website"/);
  assert.match(browse, /route\.resourceType === "guide"/);
  assert.match(browse, /route\.resourceType === "ai-skill"/);
  assert.doesNotMatch(browse, /route\.resourceType === "collection"/);

  assert.match(info, /infoContent/);
  assert.match(info, /discover-info-layout/);
  assert.match(info, /discover-info-sidebar/);
  assert.doesNotMatch(info, /will use the shared policy content in a later content pass/);

  for (const className of [
    "discover-browse-hero",
    "discover-resource-list",
    "discover-info-layout",
    "discover-info-sidebar",
    "discover-info-card",
  ]) {
    assert.match(styles, new RegExp(`\\.${className}`));
  }
});

test("Discover Phase 6 IA removes Collections and exposes AI Skills", async () => {
  const module = await import("../apps/discover/src/discover-data.js");

  assert.equal(module.parseDiscoverPath("/en/collections/").kind, "not-found");
  assert.deepEqual(module.parseDiscoverPath("/en/ai-skills/"), {
    locale: "en",
    resourceType: "ai-skill",
    slug: undefined,
    categorySlug: undefined,
    tagSlug: undefined,
    kind: "browse",
  });
  assert.equal(
    module.discoverCanonicalPath({ kind: "browse", locale: "zh-CN", resourceType: "ai-skill" }),
    "/zh-cn/ai-skills/",
  );

  const staticRoutes = module.buildStaticRoutes();
  assert.ok(staticRoutes.some((route) => route.kind === "browse" && route.resourceType === "ai-skill"));
  assert.ok(!staticRoutes.some((route) => route.kind === "browse" && route.resourceType === "collection"));
});

test("Discover Phase 6 AI Skills have seeded multilingual pages and content", async () => {
  const module = await import("../apps/discover/src/discover-data.js");

  const aiSkills = module.listDiscoverResources("en", { type: "ai-skill" });
  assert.ok(aiSkills.length >= 3, "expected at least three seeded AI Skills");
  assert.ok(aiSkills.every((resource) => resource.href.startsWith("/en/resources/ai-skill/")));
  assert.ok(aiSkills.some((resource) => resource.canonicalSlug === "prompt-brief-refiner"));

  const zhCn = module.listDiscoverResources("zh-CN", { type: "ai-skill" });
  const zhTw = module.listDiscoverResources("zh-TW", { type: "ai-skill" });
  assert.equal(zhCn.length, aiSkills.length);
  assert.equal(zhTw.length, aiSkills.length);
  assert.ok(zhCn.some((resource) => resource.name.includes("提示词")));
  assert.ok(zhTw.some((resource) => resource.name.includes("提示詞")));

  const detailRoute = module.parseDiscoverPath("/en/resources/ai-skill/prompt-brief-refiner/");
  const detail = module.findResourceByRoute(detailRoute);
  assert.equal(detail?.type, "ai-skill");
  assert.ok(detail.useCases.length >= 1);
  assert.ok(detail.inputRequirements.length >= 1);
  assert.ok(detail.outputResults.length >= 1);
  assert.ok(detail.steps.length >= 2);
  assert.ok(detail.riskNotes.some((note) => /secret|private|password/i.test(note)));
});

test("Discover Phase 6 search and related resources include AI Skills without exposing Collections", async () => {
  const module = await import("../apps/discover/src/discover-data.js");

  const aiSearch = module.listDiscoverResources("en", { query: "acceptance criteria" });
  assert.ok(aiSearch.some((resource) => resource.type === "ai-skill" && resource.canonicalSlug === "prompt-brief-refiner"));

  const zhSearch = module.listDiscoverResources("zh-CN", { query: "提示词" });
  assert.ok(zhSearch.some((resource) => resource.type === "ai-skill"));

  const detail = module.findResourceByRoute(module.parseDiscoverPath("/en/resources/ai-skill/code-review-checklist/"));
  const related = module.getRelatedResources(detail, "en");
  assert.ok(related.length >= 1);
  assert.ok(related.every((resource) => resource.status === "published"));
  assert.ok(related.some((resource) => resource.type !== detail.type));

  const all = module.listDiscoverResources("en");
  assert.ok(!all.some((resource) => resource.type === "collection"));
  assert.ok(module.buildStaticRoutes().every((route) => route.resourceType !== "collection"));
});

test("Discover Phase 7 sitemap and metadata helpers publish localized AI Skills without Collections", async () => {
  const module = await import("../apps/discover/src/discover-data.js");
  const routes = module.buildStaticRoutes();
  const publicRoutes = routes.filter((route) => route.kind !== "not-found");

  assert.ok(publicRoutes.some((route) => route.kind === "browse" && route.resourceType === "ai-skill"));
  assert.ok(publicRoutes.some((route) => route.kind === "resource" && route.resourceType === "ai-skill"));
  assert.ok(publicRoutes.every((route) => route.resourceType !== "collection"));

  for (const locale of ["en", "zh-CN", "zh-TW"]) {
    const path = module.discoverCanonicalPath({ kind: "browse", locale, resourceType: "ai-skill" });
    assert.match(path, /^\/(en|zh-cn|zh-tw)\/ai-skills\/$/);
  }

  const staticGenerator = await read("apps/discover/scripts/generate-discover-static-pages.mjs");
  assert.match(staticGenerator, /"@type": "ItemList"/);
  assert.match(staticGenerator, /"@type": "HowTo"/);
  assert.doesNotMatch(staticGenerator, /AggregateRating|Review|Offer/);
});
