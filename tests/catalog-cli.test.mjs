import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const workspaceRoot = new URL("../", import.meta.url);

async function writeFixture(rootDir, relativePath, contents) {
  const fullPath = join(rootDir, relativePath);
  await mkdir(dirname(fullPath), { recursive: true });
  await writeFile(fullPath, contents, "utf8");
}

async function createCatalogFixture(files) {
  const rootDir = await mkdtemp(join(tmpdir(), "gdh-catalog-cli-"));
  for (const [relativePath, contents] of Object.entries(files)) {
    await writeFixture(rootDir, relativePath, contents);
  }
  return rootDir;
}

async function runCatalogValidate(rootDir, extraEnv = {}, extraArgs = []) {
  try {
    const result = await execFileAsync("npm", ["run", "catalog:validate", "--", "--root", rootDir, ...extraArgs], {
      cwd: workspaceRoot,
      env: { ...process.env, ...extraEnv, FORCE_COLOR: "0" },
      maxBuffer: 1024 * 1024 * 4,
    });
    return {
      exitCode: 0,
      stdout: result.stdout,
      stderr: result.stderr,
    };
  } catch (error) {
    return {
      exitCode: error.code,
      stdout: error.stdout ?? "",
      stderr: error.stderr ?? "",
    };
  }
}

const validResourceYaml = `
schemaVersion: 0.1.0
id: res_tool_ipv4-network
type: tool
canonicalSlug: ipv4-network-toolbox
status: published
createdAt: "2026-08-11T00:00:00.000Z"
updatedAt: "2026-08-11T00:00:00.000Z"
toolBindingId: ipv4-network-toolbox
primaryCategoryId: cat_network-ip
`;

const validCategoryYaml = `
schemaVersion: 0.1.0
id: cat_network-ip
slug: network-ip
status: published
order: 1
`;

function validLocaleYaml(locale) {
  return `
resourceId: res_tool_ipv4-network
locale: ${locale}
name: IPv4 network toolbox ${locale}
summary: IPv4 network summary ${locale}
seoTitle: IPv4 network title ${locale}
seoDescription: IPv4 network description ${locale}
searchAliases: []
searchKeywords: []
`;
}

test("catalog:validate exits 0 for valid Catalog data", async () => {
  const rootDir = await createCatalogFixture({
    "resources/res_tool_ipv4-network.yml": validResourceYaml,
    "taxonomy/categories/cat_network-ip.yml": validCategoryYaml,
    "locales/res_tool_ipv4-network.en.yml": validLocaleYaml("en"),
    "locales/res_tool_ipv4-network.zh-CN.yml": validLocaleYaml("zh-CN"),
    "locales/res_tool_ipv4-network.zh-TW.yml": validLocaleYaml("zh-TW"),
  });

  const result = await runCatalogValidate(rootDir);

  assert.equal(result.exitCode, 0);
  assert.match(result.stdout, /Catalog validation passed/);
  assert.equal(result.stderr, "");
});

test("catalog:validate exits nonzero with deterministic source-scoped diagnostics", async () => {
  const rootDir = await createCatalogFixture({
    "resources/res_tool_bad-url.yml": validResourceYaml
      .replaceAll("res_tool_ipv4-network", "res_website_bad-url")
      .replace("type: tool", "type: website")
      .replace("canonicalSlug: ipv4-network-toolbox", "canonicalSlug: bad-url")
      .replace("toolBindingId: ipv4-network-toolbox\nprimaryCategoryId: cat_network-ip\n", "destinationUrl: http://example.com\n"),
    "resources/res_tool_bad-slug.yml": validResourceYaml.replace("canonicalSlug: ipv4-network-toolbox", "canonicalSlug: Bad Slug"),
  });

  const result = await runCatalogValidate(rootDir, {
    API_KEY: "SHOULD_NOT_APPEAR_IN_CATALOG_DIAGNOSTICS",
  });

  assert.equal(result.exitCode, 1);
  const output = `${result.stdout}\n${result.stderr}`;
  assert.match(output, /resources\/res_tool_bad-slug\.yml/);
  assert.match(output, /canonicalSlug/);
  assert.match(output, /resources\/res_tool_bad-url\.yml/);
  assert.match(output, /destinationUrl/);
  assert(!output.includes("SHOULD_NOT_APPEAR_IN_CATALOG_DIAGNOSTICS"));

  const diagnosticLines = output.split("\n").filter((line) => line.startsWith("schema-error"));
  assert.deepEqual(diagnosticLines, [...diagnosticLines].sort());
});
