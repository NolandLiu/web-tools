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

test("repository Catalog fixtures validate and preserve publication states", async () => {
  const { loadCatalog, validateCatalogGraph } = await loadSchemaModule();
  const catalogRoot = new URL("../catalog", import.meta.url);

  const catalog = await loadCatalog({ rootDir: catalogRoot.pathname });
  const graphDiagnostics = validateCatalogGraph(catalog, {
    toolBindingResolver: {
      hasToolBinding: (toolBindingId) => [
        "ipv4-network-toolbox",
        "irr-calculator",
        "password-generator",
      ].includes(toolBindingId),
    },
  });

  assert.equal(catalog.ok, true);
  assert.deepEqual(graphDiagnostics, []);
  assert.deepEqual(catalog.records.resources.map((resource) => resource.id), [
    "res_tool_ip-lookup",
    "res_tool_ip-whois-rdap",
    "res_tool_ipv4-network",
    "res_tool_irr-calculator",
    "res_tool_password-generator",
  ]);
  assert.deepEqual(catalog.records.resources.map((resource) => [resource.id, resource.status]), [
    ["res_tool_ip-lookup", "hidden"],
    ["res_tool_ip-whois-rdap", "hidden"],
    ["res_tool_ipv4-network", "published"],
    ["res_tool_irr-calculator", "published"],
    ["res_tool_password-generator", "published"],
  ]);
  assert.equal(catalog.records.locales.length, 15);
  assert(catalog.records.faqs.length >= 2);
  assert(catalog.records.relations.length >= 1);
  assert(catalog.records.health.length >= 3);
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
