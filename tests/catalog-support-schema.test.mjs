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

const faq = {
  schemaVersion: "0.1.0",
  id: "faq_ipv4-subnet-basics",
  status: "published",
  placements: [
    { resourceId: "res_tool_ipv4-network", order: 10 },
    { resourceId: "res_guide_subnetting-basics", order: 20 },
  ],
  locales: [
    {
      locale: "en",
      question: "What does a CIDR prefix mean?",
      answer: "It describes how many bits are used for the network part.",
    },
    {
      locale: "zh-CN",
      question: "CIDR 掩码位是什么意思？",
      answer: "它表示网络部分使用了多少位。",
    },
    {
      locale: "zh-TW",
      question: "CIDR 遮罩位是什麼意思？",
      answer: "它表示網路部分使用了多少位元。",
    },
  ],
};

test("FAQ schema supports reusable localized FAQ placements", async () => {
  const { faqSchema } = await loadSchemaModule();

  const parsed = faqSchema.parse(faq);
  assert.equal(parsed.placements.length, 2);
  assert.deepEqual(parsed.locales.map((item) => item.locale), ["en", "zh-CN", "zh-TW"]);

  assert.throws(() => faqSchema.parse({
    ...faq,
    locales: faq.locales.slice(0, 2),
  }), /zh-TW/);

  assert.throws(() => faqSchema.parse({
    ...faq,
    placements: [
      { resourceId: "res_tool_ipv4-network", order: 10 },
      { resourceId: "res_tool_ipv4-network", order: 20 },
    ],
  }), /duplicate FAQ placement/);
});

test("Relation schema enforces typed directional resource links", async () => {
  const { relationSchema, RelationType } = await loadSchemaModule();

  assert.deepEqual(RelationType, ["related", "alternative", "prerequisite", "successor", "replaces"]);
  assert.equal(relationSchema.parse({
    schemaVersion: "0.1.0",
    id: "rel_ipv4-to-ipv6",
    type: "related",
    sourceId: "res_tool_ipv4-network",
    targetId: "res_tool_ipv6-network",
    order: 10,
  }).type, "related");

  assert.throws(() => relationSchema.parse({
    schemaVersion: "0.1.0",
    id: "rel_self",
    type: "related",
    sourceId: "res_tool_ipv4-network",
    targetId: "res_tool_ipv4-network",
  }), /self-reference/);

  assert.throws(() => relationSchema.parse({
    schemaVersion: "0.1.0",
    id: "rel_url",
    type: "related",
    sourceId: "res_tool_ipv4-network",
    targetId: "javascript:alert(1)",
  }), /targetId/);
});

test("Health schema separates operational status from authored content and rejects secret-like evidence", async () => {
  const { healthSchema, HealthStatus } = await loadSchemaModule();

  assert.deepEqual(HealthStatus, ["unknown", "healthy", "warning", "failing"]);
  assert.equal(healthSchema.parse({
    schemaVersion: "0.1.0",
    id: "health_ipv4-binding",
    resourceId: "res_tool_ipv4-network",
    checkType: "tool-binding",
    status: "healthy",
    checkedAt: "2026-08-11T00:00:00.000Z",
    evidence: "Binding ipv4-network resolved in the local registry.",
  }).status, "healthy");

  assert.throws(() => healthSchema.parse({
    schemaVersion: "0.1.0",
    id: "health_secret",
    resourceId: "res_tool_ipv4-network",
    checkType: "external-link",
    status: "warning",
    checkedAt: "2026-08-11T00:00:00.000Z",
    evidence: "Authorization: Bearer abc123",
  }), /secret-like evidence/);

  assert.throws(() => healthSchema.parse({
    schemaVersion: "0.1.0",
    id: "health_bad_url",
    resourceId: "res_tool_ipv4-network",
    checkType: "external-link",
    status: "healthy",
    checkedAt: "2026-08-11T00:00:00.000Z",
    evidenceUrl: "javascript:alert(1)",
  }), /evidenceUrl/);
});
