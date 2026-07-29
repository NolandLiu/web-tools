import assert from "node:assert/strict";
import test from "node:test";
import {
  AMBIGUOUS_CHARACTERS,
  DEFAULT_SYMBOLS,
  generatePasswords,
  normalizePasswordConfig,
  passwordStrength,
  secureRandomIndex,
} from "../src/lib/password.js";

const cyclingSource = values => {
  let index = 0;
  return {
    fill(bytes) {
      for (let item = 0; item < bytes.length; item += 1) {
        bytes[item] = values[index % values.length];
        index += 1;
      }
      return bytes;
    },
  };
};

const seededSource = initial => {
  let state = initial >>> 0;
  return {
    fill(bytes) {
      for (let item = 0; item < bytes.length; item += 1) {
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        bytes[item] = state & 0xff;
      }
      return bytes;
    },
  };
};

test("password configuration validates ranges, categories, and minimum totals", () => {
  assert.equal(normalizePasswordConfig({ length: 7 }).ok, false);
  assert.equal(normalizePasswordConfig({ length: 129 }).ok, false);
  assert.deepEqual(normalizePasswordConfig({
    length: 8,
    count: 1,
    upper: false,
    lower: false,
    digits: false,
    symbols: false,
  }), { ok: false, reason: "category" });
  assert.deepEqual(normalizePasswordConfig({
    length: 8,
    count: 1,
    upper: true,
    lower: true,
    digits: false,
    symbols: false,
    minimums: { upper: 5, lower: 4, digits: 0, symbols: 0 },
  }), { ok: false, reason: "minimum-total" });
});

test("custom symbols are printable ASCII, deduplicated, and required when enabled", () => {
  assert.equal(normalizePasswordConfig({ symbols: true, customSymbols: "" }).reason, "symbol-pool");
  assert.equal(normalizePasswordConfig({ symbols: true, customSymbols: "!\n" }).reason, "symbol-format");
  const result = normalizePasswordConfig({ symbols: true, customSymbols: "!!@@#" });
  assert.equal(result.ok, true);
  assert.equal(result.config.pools.symbols, "!@#");
  assert.ok(DEFAULT_SYMBOLS.length > 0);
});

test("ambiguous exclusion removes the documented characters without empty fallback", () => {
  const result = normalizePasswordConfig({
    upper: true,
    lower: false,
    digits: false,
    symbols: false,
    excludeAmbiguous: true,
    customPools: { upper: AMBIGUOUS_CHARACTERS },
  });
  assert.deepEqual(result, { ok: false, reason: "empty-pool" });
});

test("secure random index rejects modulo-biased bytes", () => {
  const source = cyclingSource([255, 7]);
  assert.equal(secureRandomIndex(10, source), 7);
});

test("generated passwords meet every enabled minimum and requested batch size", () => {
  const result = generatePasswords({
    length: 16,
    count: 50,
    upper: true,
    lower: true,
    digits: true,
    symbols: true,
    minimums: { upper: 2, lower: 2, digits: 2, symbols: 2 },
    customSymbols: "!@#",
  }, seededSource(0x4f3a2b1c));
  assert.equal(result.ok, true);
  assert.equal(result.passwords.length, 50);
  assert.equal(new Set(result.passwords).size, 50);
  for (const password of result.passwords) {
    assert.equal(password.length, 16);
    assert.ok((password.match(/[A-Z]/g) ?? []).length >= 2);
    assert.ok((password.match(/[a-z]/g) ?? []).length >= 2);
    assert.ok((password.match(/[0-9]/g) ?? []).length >= 2);
    assert.ok((password.match(/[!@#]/g) ?? []).length >= 2);
  }
});

test("generation reports random-source and uniqueness exhaustion failures", () => {
  const failedSource = { fill() { throw new Error("unavailable"); } };
  assert.deepEqual(generatePasswords({ length: 8 }, failedSource), { ok: false, reason: "random-source" });

  const duplicate = generatePasswords({
    length: 8,
    count: 2,
    upper: true,
    lower: false,
    digits: false,
    symbols: false,
    customPools: { upper: "A" },
  }, cyclingSource([0]), { maxDuplicateRetries: 2 });
  assert.deepEqual(duplicate, { ok: false, reason: "unique-space" });
});

test("strength is based on one password configuration, not batch count", () => {
  const one = passwordStrength({ length: 16, count: 1, upper: true, lower: true, digits: true, symbols: true });
  const fifty = passwordStrength({ length: 16, count: 50, upper: true, lower: true, digits: true, symbols: true });
  assert.equal(one.label, fifty.label);
  assert.equal(one.bits, fifty.bits);
  assert.ok(["weak", "fair", "strong", "very-strong"].includes(one.label));
});
