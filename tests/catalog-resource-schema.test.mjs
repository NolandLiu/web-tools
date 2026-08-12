import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import test from "node:test";

const execFileAsync = promisify(execFile);
const workspaceRoot = new URL("../", import.meta.url);

async function buildSchemaPackage() {
  await execFileAsync("npm", ["run", "build", "--workspace", "@godeskhub/catalog-schema"], {
    cwd: workspaceRoot,
    env: { ...process.env, FORCE_COLOR: "0" },
    maxBuffer: 1024 * 1024 * 4,
  });
}

async function loadSchemaModule() {
  await buildSchemaPackage();
  return import(`../packages/catalog-schema/dist/index.js?cache=${Date.now()}`);
}

const baseResource = {
  schemaVersion: "0.1.0",
  status: "published",
  canonicalSlug: "ipv4-network-toolbox",
  createdAt: "2026-08-11T00:00:00.000Z",
  updatedAt: "2026-08-11T00:00:00.000Z",
};

const requiredLocales = [
  {
    resourceId: "res_tool_ipv4-network",
    locale: "en",
    name: "IPv4 network toolbox",
    summary: "Calculate IPv4 subnet ranges and classifications.",
    seoTitle: "IPv4 network toolbox",
    seoDescription: "Calculate IPv4 subnet ranges and classifications.",
    searchAliases: ["subnet calculator"],
    searchKeywords: ["IPv4", "CIDR"],
  },
  {
    resourceId: "res_tool_ipv4-network",
    locale: "zh-CN",
    name: "IPv4 网络工具箱",
    summary: "计算 IPv4 子网范围与地址类型。",
    seoTitle: "IPv4 网络工具箱",
    seoDescription: "计算 IPv4 子网范围与地址类型。",
    searchAliases: ["子网计算器"],
    searchKeywords: ["IPv4", "CIDR"],
  },
  {
    resourceId: "res_tool_ipv4-network",
    locale: "zh-TW",
    name: "IPv4 網路工具箱",
    summary: "計算 IPv4 子網範圍與位址類型。",
    seoTitle: "IPv4 網路工具箱",
    seoDescription: "計算 IPv4 子網範圍與位址類型。",
    searchAliases: ["子網計算器"],
    searchKeywords: ["IPv4", "CIDR"],
  },
];

test("Resource schemas parse valid website, tool, and guide records", async () => {
  const {
    resourceSchema,
    ResourceType,
    PublicationStatus,
    LocaleCode,
  } = await loadSchemaModule();

  assert.deepEqual(ResourceType, ["website", "tool", "guide", "ai-skill"]);
  assert.deepEqual(PublicationStatus, ["draft", "review", "published", "deprecated", "hidden"]);
  assert.deepEqual(LocaleCode, ["en", "zh-CN", "zh-TW"]);

  assert.equal(resourceSchema.parse({
    ...baseResource,
    id: "res_tool_ipv4-network",
    type: "tool",
    toolBindingId: "ipv4-network",
    primaryCategoryId: "cat_network-ip",
  }).toolBindingId, "ipv4-network");

  assert.equal(resourceSchema.parse({
    ...baseResource,
    id: "res_website_cloudflare-radar",
    type: "website",
    canonicalSlug: "cloudflare-radar",
    destinationUrl: "https://radar.cloudflare.com/",
  }).destinationUrl, "https://radar.cloudflare.com/");

  assert.equal(resourceSchema.parse({
    ...baseResource,
    id: "res_guide_json-formatting",
    type: "guide",
    canonicalSlug: "json-formatting-guide",
  }).type, "guide");

  const aiSkill = resourceSchema.parse({
    ...baseResource,
    id: "res_ai-skill-prompt-brief-refiner",
    type: "ai-skill",
    canonicalSlug: "prompt-brief-refiner",
    useCases: ["Turn a rough request into an implementation-ready brief."],
    inputRequirements: ["A rough goal, target audience, constraints, and preferred output format."],
    outputResults: ["A structured brief with scope, non-goals, acceptance criteria, and risks."],
    steps: [
      "Paste the rough request into your AI assistant.",
      "Ask it to identify missing decisions and separate scope from non-scope.",
      "Review the final brief before using it for implementation.",
    ],
    riskNotes: ["Do not paste secrets, private customer data, passwords, or unreleased confidential plans."],
  });
  assert.equal(aiSkill.type, "ai-skill");
  assert.equal(aiSkill.steps.length, 3);
});

test("Resource schemas reject invalid type-specific fields, lifecycle values, and unsafe URLs", async () => {
  const { resourceSchema } = await loadSchemaModule();

  assert.throws(() => resourceSchema.parse({
    ...baseResource,
    id: "res_tool_ipv4-network",
    type: "tool",
    primaryCategoryId: "cat_network-ip",
  }), /toolBindingId/);

  assert.throws(() => resourceSchema.parse({
    ...baseResource,
    id: "res_website_unsafe",
    type: "website",
    destinationUrl: "javascript:alert(1)",
  }), /destinationUrl/);

  assert.throws(() => resourceSchema.parse({
    ...baseResource,
    id: "res_guide_bad-status",
    type: "guide",
    status: "live",
  }), /status/);

  assert.throws(() => resourceSchema.parse({
    ...baseResource,
    id: "res_guide_bad-tool-field",
    type: "guide",
    toolBindingId: "json",
  }), /toolBindingId/);

  assert.throws(() => resourceSchema.parse({
    ...baseResource,
    id: "res_ai-skill_prompt-brief-refiner",
    type: "ai-skill",
    canonicalSlug: "prompt-brief-refiner",
    useCases: ["Clarify a brief."],
    inputRequirements: ["Rough request."],
    outputResults: ["Structured brief."],
    steps: ["Paste the rough request."],
    riskNotes: ["Do not paste secrets."],
  }), /id/);

  assert.throws(() => resourceSchema.parse({
    ...baseResource,
    id: "res_ai-skill-prompt-brief-refiner",
    type: "ai-skill",
    canonicalSlug: "prompt-brief-refiner",
    useCases: ["Clarify a brief."],
    inputRequirements: ["Rough request."],
    outputResults: ["Structured brief."],
    steps: ["Paste the rough request."],
    riskNotes: [],
  }), /riskNotes/);
});

test("Resource locale schemas require complete English, Simplified Chinese, and Traditional Chinese records", async () => {
  const { resourceLocaleSchema, resourceLocaleSetSchema } = await loadSchemaModule();

  assert.equal(resourceLocaleSchema.parse(requiredLocales[0]).locale, "en");
  assert.deepEqual(resourceLocaleSetSchema.parse(requiredLocales).map((item) => item.locale), [
    "en",
    "zh-CN",
    "zh-TW",
  ]);

  assert.throws(() => resourceLocaleSetSchema.parse(requiredLocales.slice(0, 2)), /zh-TW/);
  assert.throws(() => resourceLocaleSetSchema.parse([
    requiredLocales[0],
    requiredLocales[0],
    requiredLocales[2],
  ]), /duplicate locale/);
  assert.throws(() => resourceLocaleSchema.parse({
    ...requiredLocales[0],
    seoDescription: "",
  }), /seoDescription/);
});
