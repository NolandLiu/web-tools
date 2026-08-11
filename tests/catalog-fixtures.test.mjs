import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
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

async function listYamlFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const childUrl = new URL(`${entry.name}${entry.isDirectory() ? "/" : ""}`, directoryUrl);
    if (entry.isDirectory()) {
      return listYamlFiles(childUrl);
    }
    return entry.isFile() && entry.name.endsWith(".yml") ? [childUrl] : [];
  }));
  return files.flat();
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
  const pattern = /API_KEY|TOKEN|SECRET|Authorization|Bearer|password\s*[:=]|credential|8\.8\.8\.8|real cashflow|真实|真實/u;
  const matches = [];

  for (const fileUrl of await listYamlFiles(new URL("../catalog/", import.meta.url))) {
    const content = await readFile(fileUrl, "utf8");
    const lines = content.split(/\r?\n/u);
    lines.forEach((line, index) => {
      if (pattern.test(line)) {
        matches.push(`${fileUrl.pathname}:${index + 1}:${line}`);
      }
    });
  }

  assert.deepEqual(matches, []);
});

test("repository Catalog fixture privacy scan does not depend on ripgrep being installed", async () => {
  const source = await readFile(new URL("catalog-fixtures.test.mjs", import.meta.url), "utf8");
  assert.doesNotMatch(source, /execFileAsync\("rg"/);
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
