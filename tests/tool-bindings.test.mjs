import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { CATEGORIES, TOOLS } from "../src/registry.js";
import {
  createToolBindingResolver,
  listPublishedToolCodeBindings,
  listToolCodeBindings,
  resolveToolBinding,
} from "../src/tool-bindings.js";
import { listCanonicalRoutes } from "../src/lib/routes.js";
import { searchTools } from "../src/lib/search.js";

test("published tool code bindings cover every public registry tool exactly once", () => {
  const bindings = listPublishedToolCodeBindings();
  const categoryIds = new Set(CATEGORIES.map(category => category.id));

  assert.equal(bindings.length, TOOLS.length);
  assert.deepEqual(
    bindings.map(binding => binding.registryToolId).sort(),
    TOOLS.map(tool => tool.id).sort(),
  );
  assert.equal(new Set(bindings.map(binding => binding.toolBindingId)).size, bindings.length);
  assert.equal(new Set(bindings.map(binding => binding.registryToolId)).size, bindings.length);

  for (const tool of TOOLS) {
    const binding = bindings.find(item => item.registryToolId === tool.id);
    assert.ok(binding, `${tool.id} should have a published binding`);
    assert.equal(binding.toolBindingId, tool.slug);
    assert.equal(binding.canonicalSlug, tool.slug);
    assert.equal(binding.kind, tool.kind);
    assert.equal(binding.categoryId, tool.category);
    assert.equal(binding.icon, tool.icon);
    assert.equal(binding.publicationState, "published");
    assert.ok(categoryIds.has(binding.categoryId));
    assert.ok(binding.componentKey);
  }
});

test("tool binding resolver rejects unknown and duplicate bindings deterministically", () => {
  const resolver = createToolBindingResolver(listToolCodeBindings());
  assert.equal(resolver.hasToolBinding("ipv4-network-toolbox"), true);
  assert.equal(resolver.hasToolBinding("not-a-real-binding"), false);
  assert.equal(resolveToolBinding("ipv4-network-toolbox").registryToolId, "ipv4-network");
  assert.equal(resolveToolBinding("not-a-real-binding"), null);

  assert.throws(
    () => createToolBindingResolver([
      ...listToolCodeBindings(),
      { ...listToolCodeBindings()[0] },
    ]),
    /duplicate tool binding/i,
  );
});

test("hidden IP capabilities are retained in bindings but excluded from public projections", () => {
  const bindings = listToolCodeBindings();
  const hiddenBindings = bindings.filter(binding => binding.publicationState === "hidden");
  assert.deepEqual(hiddenBindings.map(binding => binding.toolBindingId).sort(), ["ip-info", "ip-rdap"]);

  const publicToolIds = new Set(TOOLS.map(tool => tool.id));
  assert.equal(publicToolIds.has("ip-info"), false);
  assert.equal(publicToolIds.has("ip-rdap"), false);
  assert.equal(listCanonicalRoutes().some(route => route.kind === "tool" && /ip-info|ip-rdap/.test(route.toolId)), false);
  assert.deepEqual(searchTools("IP RDAP", "en"), []);
  assert.deepEqual(searchTools("WHOIS", "en"), []);
});

test("catalog validation scripts do not hard-code the representative pilot binding list", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  const generator = await readFile(new URL("../scripts/generate-catalog-artifact.mjs", import.meta.url), "utf8");

  assert.doesNotMatch(packageJson.scripts["catalog:validate"], /--tool-binding/);
  assert.doesNotMatch(generator, /const publishedToolBindings = new Set\(\[/);
  assert.match(packageJson.scripts["catalog:validate"], /scripts\/validate-catalog\.mjs/);
});
