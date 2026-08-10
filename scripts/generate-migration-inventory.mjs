import { CATEGORIES, INFO_PAGES, LANGUAGES, TOOLS } from "../src/registry.js";
import { buildPath, listCanonicalRoutes, parsePath } from "../src/lib/routes.js";

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
const RESOURCE_ID_PATTERN = /^res_(website|tool|guide)_[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ENTITY_ID_PATTERN = /^(cat|tag|col|faq|rel)_[a-z0-9]+(?:-[a-z0-9]+)*$/;

function invariant(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function sameRoute(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function validateUnique(values, label) {
  invariant(new Set(values).size === values.length, `duplicate ${label}`);
}

function validateTargetIdCandidate(candidate, inventoryKey) {
  if (candidate === null) return;
  invariant(
    RESOURCE_ID_PATTERN.test(candidate) || ENTITY_ID_PATTERN.test(candidate),
    `invalid targetIdCandidate for ${inventoryKey}`,
  );
}

function localizedRoutes(routeFactory) {
  return LANGUAGES.map(({ id: locale }) => {
    const route = routeFactory(locale);
    const path = buildPath(route);
    const parsed = parsePath(path);
    invariant(sameRoute(parsed, route), `route does not round-trip: ${path}`);
    return { locale, path };
  });
}

function buildPublishedItems() {
  return [
    {
      inventoryKey: "projection:home",
      currentKind: "site-projection",
      observedExposure: "published-page",
      currentIdentity: { registryId: "home", slug: null },
      localizedRoutes: localizedRoutes((lang) => ({ kind: "home", lang })),
      ownership: { routes: ["src/lib/routes.js"], rendering: ["src/App.tsx", "src/lib/static-content.js"] },
      coverage: { locales: true, routes: true },
      migrationTarget: "projection",
      targetIdCandidate: null,
      notes: [],
    },
    ...TOOLS.map((tool) => ({
      inventoryKey: `tool:${tool.id}`,
      currentKind: "tool-page",
      observedExposure: "published-page",
      currentIdentity: {
        registryId: tool.id,
        slug: tool.slug,
        toolBindingId: tool.id,
        kind: tool.kind,
        categoryId: tool.category,
        order: tool.order,
      },
      localizedRoutes: localizedRoutes((lang) => ({ kind: "tool", lang, toolId: tool.id })),
      ownership: { registry: ["src/registry.js"], routes: ["src/lib/routes.js"] },
      coverage: { routes: true },
      migrationTarget: "resource",
      targetIdCandidate: `res_tool_${tool.id}`,
      notes: [],
    })),
    ...CATEGORIES.map((category) => ({
      inventoryKey: `category:${category.id}`,
      currentKind: "category-projection",
      observedExposure: "published-page",
      currentIdentity: { registryId: category.id, slug: category.slug },
      localizedRoutes: localizedRoutes((lang) => ({ kind: "category", lang, categoryId: category.id })),
      ownership: { registry: ["src/registry.js"], routes: ["src/lib/routes.js"] },
      coverage: { locales: true, routes: true },
      migrationTarget: "category",
      targetIdCandidate: `cat_${category.id}`,
      notes: [],
    })),
    ...INFO_PAGES.map((page) => ({
      inventoryKey: `info:${page.id}`,
      currentKind: "public-info-page",
      observedExposure: "published-page",
      currentIdentity: { registryId: page.id, slug: page.slug },
      localizedRoutes: localizedRoutes((lang) => ({ kind: "info", lang, page: page.id })),
      ownership: {
        registry: ["src/registry.js"],
        clientContent: ["src/App.tsx"],
        staticContent: ["src/lib/static-content.js"],
      },
      coverage: { locales: true, routes: true },
      migrationTarget: "unresolved",
      targetIdCandidate: null,
      notes: ["Target entity type is not defined by ADR-023 v1."],
    })),
  ];
}

function buildSummary(items) {
  const canonicalRoutes = items
    .filter((item) => item.observedExposure === "published-page")
    .flatMap((item) => item.localizedRoutes);
  const localizedRedirects = items
    .filter((item) => item.observedExposure === "redirect-only")
    .flatMap((item) => item.localizedRoutes);

  return {
    logicalItems: items.length,
    publishedItems: items.filter((item) => item.observedExposure === "published-page").length,
    redirectItems: items.filter((item) => item.observedExposure === "redirect-only").length,
    unpublishedItems: items.filter((item) => item.observedExposure === "unpublished-source").length,
    canonicalRoutes: canonicalRoutes.length,
    localizedRedirects: localizedRedirects.length,
  };
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
  validateUnique(keys, "inventoryKey");
  validateUnique(TOOLS.map((tool) => tool.id), "tool registry ID");
  validateUnique(TOOLS.map((tool) => tool.slug), "tool slug");
  validateUnique(CATEGORIES.map((category) => category.id), "category registry ID");
  validateUnique(CATEGORIES.map((category) => category.slug), "category slug");
  validateUnique(INFO_PAGES.map((page) => page.id), "information page registry ID");
  validateUnique(INFO_PAGES.map((page) => page.slug), "information page slug");

  for (const item of inventory.items) {
    invariant(CURRENT_KINDS.has(item.currentKind), `invalid currentKind for ${item.inventoryKey}`);
    invariant(EXPOSURES.has(item.observedExposure), `invalid observedExposure for ${item.inventoryKey}`);
    invariant(MIGRATION_TARGETS.has(item.migrationTarget), `invalid migrationTarget for ${item.inventoryKey}`);
    invariant(Array.isArray(item.localizedRoutes), `localizedRoutes missing for ${item.inventoryKey}`);
    invariant(item.ownership && typeof item.ownership === "object", `ownership missing for ${item.inventoryKey}`);
    invariant(item.coverage && typeof item.coverage === "object", `coverage missing for ${item.inventoryKey}`);
    validateTargetIdCandidate(item.targetIdCandidate, item.inventoryKey);
  }

  validateUnique(
    inventory.items
      .map((item) => item.targetIdCandidate)
      .filter((candidate) => candidate !== null),
    "targetIdCandidate",
  );

  const canonicalPaths = inventory.items
    .filter((item) => item.observedExposure === "published-page")
    .flatMap((item) => item.localizedRoutes.map((route) => route.path));
  validateUnique(canonicalPaths, "canonical path");
  invariant(canonicalPaths.length === listCanonicalRoutes().length, "canonical route count mismatch");

  return inventory;
}

export async function buildMigrationInventory() {
  const items = buildPublishedItems();
  const inventory = {
    schemaVersion: 1,
    baseline: { ...INVENTORY_BASELINE },
    summary: buildSummary(items),
    items,
    findings: [],
  };

  return validateMigrationInventory(inventory);
}
