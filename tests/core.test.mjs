import assert from "node:assert/strict";
import test from "node:test";
import {
  base64Decode,
  base64Encode,
  bmi,
  compoundInterest,
  convertTemperature,
  convertUnit,
  dateInterval,
  dateToTimestamp,
  discountPrice,
  formatJson,
  percentOf,
  readToolStats,
  rgbToHex,
  sortToolsByPopularity,
  textStats,
  timestampToDate,
  trackToolOpen,
  urlTransform,
  validateQrInput,
} from "../src/lib/core.js";

test("unit converters handle core formulas and finite validation", () => {
  assert.equal(convertUnit("1000", "length", "m", "km"), 1);
  assert.equal(convertUnit("1", "weight", "kg", "g"), 1000);
  assert.equal(convertUnit("1", "storage", "GB", "MB"), 1000);
  assert.equal(convertUnit("1", "storage", "GiB", "MiB"), 1024);
  assert.equal(convertUnit("Infinity", "length", "m", "km"), null);
});

test("temperature conversion uses offset formulas", () => {
  assert.equal(convertTemperature("0", "c", "f"), 32);
  assert.equal(convertTemperature("32", "f", "c"), 0);
  assert.equal(convertTemperature("0", "c", "k"), 273.15);
});

test("json formatting and minifying reports validation errors", () => {
  assert.equal(formatJson('{"a":1}', "pretty").value, '{\n  "a": 1\n}');
  assert.equal(formatJson('{"a":1}', "minify").value, '{"a":1}');
  assert.equal(formatJson("{bad").ok, false);
});

test("base64 and url transforms handle unicode and invalid input", () => {
  const encoded = base64Encode("Hello 世界");
  assert.equal(base64Decode(encoded).value, "Hello 世界");
  assert.equal(base64Decode("***").ok, false);
  assert.equal(urlTransform("a b/世界", "encode").value, "a%20b%2F%E4%B8%96%E7%95%8C");
  assert.equal(urlTransform("%E4%B8%96%E7%95%8C", "decode").value, "世界");
});

test("timestamp, date, text, color, and calculators return expected values", () => {
  assert.equal(timestampToDate("1704067200"), "2024-01-01T00:00:00.000Z");
  assert.equal(dateToTimestamp("2024-01-01T00:00:00.000Z"), 1704067200);
  assert.deepEqual(textStats("one two\n三"), { characters: 9, words: 3, lines: 2 });
  assert.equal(rgbToHex(24, 123, 105), "#187b69");
  assert.equal(percentOf(10, 250), 25);
  assert.deepEqual(discountPrice(100, 15), { finalPrice: 85, saved: 15 });
  assert.equal(Math.round(bmi(70, 175) * 10) / 10, 22.9);
  assert.equal(Math.round(compoundInterest(1000, 12, 1, 12).amount), 1127);
  assert.equal(dateInterval("2024-01-01", "2024-01-31"), 30);
});

test("local popular tool stats tolerate damaged storage and sort with recency", () => {
  const storage = new Map();
  const fakeStorage = {
    getItem: key => storage.get(key) ?? null,
    setItem: (key, value) => storage.set(key, value),
  };
  storage.set("lite-tools:tool-stats", "{bad");
  assert.deepEqual(readToolStats(fakeStorage), { version: 1, tools: {} });
  let stats = readToolStats(fakeStorage);
  for (let count = 0; count < 10; count += 1) {
    stats = trackToolOpen(fakeStorage, "json", 1000);
  }
  const sorted = sortToolsByPopularity([
    { id: "length", defaultWeight: 10, order: 1 },
    { id: "json", defaultWeight: 1, order: 2 },
  ], stats, 1000);
  assert.equal(sorted[0].id, "json");
});

test("qr validation rejects empty and very long input", () => {
  assert.deepEqual(validateQrInput(""), { ok: false, error: "empty", bytes: 0 });
  assert.deepEqual(validateQrInput("x".repeat(1201)), { ok: false, error: "tooLarge", bytes: 1201 });
  assert.deepEqual(validateQrInput("https://example.com"), { ok: true, bytes: 19 });
});
