import { existsSync, readFileSync } from "node:fs";
import { rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { CATEGORIES, INFO_PAGES, LANGUAGES, TOOLS } from "../src/registry.js";
import { CATEGORY_CONTENT, TOOL_CONTENT } from "../src/content/index.js";
import { validateContentRegistry } from "../src/lib/content.js";
import {
  buildPath,
  LEGACY_TOOL_REDIRECTS,
  listCanonicalRoutes,
  listLegacyRedirects,
  parsePath,
} from "../src/lib/routes.js";
import { getRouteMetadata } from "../src/lib/seo.js";
import { searchTools } from "../src/lib/search.js";
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
const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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
  invariant(!path.startsWith(".env"), `unsafe ownership path: ${path}`);
  invariant(!/credential|secret|token|cache/i.test(path), `unsafe ownership path: ${path}`);
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

function buildCompatibilityItems() {
  const redirects = listLegacyRedirects();
  return Object.entries(LEGACY_TOOL_REDIRECTS).map(([legacySlug, redirect]) => {
    const localizedRoutesForSlug = LANGUAGES.map((language) => {
      const from = `/${language.path}/tools/${legacySlug}`;
      const route = redirects.find((item) => item.from === from);
      invariant(route, `missing legacy redirect for ${legacySlug}.${language.id}`);
      invariant(route.status === 301, `legacy redirect must be 301 for ${legacySlug}.${language.id}`);
      const parsedTarget = parsePath(route.to.split("#")[0]);
      invariant(
        parsedTarget.kind === "tool" && parsedTarget.toolId === redirect.toolId,
        `legacy redirect target mismatch for ${legacySlug}.${language.id}`,
      );
      invariant(route.to.endsWith(`#${redirect.anchor}`), `legacy redirect anchor mismatch for ${legacySlug}.${language.id}`);
      return { locale: language.id, from: route.from, to: route.to, status: route.status };
    });

    return {
      inventoryKey: `redirect:${legacySlug}`,
      currentKind: "compatibility-route",
      observedExposure: "redirect-only",
      currentIdentity: { legacySlug, targetToolId: redirect.toolId, anchor: redirect.anchor, status: 301 },
      localizedRoutes: localizedRoutesForSlug,
      ownership: {
        routes: validatePaths(["src/lib/routes.js"]),
        output: validatePaths(["scripts/generate-static-pages.mjs"]),
      },
      coverage: { target: true, locales: true, redirectStatus: true },
      migrationTarget: "projection",
      targetIdCandidate: null,
      notes: ["Compatibility URL; excluded from canonical metadata and Sitemap."],
    };
  });
}

function buildUnpublishedIpInfoItem() {
  const routesConfig = JSON.parse(readFileSync("public/_routes.json", "utf8"));
  const canonicalPaths = listCanonicalRoutes().map((route) => buildPath(route));
  const legacyPaths = listLegacyRedirects().flatMap((route) => [route.from, route.to]);
  const searchResults = LANGUAGES.flatMap(({ id: lang }) => searchTools("IP lookup RDAP WHOIS", lang, 50));

  const coverage = {
    publicRegistry: !TOOLS.some((tool) => tool.id === "ip-info" || tool.kind === "ip-info"),
    canonicalRoutes: !canonicalPaths.some((path) => path.includes("ip-info")),
    legacyRedirects: !legacyPaths.some((path) => /ip-info|ip-lookup|ip-whois-rdap/.test(path)),
    search: !searchResults.some((result) => result.toolId === "ip-info"),
    cloudflareInclude: !routesConfig.include.includes("/api/network/ip-lookup")
      && !routesConfig.include.includes("/api/network/ip-rdap"),
  };

  invariant(Object.values(coverage).every((value) => value === true), "unpublished IP information leaked into public projections");

  return {
    inventoryKey: "unpublished:ip-info",
    currentKind: "unpublished-capability",
    observedExposure: "unpublished-source",
    currentIdentity: { registryId: "ip-info", slug: "ip-info-lookup", public: false },
    localizedRoutes: [],
    ownership: {
      component: validatePaths(["src/tools/NetworkTools.tsx"]),
      clientContract: validatePaths(["src/lib/network-ip.js", "src/lib/network-ip.d.ts"]),
      content: validatePaths(["src/content/network-tool-content.js"]),
      functions: validatePaths([
        "functions/api/network/ip-lookup.js",
        "functions/api/network/ip-rdap.js",
      ]),
      tests: validatePaths([
        "tests/network-ip.test.mjs",
        "tests/privacy-quality.test.mjs",
        "tests/routes.test.mjs",
        "tests/static-content.test.mjs",
      ]),
    },
    coverage: {
      publicRegistry: false,
      canonicalRoutes: false,
      legacyRedirects: false,
      search: false,
      cloudflareInclude: false,
      retainedSource: true,
    },
    migrationTarget: "unresolved",
    targetIdCandidate: null,
    notes: ["Implementation and tests are retained but not published."],
  };
}

function buildFindings() {
  return [
    {
      code: "CONTENT_OWNERSHIP_DISTRIBUTED",
      severity: "warning",
      inventoryKeys: ["tool:ipv4-network", "tool:ipv6-toolbox"],
      sources: ["src/content/index.js", "src/content/network-tool-content.js"],
      remediationOwner: "future Catalog content migration",
      message: "Some tool content is distributed across specialized content modules.",
    },
    {
      code: "INFO_PAGE_CONTENT_OWNERSHIP_SPLIT",
      severity: "warning",
      inventoryKeys: ["info:about", "info:privacy", "info:terms", "info:contact"],
      sources: ["src/App.tsx", "src/lib/static-content.js"],
      remediationOwner: "future public information page migration",
      message: "Public information page body ownership is split between client and static rendering sources.",
    },
    {
      code: "INFO_PAGE_TARGET_UNRESOLVED",
      severity: "warning",
      inventoryKeys: ["info:about", "info:privacy", "info:terms", "info:contact"],
      sources: ["src/registry.js", "src/App.tsx", "src/lib/static-content.js"],
      remediationOwner: "future Catalog schema decision",
      message: "Public information pages have no approved ADR-023 v1 target entity type.",
    },
    {
      code: "IP_INFO_RETAINED_UNPUBLISHED",
      severity: "warning",
      inventoryKeys: ["unpublished:ip-info"],
      sources: [
        "src/tools/NetworkTools.tsx",
        "functions/api/network/ip-lookup.js",
        "functions/api/network/ip-rdap.js",
      ],
      remediationOwner: "future network provider decision",
      message: "IP information lookup implementation and tests remain in source while the public page and API routes stay unpublished.",
    },
    {
      code: "TARGET_IDS_NOT_ALLOCATED",
      severity: "warning",
      inventoryKeys: ["projection:home", "tool:json", "category:units"],
      sources: ["docs/adr/ADR-022-identifier-slug-locale-task-naming.md"],
      remediationOwner: "future Catalog identity allocation",
      message: "Inventory target ID candidates are suggestions and are not formal Catalog allocations.",
    },
  ].sort((left, right) => left.code.localeCompare(right.code));
}

function validateSerializedEvidence(inventory) {
  const serialized = JSON.stringify(inventory);
  invariant(
    !/(?:api[_-]?key|access[_-]?token|client[_-]?secret|authorization|bearer|account_id|credential)/i.test(serialized),
    "generated inventory evidence contains sensitive-looking text",
  );
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

  validateUnique(
    inventory.items
      .filter((item) => item.observedExposure === "redirect-only")
      .flatMap((item) => item.localizedRoutes.map((route) => route.from)),
    "legacy redirect source path",
  );
  validateSerializedEvidence(inventory);

  return inventory;
}

export async function buildMigrationInventory() {
  const items = [
    ...buildPublishedItems(),
    ...buildCompatibilityItems(),
    buildUnpublishedIpInfoItem(),
  ];
  const inventory = {
    schemaVersion: 1,
    baseline: { ...INVENTORY_BASELINE },
    summary: buildSummary(items),
    items,
    findings: buildFindings(),
  };

  return validateMigrationInventory(inventory);
}

export function renderMigrationInventoryJson(inventory) {
  validateMigrationInventory(inventory);
  return `${JSON.stringify(inventory, null, 2)}\n`;
}

function markdownCell(value) {
  return String(value ?? "")
    .replaceAll("|", "\\|")
    .replaceAll("\n", "<br>");
}

function markdownList(values) {
  if (!Array.isArray(values) || values.length === 0) return "";
  return values.map(markdownCell).join("<br>");
}

function renderTable(headers, rows) {
  return [
    `| ${headers.map(markdownCell).join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.map(markdownCell).join(" | ")} |`),
  ].join("\n");
}

export function renderMigrationInventoryMarkdown(inventory) {
  validateMigrationInventory(inventory);

  const tools = inventory.items.filter((item) => item.currentKind === "tool-page");
  const publicPages = inventory.items.filter((item) => item.currentKind !== "tool-page"
    && item.observedExposure === "published-page");
  const redirects = inventory.items.filter((item) => item.observedExposure === "redirect-only");
  const unpublished = inventory.items.filter((item) => item.observedExposure === "unpublished-source");

  const lines = [
    "# Repository Migration Inventory",
    "",
    "## Baseline",
    "",
    `- Source commit: \`${inventory.baseline.sourceCommit}\``,
    `- Evidence date: \`${inventory.baseline.evidenceDate}\``,
    `- Summary: ${inventory.summary.logicalItems} logical records, ${inventory.summary.canonicalRoutes} canonical routes, ${inventory.summary.localizedRedirects} localized redirects.`,
    "",
    "## Summary",
    "",
    renderTable(
      ["Logical records", "Published", "Redirect-only", "Unpublished", "Canonical routes", "Localized redirects"],
      [[
        inventory.summary.logicalItems,
        inventory.summary.publishedItems,
        inventory.summary.redirectItems,
        inventory.summary.unpublishedItems,
        inventory.summary.canonicalRoutes,
        inventory.summary.localizedRedirects,
      ]],
    ),
    "",
    "## Published Tools",
    "",
    renderTable(
      ["Inventory key", "Registry ID", "Slug", "Kind", "Category", "Target candidate", "Routes"],
      tools.map((item) => [
        item.inventoryKey,
        item.currentIdentity.registryId,
        item.currentIdentity.slug,
        item.currentIdentity.kind,
        item.currentIdentity.categoryId,
        item.targetIdCandidate,
        markdownList(item.localizedRoutes.map((route) => route.path)),
      ]),
    ),
    "",
    "## Published Projections And Information Pages",
    "",
    renderTable(
      ["Inventory key", "Current kind", "Registry ID", "Migration target", "Target candidate", "Routes"],
      publicPages.map((item) => [
        item.inventoryKey,
        item.currentKind,
        item.currentIdentity.registryId,
        item.migrationTarget,
        item.targetIdCandidate,
        markdownList(item.localizedRoutes.map((route) => route.path)),
      ]),
    ),
    "",
    "## Compatibility Redirects",
    "",
    renderTable(
      ["Inventory key", "Legacy slug", "Target tool", "Anchor", "Routes"],
      redirects.map((item) => [
        item.inventoryKey,
        item.currentIdentity.legacySlug,
        item.currentIdentity.targetToolId,
        item.currentIdentity.anchor,
        markdownList(item.localizedRoutes.map((route) => `${route.from} -> ${route.to} (${route.status})`)),
      ]),
    ),
    "",
    "## Unpublished Sources",
    "",
    renderTable(
      ["Inventory key", "Registry ID", "Migration target", "Functions", "Notes"],
      unpublished.map((item) => [
        item.inventoryKey,
        item.currentIdentity.registryId,
        item.migrationTarget,
        markdownList(item.ownership.functions),
        markdownList(item.notes),
      ]),
    ),
    "",
    "## Findings",
    "",
    renderTable(
      ["Code", "Severity", "Inventory keys", "Sources", "Remediation owner", "Message"],
      inventory.findings.map((finding) => [
        finding.code,
        finding.severity,
        markdownList(finding.inventoryKeys),
        markdownList(finding.sources),
        finding.remediationOwner,
        finding.message,
      ]),
    ),
    "",
  ];

  return `${lines.join("\n").trimEnd()}\n`;
}

export async function writeMigrationInventory({
  root = DEFAULT_ROOT,
  outputDirectory,
} = {}) {
  const inventory = await buildMigrationInventory({ root });
  const directory = outputDirectory ?? resolve(root, "docs/architecture");
  const json = renderMigrationInventoryJson(inventory);
  const markdown = renderMigrationInventoryMarkdown(inventory);
  const jsonTemporary = resolve(directory, "repository-migration-inventory.json.tmp");
  const markdownTemporary = resolve(directory, "repository-migration-inventory.md.tmp");
  const jsonTarget = resolve(directory, "repository-migration-inventory.json");
  const markdownTarget = resolve(directory, "repository-migration-inventory.md");

  await writeFile(jsonTemporary, json);
  await writeFile(markdownTemporary, markdown);
  await rename(jsonTemporary, jsonTarget);
  await rename(markdownTemporary, markdownTarget);

  return { inventory, json, markdown };
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await writeMigrationInventory();
}
