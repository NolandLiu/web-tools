import assert from "node:assert/strict";
import test from "node:test";
import QRCode from "qrcode";

import { createQrGenerationKey, utf8ByteLength, validateQrInput } from "../src/lib/core.js";

test("QR capacity guard counts UTF-8 bytes without truncating content", () => {
  assert.equal(utf8ByteLength("abc"), 3);
  assert.equal(utf8ByteLength("简"), 3);
  assert.equal(utf8ByteLength("😀"), 4);

  assert.deepEqual(validateQrInput(""), { ok: false, error: "empty", bytes: 0 });
  assert.deepEqual(validateQrInput("x".repeat(1200)), { ok: true, bytes: 1200 });
  assert.deepEqual(validateQrInput("简".repeat(400)), { ok: true, bytes: 1200 });
  assert.deepEqual(validateQrInput("😀".repeat(300)), { ok: true, bytes: 1200 });
  assert.deepEqual(validateQrInput("简".repeat(401)), { ok: false, error: "tooLarge", bytes: 1203 });
});

test("content accepted near the guard can be encoded by the configured QR library", async () => {
  const input = "简".repeat(400);
  const dataUrl = await QRCode.toDataURL(input, {
    width: 256,
    margin: 2,
    color: { dark: "#14201d", light: "#ffffff" },
  });
  assert.match(dataUrl, /^data:image\/png;base64,/);
});

test("QR generation keys keep asynchronous results tied to current settings", () => {
  const first = createQrGenerationKey("hello", "256", "#000000", "#ffffff");
  assert.equal(first, createQrGenerationKey("hello", 256, "#000000", "#ffffff"));
  assert.notEqual(first, createQrGenerationKey("hello!", 256, "#000000", "#ffffff"));
  assert.notEqual(first, createQrGenerationKey("hello", 512, "#000000", "#ffffff"));
});
