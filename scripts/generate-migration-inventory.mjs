export const INVENTORY_BASELINE = Object.freeze({
  sourceCommit: "21c3eb8dab2205b5ea78ea7b53bf0fbd76bb81ee",
  evidenceDate: "2026-08-11",
});

const CURRENT_KINDS = new Set([
  "site-projection",
  "tool-page",
  "category-projection",
  "public-info-page",
  "compatibility-route",
  "unpublished-capability",
]);

const EXPOSURES = new Set(["published-page", "redirect-only", "unpublished-source"]);
const MIGRATION_TARGETS = new Set(["resource", "category", "projection", "unresolved"]);

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function validateMigrationInventory(inventory) {
  invariant(inventory && typeof inventory === "object", "inventory must be an object");
  invariant(inventory.schemaVersion === 1, "inventory schemaVersion must be 1");
  invariant(
    JSON.stringify(inventory.baseline) === JSON.stringify(INVENTORY_BASELINE),
    "inventory baseline mismatch",
  );
  invariant(inventory.summary && typeof inventory.summary === "object", "inventory summary must be an object");
  invariant(Array.isArray(inventory.items), "inventory items must be an array");
  invariant(Array.isArray(inventory.findings), "inventory findings must be an array");

  const keys = inventory.items.map((item) => item.inventoryKey);
  invariant(new Set(keys).size === keys.length, "duplicate inventoryKey");

  for (const item of inventory.items) {
    invariant(CURRENT_KINDS.has(item.currentKind), `invalid currentKind for ${item.inventoryKey}`);
    invariant(EXPOSURES.has(item.observedExposure), `invalid observedExposure for ${item.inventoryKey}`);
    invariant(MIGRATION_TARGETS.has(item.migrationTarget), `invalid migrationTarget for ${item.inventoryKey}`);
    invariant(Array.isArray(item.localizedRoutes), `localizedRoutes missing for ${item.inventoryKey}`);
    invariant(item.ownership && typeof item.ownership === "object", `ownership missing for ${item.inventoryKey}`);
    invariant(item.coverage && typeof item.coverage === "object", `coverage missing for ${item.inventoryKey}`);
  }

  return inventory;
}

export async function buildMigrationInventory() {
  const inventory = {
    schemaVersion: 1,
    baseline: { ...INVENTORY_BASELINE },
    summary: {},
    items: [],
    findings: [],
  };

  return validateMigrationInventory(inventory);
}
