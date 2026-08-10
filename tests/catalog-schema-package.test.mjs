import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const workspaceRoot = new URL("../", import.meta.url);

async function runNpm(args) {
  return execFileAsync("npm", args, {
    cwd: workspaceRoot,
    env: { ...process.env, FORCE_COLOR: "0" },
    maxBuffer: 1024 * 1024 * 4,
  });
}

test("Catalog schema package builds and exposes a Node-importable smoke schema", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../packages/catalog-schema/package.json", import.meta.url), "utf8"),
  );

  assert.equal(packageJson.name, "@godeskhub/catalog-schema");
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.type, "module");
  assert.equal(packageJson.exports["."].import, "./dist/index.js");
  assert.equal(packageJson.exports["."].types, "./dist/index.d.ts");

  await runNpm(["run", "build", "--workspace", "@godeskhub/catalog-schema"]);

  const schemaModule = await import("../packages/catalog-schema/dist/index.js");
  assert.equal(schemaModule.CATALOG_SCHEMA_VERSION, "0.1.0");

  const parsed = schemaModule.smokeSchema.parse({
    schemaVersion: "0.1.0",
    id: "res_tool_ipv4-network",
  });

  assert.deepEqual(parsed, {
    schemaVersion: "0.1.0",
    id: "res_tool_ipv4-network",
  });
});

test("Catalog schema package dependency review is documented", async () => {
  const guide = await readFile(
    new URL("../docs/architecture/catalog-schema-developer-guide.md", import.meta.url),
    "utf8",
  );

  for (const requiredText of [
    "Zod",
    "4.4.3",
    "MIT",
    "runtime schema validation",
    "does not send data over the network",
  ]) {
    assert.match(guide, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
