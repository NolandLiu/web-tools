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
