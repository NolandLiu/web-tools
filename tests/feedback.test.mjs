import assert from "node:assert/strict";
import test from "node:test";

let feedback;
try {
  feedback = await import("../src/lib/feedback.js");
} catch {
  feedback = null;
}

test("feedback exposes the approved categories", () => {
  assert.ok(feedback, "feedback module must exist");
  assert.deepEqual(feedback.FEEDBACK_TYPES, [
    "incorrect",
    "missing-option",
    "experience",
    "suggestion",
  ]);
});

test("feedback mailto contains only allowlisted page context", () => {
  assert.ok(feedback, "feedback module must exist");
  const secret = "PRIVATE-TOOL-INPUT";
  const href = feedback.buildFeedbackMailto({
    toolId: "json",
    slug: "json-tools",
    lang: "zh-CN",
    canonicalUrl: "https://tools.godeskhub.com/zh-cn/tools/json-tools",
    type: "incorrect",
    input: secret,
    result: secret,
  });
  const url = new URL(href);
  const decoded = decodeURIComponent(href);

  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "support@godeskhub.com");
  assert.match(decoded, /json/);
  assert.match(decoded, /json-tools/);
  assert.match(decoded, /zh-CN/);
  assert.match(decoded, /incorrect/);
  assert.match(decoded, /https:\/\/tools\.godeskhub\.com\/zh-cn\/tools\/json-tools/);
  assert.doesNotMatch(decoded, new RegExp(secret));
});

test("feedback rejects mismatched or noncanonical page context", () => {
  assert.ok(feedback, "feedback module must exist");
  const valid = {
    toolId: "json",
    slug: "json-tools",
    lang: "en",
    canonicalUrl: "https://tools.godeskhub.com/en/tools/json-tools",
    type: "suggestion",
  };

  assert.doesNotThrow(() => feedback.buildFeedbackMailto(valid));
  assert.throws(() => feedback.buildFeedbackMailto({ ...valid, slug: "uuid-generator" }));
  assert.throws(() => feedback.buildFeedbackMailto({ ...valid, lang: "fr" }));
  assert.throws(() => feedback.buildFeedbackMailto({ ...valid, canonicalUrl: "https://example.com/" }));
  assert.throws(() => feedback.buildFeedbackMailto({ ...valid, type: "rating" }));
});
