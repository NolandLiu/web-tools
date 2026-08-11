import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import test from "node:test";
import { createToolBindingResolver, listToolCodeBindings } from "../src/tool-bindings.js";

const execFileAsync = promisify(execFile);
const workspaceRoot = new URL("../", import.meta.url);
const artifactPath = new URL("../catalog/artifacts/catalog.normalized.v1.json", import.meta.url);

async function loadSchemaModule() {
  await execFileAsync("npm", ["run", "build", "--workspace", "@godeskhub/catalog-schema"], {
    cwd: workspaceRoot,
    env: { ...process.env, FORCE_COLOR: "0" },
    maxBuffer: 1024 * 1024 * 4,
  });
  return import(`../packages/catalog-schema/dist/index.js?cache=${Date.now()}`);
}

test("normalized Catalog artifact is byte-stable and checksum-stable", async () => {
  const {
    buildNormalizedCatalogArtifact,
    loadCatalog,
    serializeCatalogArtifact,
    validateCatalogGraph,
  } = await loadSchemaModule();
  const catalog = await loadCatalog({ rootDir: new URL("../catalog", import.meta.url).pathname });
  const graphDiagnostics = validateCatalogGraph(catalog, {
    toolBindingResolver: createToolBindingResolver(listToolCodeBindings()),
  });

  assert.equal(catalog.ok, true);
  assert.deepEqual(graphDiagnostics, []);
  const first = serializeCatalogArtifact(buildNormalizedCatalogArtifact(catalog));
  const second = serializeCatalogArtifact(buildNormalizedCatalogArtifact(catalog));

  assert.equal(first, second);
  const parsed = JSON.parse(first);
  assert.equal(parsed.artifactVersion, "catalog.normalized.v1");
  assert.equal(parsed.catalogSchemaVersion, "0.1.0");
  assert.match(parsed.checksum, /^sha256-[a-f0-9]{64}$/);
  assert(!first.includes("API_KEY"));
  assert(!first.includes("TOKEN"));
  assert(!first.includes("Bearer"));
});

test("Catalog artifact parser rejects unsupported schema versions", async () => {
  const {
    buildNormalizedCatalogArtifact,
    loadCatalog,
    parseCatalogArtifact,
  } = await loadSchemaModule();
  const catalog = await loadCatalog({ rootDir: new URL("../catalog", import.meta.url).pathname });
  const artifact = buildNormalizedCatalogArtifact(catalog);

  assert.equal(parseCatalogArtifact(artifact).artifactVersion, "catalog.normalized.v1");
  assert.throws(() => parseCatalogArtifact({
    ...artifact,
    artifactVersion: "catalog.normalized.v999",
  }), /unsupported Catalog artifact version/);
});

test("committed normalized Catalog artifact matches generator output", async () => {
  await execFileAsync("npm", ["run", "catalog:build"], {
    cwd: workspaceRoot,
    env: { ...process.env, FORCE_COLOR: "0" },
    maxBuffer: 1024 * 1024 * 4,
  });

  const generated = await readFile(artifactPath, "utf8");
  assert.match(generated, /"artifactVersion": "catalog.normalized.v1"/);
  assert.match(generated, /"checksum": "sha256-/);
  assert(!generated.includes("generatedAt"));
});
