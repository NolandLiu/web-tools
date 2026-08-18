import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const requiredPages = [
  "dist-discover/index.html",
  "dist-discover/en/index.html",
  "dist-discover/zh-cn/index.html",
  "dist-discover/zh-tw/index.html",
  "dist-discover/en/tools/index.html",
  "dist-discover/en/ai-skills/index.html",
  "dist-discover/en/categories/network-ip/index.html",
  "dist-discover/en/resources/ai-skill/prompt-brief-refiner/index.html",
  "dist-discover/en/resources/tool/ipv4-network-toolbox/index.html",
];

function extractJsonLd(html, page) {
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (matches.length !== 1) {
    console.error(`${page} should contain exactly one JSON-LD script.`);
    process.exit(1);
  }
  try {
    return JSON.parse(matches[0][1]);
  } catch (error) {
    console.error(`${page} contains invalid JSON-LD: ${error.message}`);
    process.exit(1);
  }
}

function assertNoDuplicateSitemapUrls(sitemap) {
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
  assert.equal(new Set(urls).size, urls.length, "sitemap contains duplicate loc entries");
  return urls;
}

function collectJsonLdTypes(value, types = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectJsonLdTypes(item, types);
    return types;
  }
  if (value && typeof value === "object") {
    if (typeof value["@type"] === "string") types.push(value["@type"]);
    for (const item of Object.values(value)) collectJsonLdTypes(item, types);
  }
  return types;
}

for (const page of requiredPages) {
  const html = await readFile(resolve(page), "utf8");
  for (const expected of ["godeskhub.com", "GoDeskHub", "canonical", "hreflang", "application/ld+json"]) {
    if (!html.includes(expected)) {
      console.error(`${page} is missing ${expected}`);
      process.exit(1);
    }
  }
  if (html.includes("noindex")) {
    console.error(`${page} should not contain noindex after Discover static generation.`);
    process.exit(1);
  }
  if (/raw query|search query|工具输入|tool input value/i.test(html)) {
    console.error(`${page} contains raw query or user-input wording in static metadata.`);
    process.exit(1);
  }
  if (!html.includes('hreflang="x-default"')) {
    console.error(`${page} is missing x-default hreflang.`);
    process.exit(1);
  }
  const jsonLd = extractJsonLd(html, page);
  if (!jsonLd.url?.startsWith("https://godeskhub.com/")) {
    console.error(`${page} JSON-LD URL is not canonical Discover origin.`);
    process.exit(1);
  }
  if (collectJsonLdTypes(jsonLd).some(type => ["AggregateRating", "Review", "Offer"].includes(type))) {
    console.error(`${page} contains unsupported structured data claims.`);
    process.exit(1);
  }
}

const home = await readFile(resolve("dist-discover/en/index.html"), "utf8");
for (const expected of ["Find the right tool", "Featured picks", "Browse by category", "Recently added"]) {
  if (!home.includes(expected)) {
    console.error(`Discover homepage raw HTML is missing ${expected}`);
    process.exit(1);
  }
}

const aiSkill = await readFile(resolve("dist-discover/en/resources/ai-skill/prompt-brief-refiner/index.html"), "utf8");
for (const expected of ["Prompt brief refiner", "Use cases", "Inputs", "Outputs", "Steps", "Privacy notes"]) {
  if (!aiSkill.includes(expected)) {
    console.error(`Discover AI Skill static HTML is missing ${expected}`);
    process.exit(1);
  }
}
const aiSkillJsonLd = extractJsonLd(aiSkill, "dist-discover/en/resources/ai-skill/prompt-brief-refiner/index.html");
assert.equal(aiSkillJsonLd["@type"], "HowTo");
assert.ok(Array.isArray(aiSkillJsonLd.step) && aiSkillJsonLd.step.length >= 2);

const aiSkillList = await readFile(resolve("dist-discover/en/ai-skills/index.html"), "utf8");
const aiSkillListJsonLd = extractJsonLd(aiSkillList, "dist-discover/en/ai-skills/index.html");
assert.equal(aiSkillListJsonLd["@type"], "ItemList");
assert.ok(aiSkillListJsonLd.itemListElement.some(item => item.url.includes("/resources/ai-skill/")));

const sitemap = await readFile(resolve("dist-discover/sitemap.xml"), "utf8");
for (const expected of [
  "https://godeskhub.com/en/",
  "https://godeskhub.com/en/ai-skills/",
  "https://godeskhub.com/en/resources/ai-skill/prompt-brief-refiner/",
  "hreflang=\"en\"",
  "hreflang=\"zh-CN\"",
  "hreflang=\"zh-TW\"",
  "hreflang=\"x-default\"",
  "xmlns:xhtml=\"http://www.w3.org/1999/xhtml\"",
]) {
  if (!sitemap.includes(expected)) {
    console.error(`Discover sitemap is missing ${expected}`);
    process.exit(1);
  }
}
if (/collections|collection/i.test(sitemap)) {
  console.error("Discover sitemap should not include Collections URLs.");
  process.exit(1);
}
const sitemapUrls = assertNoDuplicateSitemapUrls(sitemap);
assert.ok(sitemapUrls.every(url => url.startsWith("https://godeskhub.com/")));

console.log("Verified Discover static HTML, SEO metadata, and privacy boundaries.");
