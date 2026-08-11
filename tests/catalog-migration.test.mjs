import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import catalogArtifact from "../catalog/artifacts/catalog.normalized.v1.json" with { type: "json" };
import { TOOL_CONTENT } from "../src/content/index.js";
import { TOOLS as LEGACY_TOOLS } from "../src/registry.js";
import { TOOLS, getCatalogFaqsByToolId, getCatalogSearchFields } from "../src/lib/catalog-data.js";
import { getRouteMetadata } from "../src/lib/seo.js";
import { searchTools } from "../src/lib/search.js";

const publishedResources = catalogArtifact.records.resources
  .filter(resource => resource.type === "tool" && resource.status === "published");

test("Catalog artifact owns every published tool resource while hidden IP capabilities stay private", () => {
  assert.equal(publishedResources.length, LEGACY_TOOLS.length);
  assert.deepEqual(
    publishedResources.map(resource => resource.toolBindingId).sort(),
    LEGACY_TOOLS.map(tool => tool.slug).sort(),
  );
  assert.deepEqual(TOOLS.map(tool => tool.id), LEGACY_TOOLS.map(tool => tool.id));

  const hiddenBindings = catalogArtifact.records.resources
    .filter(resource => resource.status === "hidden")
    .map(resource => resource.toolBindingId)
    .sort();
  assert.deepEqual(hiddenBindings, ["ip-info", "ip-rdap"]);
});

test("Catalog search fields drive localized search aliases and keywords", () => {
  assert.deepEqual(getCatalogSearchFields("json", "en").aliases.includes("json formatter"), true);
  assert.equal(searchTools("json formatter", "en")[0].toolId, "json");
  assert.equal(searchTools("内部收益率", "zh-CN")[0].toolId, "irr");
  assert.deepEqual(searchTools("WHOIS", "en"), []);
});

test("Catalog FAQ records project into visible content and JSON-LD", () => {
  const faqs = getCatalogFaqsByToolId("json", "zh-CN");
  assert(faqs.length >= 2);
  assert.deepEqual(TOOL_CONTENT.json["zh-CN"].faqs, faqs);

  const metadata = getRouteMetadata({ kind: "tool", lang: "zh-CN", toolId: "json" });
  const faqNode = metadata.jsonLd["@graph"].find(item => item["@type"] === "FAQPage");
  assert.deepEqual(
    faqNode.mainEntity.map(item => item.name),
    faqs.map(item => item.question),
  );
});

test("public consumers import Catalog facade instead of registry metadata directly", async () => {
  const files = [
    "src/App.tsx",
    "src/catalog.ts",
    "src/lib/routes.js",
    "src/lib/seo.js",
    "src/lib/search.js",
    "src/lib/static-content.js",
    "src/components/CategoryPage.tsx",
    "src/components/ToolSidebar.tsx",
  ];
  const directRegistryConsumers = [];
  for (const file of files) {
    const source = await readFile(new URL(`../${file}`, import.meta.url), "utf8");
    if (/from ["'][^"']*registry\.js["']/.test(source)) directRegistryConsumers.push(file);
  }
  assert.deepEqual(directRegistryConsumers, []);
});
