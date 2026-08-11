import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

import { createToolBindingResolver, listToolCodeBindings } from "../src/tool-bindings.js";

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

test("repository Catalog fixtures validate and preserve publication states", async () => {
  const { loadCatalog, validateCatalogGraph } = await loadSchemaModule();
  const catalogRoot = new URL("../catalog", import.meta.url);
  const toolBindingResolver = createToolBindingResolver(listToolCodeBindings());

  const catalog = await loadCatalog({ rootDir: catalogRoot.pathname });
  const graphDiagnostics = validateCatalogGraph(catalog, { toolBindingResolver });

  assert.equal(catalog.ok, true);
  assert.deepEqual(graphDiagnostics, []);
  assert.equal(catalog.records.resources.filter((resource) => resource.type === "tool" && resource.status === "published").length, 27);
  assert.deepEqual(
    catalog.records.resources
      .filter((resource) => resource.status === "hidden")
      .map((resource) => [resource.id, resource.toolBindingId])
      .sort(),
    [
      ["res_tool_ip-lookup", "ip-info"],
      ["res_tool_ip-whois-rdap", "ip-rdap"],
    ],
  );
  assert.equal(catalog.records.locales.length, 87);
  assert(catalog.records.faqs.length >= 60);
  assert.equal(catalog.records.categories.length, 5);
  assert(catalog.records.health.length >= 29);
});

test("repository Catalog fixtures contain no obvious private or secret-like data", async () => {
  const { stdout } = await execFileAsync("rg", [
    "-n",
    "API_KEY|TOKEN|SECRET|Authorization|Bearer|password\\s*[:=]|credential|8\\.8\\.8\\.8|real cashflow|真实|真實",
    "--glob",
    "*.yml",
    "catalog",
  ], {
    cwd: workspaceRoot,
    env: { ...process.env, FORCE_COLOR: "0" },
    maxBuffer: 1024 * 1024 * 4,
  }).catch((error) => {
    if (error.code === 1) {
      return { stdout: "" };
    }
    throw error;
  });

  assert.equal(stdout, "");
});

test("catalog:validate validates the repository Catalog fixtures", async () => {
  const { stdout, stderr } = await execFileAsync("npm", ["run", "catalog:validate"], {
    cwd: workspaceRoot,
    env: { ...process.env, FORCE_COLOR: "0" },
    maxBuffer: 1024 * 1024 * 4,
  });

  assert.match(stdout, /Catalog validation passed/);
  assert.equal(stderr, "");
});
