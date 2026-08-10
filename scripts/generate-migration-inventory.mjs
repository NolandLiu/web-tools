import { existsSync, readFileSync } from "node:fs";
import { CATEGORIES, INFO_PAGES, LANGUAGES, TOOLS } from "../src/registry.js";
import { CATEGORY_CONTENT, TOOL_CONTENT } from "../src/content/index.js";
import { validateContentRegistry } from "../src/lib/content.js";
import { buildPath, listCanonicalRoutes, parsePath } from "../src/lib/routes.js";
import { getRouteMetadata } from "../src/lib/seo.js";
import { TOOL_CONTRACTS, validateToolContracts } from "../src/lib/tool-contracts.js";

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

const KIND_IMPLEMENTATIONS = {
  unit: { symbol: "UnitTool", file: "src/tools/UnitTool.tsx" },
  json: { symbol: "JsonTool", file: "src/tools/TextTools.tsx" },
  base64: { symbol: "Base64Tool", file: "src/tools/TextTools.tsx" },
  url: { symbol: "UrlTool", file: "src/tools/TextTools.tsx" },
  uuid: { symbol: "UuidTool", file: "src/tools/TextTools.tsx" },
  timestamp: { symbol: "TimestampTool", file: "src/tools/TextTools.tsx" },
  case: { symbol: "CaseTool", file: "src/tools/TextTools.tsx" },
  text: { symbol: "TextTool", file: "src/tools/TextTools.tsx" },
  color: { symbol: "ColorTool", file: "src/tools/TextTools.tsx" },
  calculator: { symbol: "CalculatorTool", file: "src/tools/CalculatorTools.tsx" },
  cheque: { symbol: "ChequeTool", file: "src/tools/ChequeTool.tsx" },
  irr: { symbol: "IrrTool", file: "src/tools/IrrTool.tsx" },
  password: { symbol: "PasswordTool", file: "src/tools/PasswordTool.tsx" },
  qr: { symbol: "QrTool", file: "src/tools/QrTool.tsx" },
  "ipv4-network": { symbol: "Ipv4NetworkToolbox", file: "src/tools/NetworkTools.tsx" },
  "ipv6-toolbox": { symbol: "Ipv6Toolbox", file: "src/tools/NetworkTools.tsx" },
};

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

function validatePathExists(path) {
  invariant(!path.includes(".."), `unsafe ownership path: ${path}`);
  invariant(existsSync(path), `ownership path does not exist: ${path}`);
  return path;
}

function validatePaths(paths) {
  return paths.map(validatePathExists);
}

function assertToolWorkspaceBinding(tool) {
  const implementation = KIND_IMPLEMENTATIONS[tool.kind];
  invariant(implementation, `missing implementation adapter for ${tool.kind}`);
  validatePathExists(implementation.file);

  const source = readFileSync("src/components/ToolWorkspace.tsx", "utf8");
  const binding = `tool.kind === "${tool.kind}" && <${implementation.symbol}`;
  invariant(source.includes(binding), `missing ToolWorkspace binding for ${tool.kind}`);

  if (tool.kind === "calculator") {
    const calculatorSource = readFileSync("src/tools/CalculatorTools.tsx", "utf8");
    invariant(calculatorSource.includes(`case "${tool.calculator}"`), `missing calculator binding for ${tool.id}`);
  }

  return implementation;
}

function validateImplementationAdapters() {
  const registeredKinds = new Set(TOOLS.map((tool) => tool.kind));
  for (const kind of registeredKinds) {
    invariant(KIND_IMPLEMENTATIONS[kind], `registered kind has no adapter: ${kind}`);
  }
  for (const kind of Object.keys(KIND_IMPLEMENTATIONS)) {
    invariant(registeredKinds.has(kind), `implementation adapter is not used by a registered tool: ${kind}`);
  }
}

function contentOwnershipForTool(toolId) {
  return toolId === "ipv4-network" || toolId === "ipv6-toolbox"
    ? ["src/content/network-tool-content.js"]
    : ["src/content/tool-content.en.js", "src/content/tool-content.zh-cn.js", "src/content/tool-content.zh-tw.js"];
}

function hasLocalizedToolCoverage(tool) {
  return LANGUAGES.every(({ id: lang }) => {
    const content = TOOL_CONTENT[tool.id]?.[lang];
    return content && content.summary && Array.isArray(content.faqs) && content.faqs.length >= 2;
  });
}

function hasLocalizedCategoryCoverage(category) {
  return LANGUAGES.every(({ id: lang }) => Boolean(CATEGORY_CONTENT[category.id]?.[lang]?.introduction));
}

function hasSeoCoverage(routeFactory) {
  return LANGUAGES.every(({ id: lang }) => {
    const metadata = getRouteMetadata(routeFactory(lang));
    return Boolean(metadata.title && metadata.description && metadata.canonical && metadata.jsonLd);
  });
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
  validateContentRegistry();
  validateToolContracts();
  validateImplementationAdapters();

  return [
    {
      inventoryKey: "projection:home",
      currentKind: "site-projection",
      observedExposure: "published-page",
      currentIdentity: { registryId: "home", slug: null },
      localizedRoutes: localizedRoutes((lang) => ({ kind: "home", lang })),
      ownership: {
        routes: validatePaths(["src/lib/routes.js"]),
        rendering: validatePaths(["src/App.tsx", "src/lib/static-content.js"]),
        seo: validatePaths(["src/lib/seo.js"]),
      },
      coverage: { locales: true, routes: true, seo: hasSeoCoverage((lang) => ({ kind: "home", lang })) },
      migrationTarget: "projection",
      targetIdCandidate: null,
      notes: [],
    },
    ...TOOLS.map((tool) => {
      const implementation = assertToolWorkspaceBinding(tool);
      const categoryExists = CATEGORIES.some((category) => category.id === tool.category);
      const contentPaths = contentOwnershipForTool(tool.id);
      return {
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
        ownership: {
          registry: validatePaths(["src/registry.js"]),
          routes: validatePaths(["src/lib/routes.js"]),
          content: validatePaths(contentPaths),
          seo: validatePaths(["src/lib/seo.js"]),
          contract: validatePaths(["src/lib/tool-contracts.js"]),
          implementation: validatePaths([implementation.file]),
        },
        coverage: {
          locales: LANGUAGES.every(({ id: lang }) => Boolean(tool.text[lang])),
          content: hasLocalizedToolCoverage(tool),
          faq: LANGUAGES.every(({ id: lang }) => TOOL_CONTENT[tool.id]?.[lang]?.faqs?.length >= 2),
          seo: hasSeoCoverage((lang) => ({ kind: "tool", lang, toolId: tool.id })),
          routes: true,
          contract: TOOL_CONTRACTS[tool.id]?.slug === tool.slug,
          implementation: true,
          category: categoryExists,
        },
        migrationTarget: "resource",
        targetIdCandidate: `res_tool_${tool.id}`,
        notes: [],
      };
    }),
    ...CATEGORIES.map((category) => ({
      inventoryKey: `category:${category.id}`,
      currentKind: "category-projection",
      observedExposure: "published-page",
      currentIdentity: { registryId: category.id, slug: category.slug },
      localizedRoutes: localizedRoutes((lang) => ({ kind: "category", lang, categoryId: category.id })),
      ownership: {
        registry: validatePaths(["src/registry.js"]),
        routes: validatePaths(["src/lib/routes.js"]),
        content: validatePaths(["src/content/category-content.js"]),
        seo: validatePaths(["src/lib/seo.js"]),
      },
      coverage: {
        locales: LANGUAGES.every(({ id: lang }) => Boolean(category.text[lang])),
        content: hasLocalizedCategoryCoverage(category),
        seo: hasSeoCoverage((lang) => ({ kind: "category", lang, categoryId: category.id })),
        routes: true,
      },
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
        registry: validatePaths(["src/registry.js"]),
        clientContent: validatePaths(["src/App.tsx"]),
        staticContent: validatePaths(["src/lib/static-content.js"]),
        routes: validatePaths(["src/lib/routes.js"]),
        seo: validatePaths(["src/lib/seo.js"]),
      },
      coverage: {
        locales: LANGUAGES.every(({ id: lang }) => Boolean(page.text[lang])),
        routes: true,
        seo: hasSeoCoverage((lang) => ({ kind: "info", lang, page: page.id })),
      },
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
