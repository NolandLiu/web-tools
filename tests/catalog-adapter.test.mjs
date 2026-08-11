import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

import {
  PILOT_TOOL_BINDING_IDS,
  buildCatalogToolProjection,
  compareCatalogProjectionToRegistry,
} from "../src/lib/catalog-adapter.js";
import { CATEGORIES, TOOLS } from "../src/registry.js";
import { listToolCodeBindings } from "../src/tool-bindings.js";

const execFileAsync = promisify(execFile);
const workspaceRoot = new URL("../", import.meta.url);

async function loadCatalogArtifact() {
  await execFileAsync("npm", ["run", "catalog:build"], {
    cwd: workspaceRoot,
    env: { ...process.env, FORCE_COLOR: "0" },
    maxBuffer: 1024 * 1024 * 4,
  });
  const artifact = await import(`../catalog/artifacts/catalog.normalized.v1.json?cache=${Date.now()}`, {
    with: { type: "json" },
  });
  return artifact.default;
}

test("catalog adapter resolves representative pilot tools to code-owned bindings", async () => {
  const artifact = await loadCatalogArtifact();
  const projection = buildCatalogToolProjection(artifact, listToolCodeBindings(), {
    pilotToolBindingIds: PILOT_TOOL_BINDING_IDS,
  });

  assert.deepEqual(projection.diagnostics, []);
  assert.deepEqual(projection.tools.map(tool => tool.toolBindingId), [
    "ipv4-network-toolbox",
    "irr-calculator",
    "password-generator",
  ]);
  assert.deepEqual(projection.tools.map(tool => tool.registryToolId), [
    "ipv4-network",
    "irr",
    "password",
  ]);
  assert(projection.tools.every(tool => tool.provenance === "catalog-pilot"));
  assert(projection.tools.every(tool => Object.keys(tool.locales).sort().join(",") === "en,zh-CN,zh-TW"));
});

test("catalog adapter keeps legacy output unchanged when pilot allowlist is empty", async () => {
  const artifact = await loadCatalogArtifact();
  const projection = buildCatalogToolProjection(artifact, listToolCodeBindings(), {
    pilotToolBindingIds: [],
  });

  assert.deepEqual(projection.tools, []);
  assert.deepEqual(projection.diagnostics, []);

  const comparison = compareCatalogProjectionToRegistry(projection, {
    tools: TOOLS,
    categories: CATEGORIES,
  });
  assert.deepEqual(comparison.diagnostics, []);
});

test("catalog adapter reports deterministic diagnostics for field ownership conflicts", async () => {
  const artifact = await loadCatalogArtifact();
  const mutated = structuredClone(artifact);
  const ipv4 = mutated.records.resources.find(resource => resource.id === "res_tool_ipv4-network");
  ipv4.canonicalSlug = "changed-ipv4-slug";

  const projection = buildCatalogToolProjection(mutated, listToolCodeBindings(), {
    pilotToolBindingIds: ["ipv4-network-toolbox"],
  });
  const comparison = compareCatalogProjectionToRegistry(projection, {
    tools: TOOLS,
    categories: CATEGORIES,
  });

  assert.deepEqual(comparison.diagnostics.map(item => item.code), ["catalog-registry-slug-conflict"]);
  assert.deepEqual(comparison.diagnostics, [...comparison.diagnostics].sort((left, right) => left.code.localeCompare(right.code, "en")));
});

test("hidden IP catalog fixtures are not projected as public pilot tools", async () => {
  const artifact = await loadCatalogArtifact();
  const projection = buildCatalogToolProjection(artifact, listToolCodeBindings(), {
    pilotToolBindingIds: ["ip-info", "ip-rdap"],
  });

  assert.deepEqual(projection.tools, []);
  assert.deepEqual(projection.diagnostics, []);
});
