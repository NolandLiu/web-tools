import assert from "node:assert/strict";
import { execFile } from "node:child_process";
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

test("Catalog layout classifies authority and locale file paths", async () => {
  const { classifyCatalogPath } = await loadSchemaModule();

  assert.deepEqual(classifyCatalogPath("resources/res_tool_ipv4-network.yml"), {
    section: "resources",
    authorityId: "res_tool_ipv4-network",
    locale: null,
  });
  assert.deepEqual(classifyCatalogPath("taxonomy/categories/cat_network-ip.yml"), {
    section: "categories",
    authorityId: "cat_network-ip",
    locale: null,
  });
  assert.deepEqual(classifyCatalogPath("locales/res_tool_ipv4-network.zh-CN.yml"), {
    section: "locales",
    authorityId: "res_tool_ipv4-network",
    locale: "zh-CN",
  });
  assert.equal(classifyCatalogPath("README.md"), null);
  assert.equal(classifyCatalogPath("resources/.gitkeep"), null);
});

test("Catalog layout rejects unknown paths and duplicate authority files", async () => {
  const { validateCatalogLayoutPaths } = await loadSchemaModule();

  assert.deepEqual(validateCatalogLayoutPaths([
    "resources/res_tool_ipv4-network.yml",
    "taxonomy/categories/cat_network-ip.yml",
    "taxonomy/tags/tag_private.yml",
    "collections/col_network-starters.yml",
    "faq/faq_ipv4-subnet-basics.yml",
    "relations/rel_ipv4-to-ipv6.yml",
    "health/health_ipv4-binding.yml",
    "locales/res_tool_ipv4-network.en.yml",
    "locales/res_tool_ipv4-network.zh-CN.yml",
    "locales/res_tool_ipv4-network.zh-TW.yml",
  ]).map((item) => item.authorityId), [
    "res_tool_ipv4-network",
    "cat_network-ip",
    "tag_private",
    "col_network-starters",
    "faq_ipv4-subnet-basics",
    "rel_ipv4-to-ipv6",
    "health_ipv4-binding",
    "res_tool_ipv4-network",
    "res_tool_ipv4-network",
    "res_tool_ipv4-network",
  ]);

  assert.throws(() => validateCatalogLayoutPaths([
    "resources/res_tool_ipv4-network.yml",
    "resources/res_tool_ipv4-network.yaml",
  ]), /duplicate authority file/);

  assert.throws(() => validateCatalogLayoutPaths([
    "scratch/res_tool_ipv4-network.yml",
  ]), /unknown Catalog path/);
});

test("Catalog authoring guide documents public data and one authority record per ID", async () => {
  const { readFile } = await import("node:fs/promises");
  const guide = await readFile(new URL("../catalog/README.md", import.meta.url), "utf8");

  for (const requiredText of [
    "one authority record per ID",
    "public-content data only",
    "resources/",
    "taxonomy/categories/",
    "taxonomy/tags/",
    "collections/",
    "locales/",
    "faq/",
    "relations/",
    "health/",
  ]) {
    assert.match(guide, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
