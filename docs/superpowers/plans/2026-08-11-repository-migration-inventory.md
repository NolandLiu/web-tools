# Repository Migration Inventory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a deterministic JSON migration inventory and matching Markdown review document for every current published page, compatibility route, and retained unpublished IP information capability.

**Architecture:** A build-time-only Node module imports current JavaScript registries and reads TSX/configuration sources through strict audit adapters. It constructs one validated in-memory model, renders JSON and Markdown from that model, and writes both only after validation succeeds. Existing runtime source remains authoritative and no application module imports the inventory.

**Tech Stack:** Node.js 22 ESM, repository JavaScript registries, Node built-in test runner, Markdown, JSON, React/TypeScript source inspection, npm scripts.

## Global Constraints

- Use the accepted source baseline `main@21c3eb8dab2205b5ea78ea7b53bf0fbd76bb81ee` until a separately approved baseline supersedes it.
- Inventory exactly 42 logical records at the accepted baseline: 37 published page objects, 4 compatibility routes, and 1 unpublished capability group.
- Inventory exactly 111 canonical localized routes and 12 localized legacy redirects at the accepted baseline.
- Treat Home as `site-projection`, categories as `category-projection`, and About, Privacy, Terms, and Contact as `public-info-page` with `migrationTarget: unresolved`.
- Keep `inventoryKey` and `targetIdCandidate` non-authoritative; this task does not allocate formal Catalog identities.
- Do not modify product runtime modules, public routes, content, SEO behavior, search behavior, analytics, Cloudflare configuration, or the approved Catalog model.
- Do not add npm dependencies or a new test framework.
- Do not include secrets, environment values, provider payloads, user input, or production request data in generated artifacts.
- Keep `tasks/` ignored and untracked.
- Do not commit without explicit local-commit approval. Do not push, create a PR, merge, or deploy without separate explicit approval.

## File Structure

- Create `scripts/generate-migration-inventory.mjs`: source extraction, model construction, validation, deterministic JSON/Markdown rendering, and CLI writing.
- Create `tests/migration-inventory.test.mjs`: model, ownership, exposure, route, security, and artifact-drift contracts.
- Create `docs/architecture/repository-migration-inventory.json`: machine-readable generated evidence.
- Create `docs/architecture/repository-migration-inventory.md`: generated human review report.
- Modify `package.json`: add only `inventory:generate`.
- Modify `docs/architecture/repository-migration-inventory-design.md`: mark the design implemented after verification.
- Modify `docs/planning/godeskhub-task-backlog.md`: record status, acceptance checks, findings, and actual evidence for `ARCH-P0-002`.
- Modify `docs/planning/godeskhub-platform-roadmap.md`: mark `ARCH-P0-002` completed and identify unresolved information-page typing as a later schema decision.
- Create ignored private task `tasks/ready/TASK-097-repository-migration-inventory.md`, then move it through `in-progress` to `completed` during execution.

## Planned Interfaces

`scripts/generate-migration-inventory.mjs` exports:

```js
export const INVENTORY_BASELINE;
export async function buildMigrationInventory(options = {});
export function validateMigrationInventory(inventory);
export function renderMigrationInventoryJson(inventory);
export function renderMigrationInventoryMarkdown(inventory);
export async function writeMigrationInventory(options = {});
```

The options contract is:

```js
{
  root?: string,
  outputDirectory?: string,
}
```

`buildMigrationInventory()` returns:

```js
{
  schemaVersion: 1,
  baseline: {
    sourceCommit: "21c3eb8dab2205b5ea78ea7b53bf0fbd76bb81ee",
    evidenceDate: "2026-08-11",
  },
  summary: {
    logicalItems: 42,
    publishedItems: 37,
    redirectItems: 4,
    unpublishedItems: 1,
    canonicalRoutes: 111,
    localizedRedirects: 12,
  },
  items: [],
  findings: [],
}
```

---

### Task 0: Establish a Safe Execution Baseline

**Files:**
- Create: `tasks/ready/TASK-097-repository-migration-inventory.md` (ignored)
- Move during execution: `tasks/ready/...` → `tasks/in-progress/...` → `tasks/completed/...`
- Inspect only: `AGENTS.md`, `package.json`, current Git state, and `tasks/`

**Interfaces:**
- Consumes: approved `ARCH-P0-002` design and next continuous private task ID.
- Produces: one ignored authority record for `TASK-097` and a clean isolated implementation branch.

- [ ] **Step 1: Re-read governance and confirm the next private ID**

Run:

```bash
sed -n '1,260p' AGENTS.md
find tasks -type f -name 'TASK-*.md' -print | sed -E 's/.*TASK-([0-9]+).*/\1/' | sort -n | tail -20
find tasks -type f -name 'TASK-097-*.md' -print
```

Expected: the highest allocated ID is `096`, and no `TASK-097` file exists. If another task allocated `097`, stop and use the next continuous ID consistently throughout this plan.

- [ ] **Step 2: Confirm the planning worktree can be separated safely**

Run:

```bash
git status --short --branch
git branch --show-current
git log --oneline -10
git diff --name-only main -- package.json package-lock.json src scripts public functions wrangler.toml .github index.html
```

Expected before implementation: the planning branch contains documentation only, and the product/configuration diff is empty. If the planning documents remain uncommitted, stop and request explicit commit/integration direction; do not create a new implementation branch or move those edits.

- [ ] **Step 3: Create the ignored execution task after the workspace is safe**

Create `tasks/ready/TASK-097-repository-migration-inventory.md` with this frontmatter and required sections:

```yaml
---
id: TASK-097
type: tech-debt
title: Generate repository migration inventory
status: ready
priority: P0
parent: null
depends_on: []
program_refs:
  - ARCH-P0-002
created: 2026-08-11
updated: 2026-08-11
owner: codex
---
```

The file must record the approved design path, exact scope, non-goals, acceptance checklist, implementation log, verification evidence, and status history. Do not paste secrets or private user data.

- [ ] **Step 4: Verify the task remains private**

Run:

```bash
git check-ignore -v tasks/ready/TASK-097-repository-migration-inventory.md
git ls-files 'tasks/**'
```

Expected: `git check-ignore` identifies the `tasks/` rule, and `git ls-files` prints nothing.

- [ ] **Step 5: Create the implementation branch from the latest safe main**

After the planning branch has been safely committed/integrated under separate approval:

```bash
git switch main
git fetch origin
git merge --ff-only origin/main
git switch -c feat/TASK-097-migration-inventory
```

Expected: the new branch starts from the latest safe `main`. Fetching, integrating, and branch creation require the applicable user authorization and must not overwrite local work.

- [ ] **Step 6: Move the task to `in-progress`**

Update `status`, `updated`, and status history, then move the ignored task file to `tasks/in-progress/`. Confirm only that file is `in-progress` for this implementation.

---

### Task 1: Define the Inventory Model and Structural Validation

**Files:**
- Create: `scripts/generate-migration-inventory.mjs`
- Create: `tests/migration-inventory.test.mjs`

**Interfaces:**
- Produces: `INVENTORY_BASELINE`, `buildMigrationInventory(options)`, and `validateMigrationInventory(inventory)`.
- Later tasks extend the same model; no task may introduce a second inventory representation.

- [ ] **Step 1: Write the failing module and baseline contract test**

Create `tests/migration-inventory.test.mjs` with:

```js
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
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
node --test tests/migration-inventory.test.mjs
```

Expected: FAIL because `scripts/generate-migration-inventory.mjs` does not exist.

- [ ] **Step 3: Add the model constructors and shape validator**

Create `scripts/generate-migration-inventory.mjs` with these constants and exports:

```js
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
  if (!condition) throw new Error(message);
}

export function validateMigrationInventory(inventory) {
  invariant(inventory.schemaVersion === 1, "inventory schemaVersion must be 1");
  invariant(JSON.stringify(inventory.baseline) === JSON.stringify(INVENTORY_BASELINE), "inventory baseline mismatch");
  invariant(Array.isArray(inventory.items), "inventory items must be an array");
  invariant(Array.isArray(inventory.findings), "inventory findings must be an array");
  const keys = inventory.items.map(item => item.inventoryKey);
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
```

- [ ] **Step 4: Run the focused test and confirm GREEN**

Run:

```bash
node --test tests/migration-inventory.test.mjs
```

Expected: 1 test passes, 0 fail.

- [ ] **Step 5: Review checkpoint and gated local commit**

Run `git diff --check` and review only the generator skeleton and focused test. After explicit local-commit approval:

```bash
git add scripts/generate-migration-inventory.mjs tests/migration-inventory.test.mjs
git commit -m "test(TASK-097): define migration inventory contract"
```

---

### Task 2: Generate Published Pages, Routes, and Candidate Identities

**Files:**
- Modify: `scripts/generate-migration-inventory.mjs`
- Modify: `tests/migration-inventory.test.mjs`

**Interfaces:**
- Consumes: `TOOLS`, `CATEGORIES`, `LANGUAGES`, `INFO_PAGES`, `buildPath`, `parsePath`, and `listCanonicalRoutes`.
- Produces: 37 `published-page` items, 111 canonical routes, and validated ADR-022 ID candidates for tools and categories.

- [ ] **Step 1: Add failing count, route, classification, and ID tests**

Append:

```js
test("published migration items cover every canonical page exactly once", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const published = inventory.items.filter(item => item.observedExposure === "published-page");
  assert.equal(published.length, 37);
  assert.deepEqual(inventory.summary, {
    logicalItems: 37,
    publishedItems: 37,
    redirectItems: 0,
    unpublishedItems: 0,
    canonicalRoutes: 111,
    localizedRedirects: 0,
  });
  assert.equal(published.filter(item => item.currentKind === "site-projection").length, 1);
  assert.equal(published.filter(item => item.currentKind === "tool-page").length, 27);
  assert.equal(published.filter(item => item.currentKind === "category-projection").length, 5);
  assert.equal(published.filter(item => item.currentKind === "public-info-page").length, 4);
  assert.equal(published.flatMap(item => item.localizedRoutes).length, 111);
});

test("current pages preserve approved migration classifications", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const json = inventory.items.find(item => item.inventoryKey === "tool:json");
  assert.equal(json.currentIdentity.registryId, "json");
  assert.equal(json.currentIdentity.slug, "json-tools");
  assert.equal(json.currentIdentity.toolBindingId, "json");
  assert.equal(json.targetIdCandidate, "res_tool_json");
  const privacy = inventory.items.find(item => item.inventoryKey === "info:privacy");
  assert.equal(privacy.migrationTarget, "unresolved");
  assert.equal(privacy.targetIdCandidate, null);
});
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run:

```bash
node --test tests/migration-inventory.test.mjs
```

Expected: the two new tests fail because the model has no published items.

- [ ] **Step 3: Implement published item constructors**

Import the current authorities:

```js
import { CATEGORIES, INFO_PAGES, LANGUAGES, TOOLS } from "../src/registry.js";
import { buildPath, listCanonicalRoutes, parsePath } from "../src/lib/routes.js";
```

Add constructors with these exact inventory keys and classifications:

```js
const localeRoutes = routeFactory => LANGUAGES.map(({ id: locale }) => {
  const route = routeFactory(locale);
  return { locale, path: buildPath(route) };
});

function buildPublishedItems() {
  return [
    {
      inventoryKey: "projection:home",
      currentKind: "site-projection",
      observedExposure: "published-page",
      currentIdentity: { registryId: "home", slug: null },
      localizedRoutes: localeRoutes(lang => ({ kind: "home", lang })),
      ownership: { routes: ["src/lib/routes.js"], rendering: ["src/App.tsx", "src/lib/static-content.js"] },
      coverage: {},
      migrationTarget: "projection",
      targetIdCandidate: null,
      notes: [],
    },
    ...TOOLS.map(tool => ({
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
      localizedRoutes: localeRoutes(lang => ({ kind: "tool", lang, toolId: tool.id })),
      ownership: { registry: ["src/registry.js"], routes: ["src/lib/routes.js"] },
      coverage: {},
      migrationTarget: "resource",
      targetIdCandidate: `res_tool_${tool.id}`,
      notes: [],
    })),
    ...CATEGORIES.map(category => ({
      inventoryKey: `category:${category.id}`,
      currentKind: "category-projection",
      observedExposure: "published-page",
      currentIdentity: { registryId: category.id, slug: category.slug },
      localizedRoutes: localeRoutes(lang => ({ kind: "category", lang, categoryId: category.id })),
      ownership: { registry: ["src/registry.js"], routes: ["src/lib/routes.js"] },
      coverage: {},
      migrationTarget: "category",
      targetIdCandidate: `cat_${category.id}`,
      notes: [],
    })),
    ...INFO_PAGES.map(page => ({
      inventoryKey: `info:${page.id}`,
      currentKind: "public-info-page",
      observedExposure: "published-page",
      currentIdentity: { registryId: page.id, slug: page.slug },
      localizedRoutes: localeRoutes(lang => ({ kind: "info", lang, page: page.id })),
      ownership: { registry: ["src/registry.js"], clientContent: ["src/App.tsx"], staticContent: ["src/lib/static-content.js"] },
      coverage: {},
      migrationTarget: "unresolved",
      targetIdCandidate: null,
      notes: ["Target entity type is not defined by ADR-023 v1."],
    })),
  ];
}
```

Calculate summary fields from `items` and route arrays rather than assigning the expected numbers as constants. Assert that every generated canonical path round-trips through `parsePath()` to the original route identity.

- [ ] **Step 4: Validate ADR-022 candidates and route uniqueness**

Use these exact patterns:

```js
const RESOURCE_ID_PATTERN = /^res_(website|tool|guide)_[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ENTITY_ID_PATTERN = /^(cat|tag|col|faq|rel)_[a-z0-9]+(?:-[a-z0-9]+)*$/;
```

Reject duplicate candidate IDs, duplicate registry IDs, duplicate slugs within their namespace, duplicate canonical paths, or any path that does not parse back to its item.

- [ ] **Step 5: Run focused and existing route tests**

Run:

```bash
node --test tests/migration-inventory.test.mjs tests/routes.test.mjs
```

Expected: all focused inventory and route tests pass.

- [ ] **Step 6: Review checkpoint and gated local commit**

After `git diff --check` and explicit local-commit approval:

```bash
git add scripts/generate-migration-inventory.mjs tests/migration-inventory.test.mjs
git commit -m "feat(TASK-097): inventory published routes and identities"
```

---

### Task 3: Resolve Content, SEO, Contract, and Implementation Ownership

**Files:**
- Modify: `scripts/generate-migration-inventory.mjs`
- Modify: `tests/migration-inventory.test.mjs`
- Read only: `src/content/*`, `src/lib/content.js`, `src/lib/seo.js`, `src/components/ToolWorkspace.tsx`, `src/tools/CalculatorTools.tsx`, `src/tools/*`

**Interfaces:**
- Consumes: `TOOL_CONTENT`, `CATEGORY_CONTENT`, `validateContentRegistry`, `TOOL_CONTRACTS`, `validateToolContracts`, and repository source text.
- Produces: complete `ownership` and boolean `coverage` fields for every published item.

- [ ] **Step 1: Add failing published coverage tests**

Append:

```js
test("every published tool has locale, content, FAQ, SEO, contract, and implementation coverage", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const tools = inventory.items.filter(item => item.currentKind === "tool-page");
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
  for (const item of inventory.items.filter(entry => entry.currentKind === "public-info-page")) {
    assert.deepEqual(item.ownership.clientContent, ["src/App.tsx"]);
    assert.deepEqual(item.ownership.staticContent, ["src/lib/static-content.js"]);
    assert.equal(item.coverage.locales, true);
    assert.equal(item.coverage.routes, true);
    assert.equal(item.coverage.seo, true);
  }
});
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run:

```bash
node --test tests/migration-inventory.test.mjs
```

Expected: FAIL because published items have empty coverage and incomplete ownership.

- [ ] **Step 3: Import content and contract authorities**

Add:

```js
import { CATEGORY_CONTENT, TOOL_CONTENT } from "../src/content/index.js";
import { validateContentRegistry } from "../src/lib/content.js";
import { getRouteMetadata } from "../src/lib/seo.js";
import { TOOL_CONTRACTS, validateToolContracts } from "../src/lib/tool-contracts.js";
```

Call both existing validators before constructing coverage. For each tool,
require all `LANGUAGES` keys, at least two FAQ entries per locale, one contract
whose ID/slug/category matches the registry, and route metadata for every
localized route.

- [ ] **Step 4: Add strict implementation ownership adapters**

Define the current implementation map:

```js
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
```

Read `src/components/ToolWorkspace.tsx` and require exactly one dispatch
condition for each registered kind and symbol. Read
`src/tools/CalculatorTools.tsx` and require one `case` for each registered
calculator subtype. Reject a registered kind not present in this adapter and
an adapter key not used by a registered tool.

- [ ] **Step 5: Record concrete content and algorithm ownership**

Use these current rules:

- `ipv4-network` and `ipv6-toolbox` content originates in `src/content/network-tool-content.js`;
- all other published tool locale content originates in the three `src/content/tool-content.*.js` files;
- category content originates in `src/content/category-content.js`;
- behavior contracts originate in `src/lib/tool-contracts.js`;
- SEO projection originates in `src/lib/seo.js`;
- static rendering originates in `src/lib/static-content.js`;
- tool implementations use the exact file from `KIND_IMPLEMENTATIONS` and record applicable shared `src/lib/*` algorithm modules from imports in that implementation file.

The adapter must verify each path exists before recording it.

- [ ] **Step 6: Run focused content, contract, SEO, and inventory tests**

Run:

```bash
node --test tests/migration-inventory.test.mjs tests/content.test.mjs tests/contracts.test.mjs tests/seo.test.mjs
```

Expected: all tests pass with no missing coverage or unresolved public tool binding.

- [ ] **Step 7: Review checkpoint and gated local commit**

After `git diff --check` and explicit local-commit approval:

```bash
git add scripts/generate-migration-inventory.mjs tests/migration-inventory.test.mjs
git commit -m "feat(TASK-097): map inventory ownership and bindings"
```

---

### Task 4: Classify Compatibility Routes, Unpublished Sources, and Findings

**Files:**
- Modify: `scripts/generate-migration-inventory.mjs`
- Modify: `tests/migration-inventory.test.mjs`
- Read only: `src/lib/routes.js`, `src/components/ToolWorkspace.tsx`, `src/tools/NetworkTools.tsx`, `src/content/network-tool-content.js`, `src/lib/network-ip.js`, `functions/api/network/*`, `public/_routes.json`, and related tests

**Interfaces:**
- Consumes: `LEGACY_TOOL_REDIRECTS`, `listLegacyRedirects`, and current unpublished implementation/configuration sources.
- Produces: 4 `redirect-only` items, 1 `unpublished-source` item, 12 localized redirects, and structured warning findings.

- [ ] **Step 1: Add failing compatibility and unpublished-capability tests**

Append:

```js
test("compatibility routes remain separate from canonical resources", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const redirects = inventory.items.filter(item => item.observedExposure === "redirect-only");
  assert.equal(redirects.length, 4);
  assert.equal(redirects.flatMap(item => item.localizedRoutes).length, 12);
  assert.ok(redirects.every(item => item.currentKind === "compatibility-route"));
  assert.ok(redirects.every(item => item.migrationTarget === "projection"));
});

test("retained IP information code is inventoried without becoming public", async () => {
  const inventory = await inventoryModule.buildMigrationInventory();
  const item = inventory.items.find(entry => entry.inventoryKey === "unpublished:ip-info");
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
  assert.ok(inventory.findings.some(item => item.code === "INFO_PAGE_TARGET_UNRESOLVED" && item.severity === "warning"));
  assert.ok(inventory.findings.some(item => item.code === "INFO_PAGE_CONTENT_OWNERSHIP_SPLIT" && item.severity === "warning"));
  assert.ok(inventory.findings.some(item => item.code === "IP_INFO_RETAINED_UNPUBLISHED" && item.severity === "warning"));
});
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run:

```bash
node --test tests/migration-inventory.test.mjs
```

Expected: FAIL because redirect and unpublished items do not exist.

- [ ] **Step 3: Build one logical item per legacy slug**

Group `listLegacyRedirects()` by the four keys in `LEGACY_TOOL_REDIRECTS`.
Each item uses:

```js
{
  inventoryKey: `redirect:${legacySlug}`,
  currentKind: "compatibility-route",
  observedExposure: "redirect-only",
  currentIdentity: { legacySlug, targetToolId, anchor, status: 301 },
  localizedRoutes: [
    { locale, from, to, status: 301 },
  ],
  ownership: { routes: ["src/lib/routes.js"], output: ["scripts/generate-static-pages.mjs"] },
  coverage: { target: true, locales: true, redirectStatus: true },
  migrationTarget: "projection",
  targetIdCandidate: null,
  notes: ["Compatibility URL; excluded from canonical metadata and Sitemap."],
}
```

Require each redirect target to resolve to a published tool, each locale to
appear once, and every status to equal `301`.

- [ ] **Step 4: Build the unpublished IP information capability**

Create one item with these owned paths:

```js
{
  component: ["src/tools/NetworkTools.tsx"],
  clientContract: ["src/lib/network-ip.js", "src/lib/network-ip.d.ts"],
  content: ["src/content/network-tool-content.js"],
  functions: [
    "functions/api/network/ip-lookup.js",
    "functions/api/network/ip-rdap.js",
  ],
  tests: [
    "tests/network-ip.test.mjs",
    "tests/privacy-quality.test.mjs",
    "tests/routes.test.mjs",
    "tests/static-content.test.mjs",
  ],
}
```

Require `ip-info` to be absent from `TOOLS`, `TOOL_CONTENT`, canonical routes,
legacy redirects, `searchTools()` results, generated Sitemap inputs, and
`public/_routes.json` includes. Require both Function source files to exist.

- [ ] **Step 5: Add structured findings**

Use this exact shape:

```js
{
  code: "INFO_PAGE_TARGET_UNRESOLVED",
  severity: "warning",
  inventoryKeys: ["info:about", "info:privacy", "info:terms", "info:contact"],
  sources: ["src/registry.js", "src/App.tsx", "src/lib/static-content.js"],
  remediationOwner: "future Catalog schema decision",
  message: "Public information pages have no approved ADR-023 v1 target entity type.",
}
```

Also emit `INFO_PAGE_CONTENT_OWNERSHIP_SPLIT`,
`IP_INFO_RETAINED_UNPUBLISHED`, `CONTENT_OWNERSHIP_DISTRIBUTED`, and
`TARGET_IDS_NOT_ALLOCATED`. Sort findings by `code`.

- [ ] **Step 6: Add secret and path-safety validation**

Validate all recorded paths are repository-relative, contain no `..`, and do
not point to `.env`, credentials, generated caches, or user data. Reject
serialized keys or values matching:

```js
/(?:api[_-]?key|access[_-]?token|client[_-]?secret|authorization|bearer|account_id|credential)/i
```

Apply the scan to generated inventory evidence, not to quoted source content;
this avoids treating the legitimate Password Generator resource name as a
credential leak.

- [ ] **Step 7: Run focused privacy, route, and inventory tests**

Run:

```bash
node --test tests/migration-inventory.test.mjs tests/privacy-quality.test.mjs tests/routes.test.mjs tests/static-content.test.mjs
```

Expected: all tests pass; the public route and Cloudflare include boundary remains unchanged.

- [ ] **Step 8: Review checkpoint and gated local commit**

After `git diff --check` and explicit local-commit approval:

```bash
git add scripts/generate-migration-inventory.mjs tests/migration-inventory.test.mjs
git commit -m "feat(TASK-097): classify compatibility and unpublished sources"
```

---

### Task 5: Render Deterministic JSON and Markdown Artifacts

**Files:**
- Modify: `scripts/generate-migration-inventory.mjs`
- Modify: `tests/migration-inventory.test.mjs`
- Modify: `package.json`
- Create: `docs/architecture/repository-migration-inventory.json`
- Create: `docs/architecture/repository-migration-inventory.md`

**Interfaces:**
- Consumes: the validated in-memory inventory from Tasks 1–4.
- Produces: `renderMigrationInventoryJson`, `renderMigrationInventoryMarkdown`, `writeMigrationInventory`, `npm run inventory:generate`, and two byte-stable artifacts.

- [ ] **Step 1: Add failing deterministic renderer tests**

Append:

```js
import { readFile } from "node:fs/promises";

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
```

- [ ] **Step 2: Run the focused tests and confirm RED**

Run:

```bash
node --test tests/migration-inventory.test.mjs
```

Expected: FAIL because renderer exports and committed outputs do not exist.

- [ ] **Step 3: Implement byte-stable renderers**

Use two-space JSON indentation and one final newline:

```js
export function renderMigrationInventoryJson(inventory) {
  validateMigrationInventory(inventory);
  return `${JSON.stringify(inventory, null, 2)}\n`;
}
```

`renderMigrationInventoryMarkdown()` must render, in fixed order:

1. title and baseline;
2. summary table;
3. published tools;
4. site, category, and information pages;
5. compatibility redirects;
6. unpublished capability;
7. structured findings.

Escape Markdown pipes and line breaks in cell values. Do not include a current
clock timestamp, absolute local filesystem path, or Git worktree name.

- [ ] **Step 4: Implement validate-then-write CLI behavior**

Add:

```js
import { rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

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
```

Run the CLI only when `process.argv[1]` resolves to `import.meta.url`; importing
the module in tests must not write files.

- [ ] **Step 5: Add the package command**

Modify only the scripts object:

```json
"inventory:generate": "node scripts/generate-migration-inventory.mjs"
```

Do not add dependencies or alter `build`, `test`, or `verify`. The new test is
already included by `tests/*.test.mjs`.

- [ ] **Step 6: Generate the two artifacts**

Run:

```bash
npm run inventory:generate
```

Expected: both files are created, JSON parses, Markdown contains every table,
and the command exits 0.

- [ ] **Step 7: Run focused drift tests twice**

Run:

```bash
node --test tests/migration-inventory.test.mjs
npm run inventory:generate
node --test tests/migration-inventory.test.mjs
```

Expected: both test runs pass and the second generation produces no Git diff.

- [ ] **Step 8: Review checkpoint and gated local commit**

After checking both generated files for secrets, private content, absolute
paths, and duplicated records, and after explicit local-commit approval:

```bash
git add package.json scripts/generate-migration-inventory.mjs tests/migration-inventory.test.mjs docs/architecture/repository-migration-inventory.json docs/architecture/repository-migration-inventory.md
git commit -m "docs(TASK-097): generate repository migration inventory"
```

---

### Task 6: Close Documentation and Private Task State

**Files:**
- Modify: `docs/architecture/repository-migration-inventory-design.md`
- Modify: `docs/planning/godeskhub-task-backlog.md`
- Modify: `docs/planning/godeskhub-platform-roadmap.md`
- Modify and move ignored: `tasks/in-progress/TASK-097-repository-migration-inventory.md`

**Interfaces:**
- Consumes: actual generated counts, findings, and verification results.
- Produces: completed `ARCH-P0-002` and `TASK-097` evidence without changing runtime authority.

- [ ] **Step 1: Update the design status without rewriting approved decisions**

Change only the status line to:

```text
- Status: Implemented and verified
```

Add an implementation evidence section linking the two generated outputs and
recording the actual task ID.

- [ ] **Step 2: Complete the program backlog record**

Set:

```text
Completed — Migration Inventory Generated
```

Convert the two existing acceptance criteria to checked boxes, add checked
criteria for exposure classification and deterministic artifacts, and record
actual command results and finding codes. Do not paste the complete private
task brief.

- [ ] **Step 3: Update the roadmap execution order**

Mark `ARCH-P0-002` completed in the Next 10 Tasks section. Add one concise note
that public information-page target typing remains unresolved and is input to
the later schema work; do not create an unapproved new program task.

- [ ] **Step 4: Complete the private task record**

Check every acceptance item, record the exact test count and build route count,
append status history, set `status: completed`, update the date, and move the
file to `tasks/completed/`.

- [ ] **Step 5: Verify documentation and task privacy**

Run:

```bash
rg -n 'TODO|TBD|placeholder text|待补充|待完善|待補充' docs/architecture/repository-migration-inventory* docs/planning/godeskhub-task-backlog.md docs/planning/godeskhub-platform-roadmap.md
git check-ignore -v tasks/completed/TASK-097-repository-migration-inventory.md
git ls-files 'tasks/**'
git diff --check
```

Expected: no placeholders, the private task is ignored, no task file is tracked,
and diff checking passes.

- [ ] **Step 6: Review checkpoint and gated local commit**

After explicit local-commit approval:

```bash
git add docs/architecture/repository-migration-inventory-design.md docs/planning/godeskhub-task-backlog.md docs/planning/godeskhub-platform-roadmap.md
git commit -m "docs(TASK-097): record migration inventory evidence"
```

---

### Task 7: Run Full Verification and Audit the Final Scope

**Files:**
- Verify only: all changed tracked files
- Update ignored: `tasks/completed/TASK-097-repository-migration-inventory.md` with final command evidence

**Interfaces:**
- Consumes: all previous tasks.
- Produces: final evidence that generated inventory is correct and product behavior is unchanged.

- [ ] **Step 1: Re-read scripts from `package.json`**

Run:

```bash
node -e "const p=require('./package.json'); console.log(JSON.stringify(p.scripts, null, 2))"
```

Expected: `inventory:generate`, `lint`, `test`, `typecheck`, `build`,
`verify:build`, and `verify` exist; no dependency changed.

- [ ] **Step 2: Run the generator and required project checks**

Run each separately and record its exit status:

```bash
npm run inventory:generate
npm run lint
npm run test
npm run build
npm run verify
```

Expected: every command exits 0. Record the actual test count rather than
predicting it, and confirm build/verify still report 111 canonical pages.

- [ ] **Step 3: Prove deterministic artifacts and exact counts**

Run:

```bash
npm run inventory:generate
node --test tests/migration-inventory.test.mjs
node --input-type=module -e "import { buildMigrationInventory } from './scripts/generate-migration-inventory.mjs'; const value=await buildMigrationInventory(); console.log(JSON.stringify(value.summary));"
```

Expected summary:

```json
{"logicalItems":42,"publishedItems":37,"redirectItems":4,"unpublishedItems":1,"canonicalRoutes":111,"localizedRedirects":12}
```

If the accepted source has intentionally changed, stop and review whether a
new baseline is required instead of editing expected numbers to make tests pass.

- [ ] **Step 4: Audit privacy and generated content**

Run:

```bash
rg -n 'API_KEY|TOKEN|SECRET|Authorization|Bearer|account_id|credential|/Users/|/home/' docs/architecture/repository-migration-inventory.json docs/architecture/repository-migration-inventory.md
```

Expected: no matches. A match is a release blocker until the source and
generator are corrected; do not merely delete generated evidence by hand.

- [ ] **Step 5: Prove the product runtime diff is empty**

Run:

```bash
git diff --name-only main -- src public functions wrangler.toml index.html vite.config.*
git diff -- package-lock.json
```

Expected: no output. `package.json` may differ only by the new
`inventory:generate` script.

- [ ] **Step 6: Review final Git scope**

Run:

```bash
git status --short --branch
git diff --stat
git diff --check
git diff -- package.json scripts/generate-migration-inventory.mjs tests/migration-inventory.test.mjs docs/architecture/repository-migration-inventory.json docs/architecture/repository-migration-inventory.md docs/architecture/repository-migration-inventory-design.md docs/planning/godeskhub-task-backlog.md docs/planning/godeskhub-platform-roadmap.md
```

Confirm no generated cache, `dist`, `tasks/`, credential, user data, or
unrelated file is staged or committed.

- [ ] **Step 7: Final local commit gate**

If any approved implementation file remains uncommitted, stop and request
explicit local-commit approval. After approval, stage only the reviewed files,
run `git diff --cached --check`, and create the remaining task-scoped commit.

- [ ] **Step 8: Stop before remote publication**

Report the generated counts, warning findings, command results, changed files,
rollback method, current branch, and commit state. Do not push, create a PR,
merge, deploy, or change Cloudflare without another explicit approval.

## Self-Review Result

- Spec coverage: every approved design section maps to Tasks 1–7.
- Isolation: the generator and artifacts are build-time only; runtime modules remain untouched.
- Determinism: fixed baseline metadata, sorted records/findings, no current timestamp, and byte-comparison tests are explicit.
- Type consistency: all tasks use the same six exported generator interfaces and one inventory model.
- Privacy: paths are repository-relative and generated evidence excludes secrets, payloads, user input, and local absolute paths.
- Governance: `TASK-097`, clean-branch preflight, private-board checks, local commit gates, and remote-action gates are explicit.
- Remaining product decision: information-page target entity typing remains an intentional warning, not a hidden assumption.
