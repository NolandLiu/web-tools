import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
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
  const rootDir = await mkdtemp(join(tmpdir(), "gdh-catalog-graph-"));
  for (const [relativePath, contents] of Object.entries(files)) {
    const fullPath = join(rootDir, relativePath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, contents, "utf8");
  }
  return rootDir;
}

function resourceYaml(id, options = {}) {
  const slug = options.slug ?? id.replace("res_tool_", "");
  const binding = options.binding ?? slug;
  const category = options.category ?? "cat_network-ip";
  return `
schemaVersion: 0.1.0
id: ${id}
type: tool
canonicalSlug: ${slug}
status: published
createdAt: "2026-08-11T00:00:00.000Z"
updatedAt: "2026-08-11T00:00:00.000Z"
toolBindingId: ${binding}
primaryCategoryId: ${category}
`;
}

function localeYaml(resourceId, locale) {
  return `
resourceId: ${resourceId}
locale: ${locale}
name: ${resourceId} ${locale}
summary: Summary for ${resourceId} ${locale}
seoTitle: Title for ${resourceId} ${locale}
seoDescription: Description for ${resourceId} ${locale}
searchAliases: []
searchKeywords: []
`;
}

const categoryYaml = `
schemaVersion: 0.1.0
id: cat_network-ip
slug: network-ip
status: published
order: 1
`;

const tagYaml = `
schemaVersion: 0.1.0
id: tag_private
slug: private
status: published
`;

test("validateCatalogGraph accepts a clean graph with an injected tool binding resolver", async () => {
  const { loadCatalog, validateCatalogGraph } = await loadSchemaModule();
  const rootDir = await createCatalogFixture({
    "resources/res_tool_ipv4-network.yml": resourceYaml("res_tool_ipv4-network", { slug: "ipv4-network", binding: "ipv4-network-toolbox" }),
    "taxonomy/categories/cat_network-ip.yml": categoryYaml,
    "locales/res_tool_ipv4-network.en.yml": localeYaml("res_tool_ipv4-network", "en"),
    "locales/res_tool_ipv4-network.zh-CN.yml": localeYaml("res_tool_ipv4-network", "zh-CN"),
    "locales/res_tool_ipv4-network.zh-TW.yml": localeYaml("res_tool_ipv4-network", "zh-TW"),
  });

  const catalog = await loadCatalog({ rootDir });
  const diagnostics = validateCatalogGraph(catalog, {
    toolBindingResolver: {
      hasToolBinding: (toolBindingId) => toolBindingId === "ipv4-network-toolbox",
    },
  });

  assert.equal(catalog.ok, true);
  assert.deepEqual(diagnostics, []);
});

test("validateCatalogGraph reports dedicated diagnostics for graph references and locales", async () => {
  const { loadCatalog, validateCatalogGraph } = await loadSchemaModule();
  const rootDir = await createCatalogFixture({
    "resources/res_tool_ipv4-network.yml": resourceYaml("res_tool_ipv4-network", { category: "cat_missing", binding: "missing-binding" }),
    "taxonomy/categories/cat_network-ip.yml": categoryYaml,
    "taxonomy/tags/tag_private.yml": tagYaml,
    "collections/col_bad-membership.yml": `
schemaVersion: 0.1.0
id: col_bad-membership
slug: bad-membership
status: published
mode: hybrid
resourceIds:
  - res_tool_missing
rules:
  - field: categoryId
    operator: equals
    value: cat_missing
  - field: tagId
    operator: equals
    value: tag_missing
`,
    "faq/faq_bad-placement.yml": `
schemaVersion: 0.1.0
id: faq_bad-placement
status: published
placements:
  - resourceId: res_tool_missing
    order: 1
locales:
  - locale: en
    question: Question?
    answer: Answer.
  - locale: zh-CN
    question: 问题？
    answer: 回答。
  - locale: zh-TW
    question: 問題？
    answer: 回答。
`,
    "relations/rel_bad-target.yml": `
schemaVersion: 0.1.0
id: rel_bad-target
type: related
sourceId: res_tool_ipv4-network
targetId: res_tool_missing
`,
    "health/health_bad-resource.yml": `
schemaVersion: 0.1.0
id: health_bad-resource
resourceId: res_tool_missing
checkType: tool-binding
status: warning
checkedAt: "2026-08-11T00:00:00.000Z"
evidence: Missing target resource.
`,
    "locales/res_tool_ipv4-network.en.yml": localeYaml("res_tool_ipv4-network", "en"),
  });

  const catalog = await loadCatalog({ rootDir });
  const diagnostics = validateCatalogGraph(catalog, {
    toolBindingResolver: {
      hasToolBinding: () => false,
    },
  });

  assert.equal(catalog.ok, true);
  const diagnosticCodes = diagnostics.map((item) => item.code);
  const diagnosticSignatures = diagnostics.map((item) => `${item.sourcePath}\t${item.code}\t${item.path}`);
  assert.deepEqual(diagnosticSignatures, [...diagnosticSignatures].sort());
  assert.deepEqual([...diagnosticCodes].sort(), [
    "unknown-collection-resource",
    "unknown-collection-rule-category",
    "unknown-collection-rule-tag",
    "unknown-faq-placement-resource",
    "unknown-health-resource",
    "unknown-primary-category",
    "unknown-relation-target",
    "unknown-tool-binding",
    "missing-resource-locale",
    "missing-resource-locale",
  ].sort());
  assert(diagnostics.every((item) => item.sourcePath.endsWith(".yml")));
  assert(diagnostics.every((item) => item.path.length > 0));
});

test("validateCatalogGraph rejects duplicate published tool bindings", async () => {
  const { loadCatalog, validateCatalogGraph } = await loadSchemaModule();
  const rootDir = await createCatalogFixture({
    "resources/res_tool_a.yml": resourceYaml("res_tool_a", { slug: "a", binding: "shared-binding" }),
    "resources/res_tool_b.yml": resourceYaml("res_tool_b", { slug: "b", binding: "shared-binding" }),
    "taxonomy/categories/cat_network-ip.yml": categoryYaml,
  });

  const catalog = await loadCatalog({ rootDir });
  const diagnostics = validateCatalogGraph(catalog, {
    toolBindingResolver: {
      hasToolBinding: () => true,
    },
  });

  assert(diagnostics.some((item) => item.code === "duplicate-tool-binding"));
});
