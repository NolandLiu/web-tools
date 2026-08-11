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

const category = {
  schemaVersion: "0.1.0",
  id: "cat_network-ip",
  slug: "network-ip",
  order: 10,
  status: "published",
};

const tag = {
  schemaVersion: "0.1.0",
  id: "tag_private",
  slug: "private",
  status: "published",
};

test("Category, tag, and collection schemas keep concepts distinct", async () => {
  const { categorySchema, tagSchema, collectionSchema } = await loadSchemaModule();

  assert.equal(categorySchema.parse(category).id, "cat_network-ip");
  assert.equal(tagSchema.parse(tag).id, "tag_private");

  assert.throws(() => categorySchema.parse(tag), /cat_/);
  assert.throws(() => tagSchema.parse(category), /tag_/);

  const manual = collectionSchema.parse({
    schemaVersion: "0.1.0",
    id: "col_network-starters",
    slug: "network-starters",
    status: "published",
    mode: "manual",
    resourceIds: ["res_tool_ipv4-network", "res_tool_ipv6-network"],
  });
  assert.equal(manual.mode, "manual");

  const automatic = collectionSchema.parse({
    schemaVersion: "0.1.0",
    id: "col_private-tools",
    slug: "private-tools",
    status: "review",
    mode: "automatic",
    rules: [{ field: "tagId", operator: "equals", value: "tag_private" }],
  });
  assert.equal(automatic.rules[0].field, "tagId");

  const hybrid = collectionSchema.parse({
    schemaVersion: "0.1.0",
    id: "col_network-hybrid",
    slug: "network-hybrid",
    status: "draft",
    mode: "hybrid",
    resourceIds: ["res_tool_ipv4-network"],
    rules: [{ field: "categoryId", operator: "equals", value: "cat_network-ip" }],
  });
  assert.equal(hybrid.mode, "hybrid");
});

test("Category graph rejects cycles, unknown parents, and excessive depth", async () => {
  const { categorySetSchema } = await loadSchemaModule();

  assert.deepEqual(categorySetSchema.parse([
    { ...category, id: "cat_root", slug: "root" },
    { ...category, id: "cat_child", slug: "child", parentId: "cat_root" },
    { ...category, id: "cat_grandchild", slug: "grandchild", parentId: "cat_child" },
  ]).map((item) => item.id), ["cat_root", "cat_child", "cat_grandchild"]);

  assert.throws(() => categorySetSchema.parse([
    { ...category, id: "cat_a", slug: "a", parentId: "cat_b" },
    { ...category, id: "cat_b", slug: "b", parentId: "cat_a" },
  ]), /cycle/);

  assert.throws(() => categorySetSchema.parse([
    { ...category, id: "cat_orphan", slug: "orphan", parentId: "cat_missing" },
  ]), /unknown parentId/);

  assert.throws(() => categorySetSchema.parse([
    { ...category, id: "cat_a", slug: "a" },
    { ...category, id: "cat_b", slug: "b", parentId: "cat_a" },
    { ...category, id: "cat_c", slug: "c", parentId: "cat_b" },
    { ...category, id: "cat_d", slug: "d", parentId: "cat_c" },
  ]), /maximum category depth/);
});

test("Collection schemas reject duplicate membership and invalid mode fields", async () => {
  const { collectionSchema } = await loadSchemaModule();

  assert.throws(() => collectionSchema.parse({
    schemaVersion: "0.1.0",
    id: "col_duplicate",
    slug: "duplicate",
    status: "draft",
    mode: "manual",
    resourceIds: ["res_tool_ipv4-network", "res_tool_ipv4-network"],
  }), /duplicate resourceIds/);

  assert.throws(() => collectionSchema.parse({
    schemaVersion: "0.1.0",
    id: "col_manual_with_rules",
    slug: "manual-with-rules",
    status: "draft",
    mode: "manual",
    resourceIds: ["res_tool_ipv4-network"],
    rules: [{ field: "tagId", operator: "equals", value: "tag_private" }],
  }), /rules/);

  assert.throws(() => collectionSchema.parse({
    schemaVersion: "0.1.0",
    id: "col_auto_with_members",
    slug: "auto-with-members",
    status: "draft",
    mode: "automatic",
    resourceIds: ["res_tool_ipv4-network"],
    rules: [{ field: "tagId", operator: "equals", value: "tag_private" }],
  }), /resourceIds/);

  assert.throws(() => collectionSchema.parse({
    schemaVersion: "0.1.0",
    id: "col_bad_rule",
    slug: "bad-rule",
    status: "draft",
    mode: "automatic",
    rules: [{ field: "script", operator: "eval", value: "alert(1)" }],
  }), /field/);
});
