import assert from "node:assert/strict";
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
  assert.deepEqual(inventory.summary, {
    logicalItems: 37,
    publishedItems: 37,
    redirectItems: 0,
    unpublishedItems: 0,
    canonicalRoutes: 111,
    localizedRedirects: 0,
  });
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
