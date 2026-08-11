import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const workspaceRoot = new URL("../", import.meta.url);

async function loadSchemaModule() {
  await execFileAsync("npm", ["run", "build", "--workspace", "@godeskhub/catalog-schema"], {
    cwd: workspaceRoot,
    env: { ...process.env, FORCE_COLOR: "0" },
    maxBuffer: 1024 * 1024 * 4,
  });
  return import(`../packages/catalog-schema/dist/index.js?cache=${Date.now()}`);
}

async function createCatalogFixture(files) {
  const rootDir = await mkdtemp(join(tmpdir(), "gdh-catalog-invalid-"));
  for (const [relativePath, contents] of Object.entries(files)) {
    const fullPath = join(rootDir, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, contents, "utf8");
  }
  return rootDir;
}

const category = `
schemaVersion: 0.1.0
id: cat_network-ip
slug: network-ip
status: published
order: 1
`;

const resource = `
schemaVersion: 0.1.0
id: res_tool_ipv4-network
type: tool
canonicalSlug: ipv4-network-toolbox
status: published
createdAt: "2026-08-11T00:00:00.000Z"
updatedAt: "2026-08-11T00:00:00.000Z"
toolBindingId: ipv4-network-toolbox
primaryCategoryId: cat_network-ip
`;

function locale(localeCode) {
  return `
resourceId: res_tool_ipv4-network
locale: ${localeCode}
name: IPv4 network ${localeCode}
summary: Summary ${localeCode}
seoTitle: Title ${localeCode}
seoDescription: Description ${localeCode}
searchAliases: []
searchKeywords: []
`;
}

function validBase(overrides = {}) {
  return {
    "taxonomy/categories/cat_network-ip.yml": category,
    "resources/res_tool_ipv4-network.yml": resource,
    "locales/res_tool_ipv4-network.en.yml": locale("en"),
    "locales/res_tool_ipv4-network.zh-CN.yml": locale("zh-CN"),
    "locales/res_tool_ipv4-network.zh-TW.yml": locale("zh-TW"),
    ...overrides,
  };
}

async function validateFiles(files) {
  const { loadCatalog, validateCatalogGraph } = await loadSchemaModule();
  const rootDir = await createCatalogFixture(files);
  const catalog = await loadCatalog({ rootDir });
  const graphDiagnostics = catalog.ok
    ? validateCatalogGraph(catalog, {
      toolBindingResolver: {
        hasToolBinding: (id) => id === "ipv4-network-toolbox",
      },
    })
    : [];
  return [...catalog.diagnostics, ...graphDiagnostics];
}

const invalidCases = [
  {
    name: "duplicate authority file",
    expectedCode: "layout-error",
    expectedSource: ".",
    files: validBase({
      "resources/res_tool_ipv4-network.yaml": resource,
    }),
  },
  {
    name: "duplicate resource id across different authority files",
    expectedCode: "duplicate-resource-id",
    expectedSource: "resources/res_tool_other.yml",
    files: validBase({
      "resources/res_tool_other.yml": resource.replace("canonicalSlug: ipv4-network-toolbox", "canonicalSlug: other-tool"),
    }),
  },
  {
    name: "invalid slug",
    expectedCode: "schema-error",
    expectedSource: "resources/res_tool_ipv4-network.yml",
    files: validBase({
      "resources/res_tool_ipv4-network.yml": resource.replace("canonicalSlug: ipv4-network-toolbox", "canonicalSlug: Invalid Slug"),
    }),
  },
  {
    name: "invalid website URL",
    expectedCode: "schema-error",
    expectedSource: "resources/res_website_bad-url.yml",
    files: {
      "resources/res_website_bad-url.yml": `
schemaVersion: 0.1.0
id: res_website_bad-url
type: website
canonicalSlug: bad-url
status: published
createdAt: "2026-08-11T00:00:00.000Z"
updatedAt: "2026-08-11T00:00:00.000Z"
destinationUrl: javascript:alert(1)
`,
    },
  },
  {
    name: "invalid status",
    expectedCode: "schema-error",
    expectedSource: "resources/res_tool_ipv4-network.yml",
    files: validBase({
      "resources/res_tool_ipv4-network.yml": resource.replace("status: published", "status: live"),
    }),
  },
  {
    name: "unknown taxonomy",
    expectedCode: "unknown-primary-category",
    expectedSource: "resources/res_tool_ipv4-network.yml",
    files: validBase({
      "resources/res_tool_ipv4-network.yml": resource.replace("primaryCategoryId: cat_network-ip", "primaryCategoryId: cat_missing"),
    }),
  },
  {
    name: "missing relation target",
    expectedCode: "unknown-relation-target",
    expectedSource: "relations/rel_missing-target.yml",
    files: validBase({
      "relations/rel_missing-target.yml": `
schemaVersion: 0.1.0
id: rel_missing-target
type: related
sourceId: res_tool_ipv4-network
targetId: res_tool_missing
`,
    }),
  },
  {
    name: "missing locale",
    expectedCode: "missing-resource-locale",
    expectedSource: "resources/res_tool_ipv4-network.yml",
    files: {
      ...validBase(),
      "locales/res_tool_ipv4-network.zh-TW.yml": undefined,
    },
  },
  {
    name: "invalid tool binding",
    expectedCode: "unknown-tool-binding",
    expectedSource: "resources/res_tool_ipv4-network.yml",
    files: validBase({
      "resources/res_tool_ipv4-network.yml": resource.replace("toolBindingId: ipv4-network-toolbox", "toolBindingId: missing-binding"),
    }),
  },
  {
    name: "category cycle",
    expectedCode: "category-cycle",
    expectedSource: "taxonomy/categories/cat_network-ip.yml",
    files: validBase({
      "taxonomy/categories/cat_network-ip.yml": category.replace("order: 1", "parentId: cat_network-ip\norder: 1"),
    }),
  },
  {
    name: "unsafe evidence string",
    expectedCode: "schema-error",
    expectedSource: "health/health_unsafe.yml",
    files: validBase({
      "health/health_unsafe.yml": `
schemaVersion: 0.1.0
id: health_unsafe
resourceId: res_tool_ipv4-network
checkType: content-review
status: warning
checkedAt: "2026-08-11T00:00:00.000Z"
evidence: API_KEY sample value
`,
    }),
  },
];

for (const invalidCase of invalidCases) {
  test(`invalid Catalog fixture: ${invalidCase.name}`, async () => {
    const files = Object.fromEntries(
      Object.entries(invalidCase.files).filter(([, contents]) => contents !== undefined),
    );
    const diagnostics = await validateFiles(files);

    assert(
      diagnostics.some((diagnostic) => diagnostic.code === invalidCase.expectedCode
        && diagnostic.sourcePath === invalidCase.expectedSource),
      `expected ${invalidCase.expectedCode} at ${invalidCase.expectedSource}, got ${JSON.stringify(diagnostics)}`,
    );
  });
}

test("invalid fixture examples are documented", async () => {
  const guide = await readFile(new URL("../tests/fixtures/catalog-invalid/README.md", import.meta.url), "utf8");

  for (const requiredText of [
    "duplicate authority file",
    "duplicate resource id",
    "invalid slug",
    "invalid website URL",
    "invalid status",
    "unknown taxonomy",
    "missing relation target",
    "missing locale",
    "invalid tool binding",
    "category cycle",
    "unsafe evidence string",
  ]) {
    assert.match(guide, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
