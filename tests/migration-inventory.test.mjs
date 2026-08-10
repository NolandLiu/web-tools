import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const inventoryModule = await import("../scripts/generate-migration-inventory.mjs").catch(() => null);

test("migration inventory exposes the accepted deterministic baseline", async () => {
  assert.ok(inventoryModule, "migration inventory generator must exist");
  const inventory = await inventoryModule.buildMigrationInventory();
  assert.equal(inventory.schemaVersion, 1);
  assert.deepEqual(inventory.baseline, {
    sourceCommit: "21c3eb8dab2205b5ea78ea7b53bf0fbd76bb81ee",
    evidenceDate: "2026-08-11",
  });
  assert.ok(Array.isArray(inventory.items));
  assert.ok(Array.isArray(inventory.findings));
});

test("published migration items cover every canonical page exactly once", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const published = inventory.items.filter((item) => item.observedExposure === "published-page");
  assert.equal(published.length, 37);
  assert.equal(inventory.summary.publishedItems, 37);
  assert.equal(inventory.summary.canonicalRoutes, 111);
  assert.equal(published.filter((item) => item.currentKind === "site-projection").length, 1);
  assert.equal(published.filter((item) => item.currentKind === "tool-page").length, 27);
  assert.equal(published.filter((item) => item.currentKind === "category-projection").length, 5);
  assert.equal(published.filter((item) => item.currentKind === "public-info-page").length, 4);
  assert.equal(published.flatMap((item) => item.localizedRoutes).length, 111);
});

test("current pages preserve approved migration classifications", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const json = inventory.items.find((item) => item.inventoryKey === "tool:json");
  assert.equal(json.currentIdentity.registryId, "json");
  assert.equal(json.currentIdentity.slug, "json-tools");
  assert.equal(json.currentIdentity.toolBindingId, "json");
  assert.equal(json.targetIdCandidate, "res_tool_json");
  const privacy = inventory.items.find((item) => item.inventoryKey === "info:privacy");
  assert.equal(privacy.migrationTarget, "unresolved");
  assert.equal(privacy.targetIdCandidate, null);
});

test("every published tool has locale, content, FAQ, SEO, contract, and implementation coverage", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const tools = inventory.items.filter((item) => item.currentKind === "tool-page");
  for (const item of tools) {
    assert.deepEqual(item.coverage, {
      locales: true,
      content: true,
      faq: true,
      seo: true,
      routes: true,
      contract: true,
      implementation: true,
      category: true,
    });
    assert.equal(item.ownership.implementation.length, 1);
    assert.ok(item.ownership.content.length >= 1);
  }
});

test("information pages expose split client and static ownership", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  for (const item of inventory.items.filter((entry) => entry.currentKind === "public-info-page")) {
    assert.deepEqual(item.ownership.clientContent, ["src/App.tsx"]);
    assert.deepEqual(item.ownership.staticContent, ["src/lib/static-content.js"]);
    assert.equal(item.coverage.locales, true);
    assert.equal(item.coverage.routes, true);
    assert.equal(item.coverage.seo, true);
  }
});

test("compatibility routes remain separate from canonical resources", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const redirects = inventory.items.filter((item) => item.observedExposure === "redirect-only");
  assert.equal(redirects.length, 4);
  assert.equal(redirects.flatMap((item) => item.localizedRoutes).length, 12);
  assert.ok(redirects.every((item) => item.currentKind === "compatibility-route"));
  assert.ok(redirects.every((item) => item.migrationTarget === "projection"));
});

test("retained IP information code is inventoried without becoming public", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const item = inventory.items.find((entry) => entry.inventoryKey === "unpublished:ip-info");
  assert.equal(item.observedExposure, "unpublished-source");
  assert.deepEqual(item.localizedRoutes, []);
  assert.deepEqual(item.ownership.functions, [
    "functions/api/network/ip-lookup.js",
    "functions/api/network/ip-rdap.js",
  ]);
  assert.equal(item.coverage.publicRegistry, false);
  assert.equal(item.coverage.canonicalRoutes, false);
  assert.equal(item.coverage.cloudflareInclude, false);
});

test("complete inventory reports the approved summary and warnings", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  assert.deepEqual(inventory.summary, {
    logicalItems: 42,
    publishedItems: 37,
    redirectItems: 4,
    unpublishedItems: 1,
    canonicalRoutes: 111,
    localizedRedirects: 12,
  });
  assert.ok(
    inventory.findings.some((item) => item.code === "INFO_PAGE_TARGET_UNRESOLVED" && item.severity === "warning"),
  );
  assert.ok(
    inventory.findings.some(
      (item) => item.code === "INFO_PAGE_CONTENT_OWNERSHIP_SPLIT" && item.severity === "warning",
    ),
  );
  assert.ok(
    inventory.findings.some((item) => item.code === "IP_INFO_RETAINED_UNPUBLISHED" && item.severity === "warning"),
  );
});

test("JSON and Markdown render deterministically from one model", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const jsonA = inventoryModule.renderMigrationInventoryJson(inventory);
  const jsonB = inventoryModule.renderMigrationInventoryJson(inventory);
  const markdownA = inventoryModule.renderMigrationInventoryMarkdown(inventory);
  const markdownB = inventoryModule.renderMigrationInventoryMarkdown(inventory);
  assert.equal(jsonA, jsonB);
  assert.equal(markdownA, markdownB);
  assert.deepEqual(JSON.parse(jsonA), inventory);
  assert.match(markdownA, /42 logical records/);
  assert.match(markdownA, /111 canonical routes/);
  assert.match(markdownA, /IP_INFO_RETAINED_UNPUBLISHED/);
});

test("committed migration inventory artifacts match the generator", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  assert.equal(
    await readFile(new URL("../docs/architecture/repository-migration-inventory.json", import.meta.url), "utf8"),
    inventoryModule.renderMigrationInventoryJson(inventory),
  );
  assert.equal(
    await readFile(new URL("../docs/architecture/repository-migration-inventory.md", import.meta.url), "utf8"),
    inventoryModule.renderMigrationInventoryMarkdown(inventory),
  );
});
