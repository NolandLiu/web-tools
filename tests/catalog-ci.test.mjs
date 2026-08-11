import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("package verification gates Catalog validation and artifact generation before frontend build", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

  assert.match(packageJson.scripts.test, /schema:build/);
  assert.match(packageJson.scripts.test, /--test-concurrency=1/);
  assert.match(packageJson.scripts.verify, /catalog:validate/);
  assert.match(packageJson.scripts.verify, /catalog:build/);
  assert(
    packageJson.scripts.verify.indexOf("npm run catalog:validate") < packageJson.scripts.verify.indexOf("npm run build"),
    "catalog:validate should run before frontend build",
  );
  assert(
    packageJson.scripts.verify.indexOf("npm run catalog:build") < packageJson.scripts.verify.indexOf("npm run build"),
    "catalog:build should run before frontend build",
  );
});

test("GitHub CI keeps read-only permissions and runs Catalog gates before frontend build", async () => {
  const workflow = await readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");

  assert.match(workflow, /permissions:\n\s+contents: read/);
  assert.doesNotMatch(workflow, /secrets:/);
  assert.doesNotMatch(workflow, /contents: write/);
  assert.match(workflow, /npm run catalog:validate/);
  assert.match(workflow, /npm run catalog:build/);
  assert(
    workflow.indexOf("npm run catalog:validate") < workflow.indexOf("npm run build"),
    "CI should validate Catalog before frontend build",
  );
  assert(
    workflow.indexOf("npm run catalog:build") < workflow.indexOf("npm run build"),
    "CI should build Catalog artifact before frontend build",
  );
});
