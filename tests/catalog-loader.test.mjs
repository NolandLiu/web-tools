import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
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
  const rootDir = await mkdtemp(join(tmpdir(), "gdh-catalog-loader-"));
  for (const [relativePath, contents] of Object.entries(files)) {
    const fullPath = join(rootDir, relativePath);
    await execFileAsync("mkdir", ["-p", fullPath.split("/").slice(0, -1).join("/")]);
    await writeFile(fullPath, contents, "utf8");
  }
  return rootDir;
}

const validResourceYaml = `
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

const validCategoryYaml = `
schemaVersion: 0.1.0
id: cat_network-ip
slug: network-ip
status: published
order: 10
`;

const validTagYaml = `
schemaVersion: 0.1.0
id: tag_private
slug: private
status: published
`;

const validCollectionYaml = `
schemaVersion: 0.1.0
id: col_network-starters
slug: network-starters
status: published
mode: manual
resourceIds:
  - res_tool_ipv4-network
`;

const validFaqYaml = `
schemaVersion: 0.1.0
id: faq_ipv4-subnet-basics
status: published
placements:
  - resourceId: res_tool_ipv4-network
    order: 1
locales:
  - locale: en
    question: What is a subnet?
    answer: A subnet groups IP addresses under one prefix.
  - locale: zh-CN
    question: 什么是子网？
    answer: 子网把一组 IP 地址归入同一个前缀。
  - locale: zh-TW
    question: 什麼是子網？
    answer: 子網把一組 IP 位址歸入同一個前綴。
`;

const validRelationYaml = `
schemaVersion: 0.1.0
id: rel_ipv4-to-ipv6
type: related
sourceId: res_tool_ipv4-network
targetId: res_tool_guide-network-basics
order: 1
`;

const validHealthYaml = `
schemaVersion: 0.1.0
id: health_ipv4-binding
resourceId: res_tool_ipv4-network
checkType: tool-binding
status: healthy
checkedAt: "2026-08-11T00:00:00.000Z"
evidence: Catalog fixture binding check passed.
`;

test("loadCatalog exposes sorted typed collections with stable semantics", async () => {
  const { loadCatalog } = await loadSchemaModule();
  const rootDir = await createCatalogFixture({
    "taxonomy/categories/cat_network-ip.yml": validCategoryYaml,
    "resources/res_tool_ipv4-network.yml": validResourceYaml,
    "taxonomy/tags/tag_private.yml": validTagYaml,
    "collections/col_network-starters.yml": validCollectionYaml,
    "faq/faq_ipv4-subnet-basics.yml": validFaqYaml,
    "relations/rel_ipv4-to-ipv6.yml": validRelationYaml,
    "health/health_ipv4-binding.yml": validHealthYaml,
  });

  const catalog = await loadCatalog({ rootDir });

  assert.equal(catalog.ok, true);
  assert.deepEqual(catalog.diagnostics, []);
  assert.deepEqual(Object.keys(catalog.records), [
    "categories",
    "collections",
    "faqs",
    "health",
    "locales",
    "relations",
    "resources",
    "tags",
  ]);
  assert.deepEqual(catalog.records.resources.map((item) => item.id), ["res_tool_ipv4-network"]);
  assert.deepEqual(catalog.records.categories.map((item) => item.id), ["cat_network-ip"]);
  assert.deepEqual(catalog.records.tags.map((item) => item.id), ["tag_private"]);
  assert.deepEqual(catalog.records.collections.map((item) => item.id), ["col_network-starters"]);
  assert.deepEqual(catalog.records.faqs.map((item) => item.id), ["faq_ipv4-subnet-basics"]);
  assert.deepEqual(catalog.records.relations.map((item) => item.id), ["rel_ipv4-to-ipv6"]);
  assert.deepEqual(catalog.records.health.map((item) => item.id), ["health_ipv4-binding"]);
});

test("loadCatalog normalizes output independent of source file ordering", async () => {
  const { loadCatalog } = await loadSchemaModule();
  const rootDir = await createCatalogFixture({
    "resources/res_tool_z-last.yml": validResourceYaml.replaceAll("res_tool_ipv4-network", "res_tool_z-last").replace("ipv4-network-toolbox", "z-last"),
    "resources/res_tool_a-first.yml": validResourceYaml.replaceAll("res_tool_ipv4-network", "res_tool_a-first").replace("ipv4-network-toolbox", "a-first"),
  });

  const catalog = await loadCatalog({ rootDir });

  assert.equal(catalog.ok, true);
  assert.deepEqual(catalog.records.resources.map((item) => item.id), [
    "res_tool_a-first",
    "res_tool_z-last",
  ]);
});

test("loadCatalog returns source-scoped diagnostics for malformed YAML and schema errors", async () => {
  const { loadCatalog } = await loadSchemaModule();
  const rootDir = await createCatalogFixture({
    "resources/res_tool_bad-yaml.yml": "schemaVersion: [",
    "resources/res_tool_bad-schema.yml": validResourceYaml.replace("canonicalSlug: ipv4-network-toolbox", "canonicalSlug: IPv4 Network Toolbox"),
  });

  const catalog = await loadCatalog({ rootDir });

  assert.equal(catalog.ok, false);
  assert.equal(catalog.records.resources.length, 0);
  assert.equal(catalog.diagnostics.length, 2);
  assert.deepEqual(catalog.diagnostics.map((item) => item.sourcePath).sort(), [
    "resources/res_tool_bad-schema.yml",
    "resources/res_tool_bad-yaml.yml",
  ]);
  assert(catalog.diagnostics.some((item) => item.code === "yaml-parse-error"));
  assert(catalog.diagnostics.some((item) => item.code === "schema-error" && item.path.includes("canonicalSlug")));
  assert(!catalog.diagnostics.some((item) => item.message.includes(process.cwd())));
});
