import assert from "node:assert/strict";
import test from "node:test";
import * as core from "../src/lib/core.js";

test("JSON handles all standard top-level values and reports risky or oversized input", () => {
  for (const [input, expected] of [
    ["{}", "{}"],
    ["[]", "[]"],
    ["null", "null"],
    ["true", "true"],
    ['"文字\\n😀"', '"文字\\n😀"'],
    ["42", "42"],
  ]) {
    const result = core.formatJson(input, "minify");
    assert.equal(result.ok, true, input);
    assert.equal(result.value, expected, input);
  }

  assert.deepEqual(core.formatJson("", "pretty"), { ok: false, error: "empty" });
  assert.deepEqual(core.formatJson("   ", "pretty"), { ok: false, error: "empty" });
  assert.equal(core.formatJson("{bad", "pretty").ok, false);
  const unsafeInteger = core.formatJson('{"id":9007199254740993}', "minify");
  assert.equal(unsafeInteger.ok, true);
  assert.equal(unsafeInteger.warning, "unsafe-integer");
  assert.deepEqual(
    core.formatJson(`"${"x".repeat(1_000_001)}"`, "minify"),
    { ok: false, error: "too-large" },
  );
});

test("Base64 round trips UTF-8 text and strictly rejects malformed or non-UTF-8 data", () => {
  for (const value of [
    "",
    "plain ASCII",
    "简体中文",
    "繁體中文",
    "日本語",
    "😀👨‍👩‍👧‍👦",
    "e\u0301",
    "line one\r\nline two",
  ]) {
    const encoded = core.base64Encode(value);
    const decoded = core.base64Decode(encoded);
    assert.deepEqual(decoded, { ok: true, value }, value);
  }

  for (const input of ["%%%", "YQ", "Y===", "YWJj=", "YW Jj", "/w=="]) {
    assert.deepEqual(core.base64Decode(input), { ok: false, error: "invalid" }, input);
  }
  assert.deepEqual(
    core.base64Encode("x".repeat(1_000_001)),
    { ok: false, error: "too-large" },
  );
});

test("URL component transform is single-pass and preserves recoverable input on failure", () => {
  assert.deepEqual(core.urlTransform("a b+c/世界😀", "encode"), {
    ok: true,
    value: "a%20b%2Bc%2F%E4%B8%96%E7%95%8C%F0%9F%98%80",
  });
  assert.deepEqual(core.urlTransform("+%20%25", "decode"), {
    ok: true,
    value: "+ %",
  });
  for (const input of ["%", "%2", "%GG", "%E0%A4%A"]) {
    assert.deepEqual(core.urlTransform(input, "decode"), {
      ok: false,
      error: "invalid",
      input,
    });
  }
  assert.deepEqual(core.urlTransform("text", "other"), {
    ok: false,
    error: "unsupported",
    input: "text",
  });
});

test("UUID v4 generation uses Web Crypto and validates version and variant bits", () => {
  assert.equal(typeof core.generateUuidV4, "function");
  assert.equal(typeof core.isUuidV4, "function");
  const values = new Set();
  for (let index = 0; index < 100; index += 1) {
    const value = core.generateUuidV4();
    assert.equal(typeof value, "string");
    assert.equal(core.isUuidV4(value), true);
    assert.match(value, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    values.add(value);
  }
  assert.equal(values.size, 100);
  assert.equal(core.generateUuidV4({}), null);
});

test("text statistics count grapheme clusters and normalize line endings", () => {
  assert.deepEqual(core.textStats("e\u0301"), { characters: 1, words: 1, lines: 1 });
  assert.deepEqual(core.textStats("👨‍👩‍👧‍👦 👍🏽"), { characters: 3, words: 2, lines: 1 });
  assert.deepEqual(core.textStats("中文没有空格"), { characters: 6, words: 1, lines: 1 });
  assert.deepEqual(core.textStats("a\r\nb\nc\rd"), { characters: 7, words: 4, lines: 4 });
  assert.deepEqual(core.textStats(" \t\n"), { characters: 3, words: 0, lines: 2 });
});

test("color channels require finite whole numbers in the eight-bit range", () => {
  assert.equal(core.rgbToHex(0, 255, 16), "#00ff10");
  assert.equal(core.rgbToHex(0.5, 0, 0), null);
  assert.equal(core.rgbToHex("1e2", 0, 0), "#640000");
  assert.equal(core.rgbToHex("0x10", 0, 0), null);
  assert.equal(core.rgbToHex(256, 0, 0), null);
  assert.equal(core.rgbToHsl(Number.POSITIVE_INFINITY, 0, 0), null);
});
