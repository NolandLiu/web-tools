import assert from "node:assert/strict";
import test from "node:test";
import * as core from "../src/lib/core.js";

test("numeric parser preserves editing states and accepts only explicit decimal syntax", () => {
  assert.equal(typeof core.parseNumberInput, "function");

  for (const value of ["", "  "]) {
    assert.deepEqual(core.parseNumberInput(value), { state: "empty" });
  }
  for (const value of ["-", "+", ".", "-.", "+.", "1e", "1e-", "1e+"]) {
    assert.deepEqual(core.parseNumberInput(value), { state: "editing" }, value);
  }
  assert.deepEqual(core.parseNumberInput("+.5"), { state: "valid", value: 0.5 });
  assert.deepEqual(core.parseNumberInput("-1.25e-3"), { state: "valid", value: -0.00125 });

  for (const value of ["0x10", "1_000", "1,000", "12abc", "NaN", "Infinity"]) {
    assert.deepEqual(core.parseNumberInput(value), { state: "invalid" }, value);
    assert.equal(core.parseFiniteNumber(value), null);
  }
  assert.deepEqual(core.parseNumberInput("1e309"), { state: "out-of-range" });
  assert.deepEqual(core.parseNumberInput(Number.POSITIVE_INFINITY), { state: "out-of-range" });
});

test("number formatting rounds only at display and never emits negative zero", () => {
  assert.equal(typeof core.normalizeNegativeZero, "function");
  assert.equal(core.normalizeNegativeZero(-0), 0);
  assert.equal(Object.is(core.normalizeNegativeZero(-0), -0), false);
  assert.equal(core.formatNumber(-0, "en"), "0");
  assert.equal(core.formatNumber(-0.00000000001, "en"), "-1e-11");
  assert.equal(core.formatNumber(0.00000000001, "en"), "1e-11");
  assert.equal(core.formatNumber(1_000_000_000_000, "en"), "1e+12");
  assert.equal(core.formatNumber(1.23456789016, "en"), "1.2345678902");
  assert.equal(core.formatNumber(Number.NaN, "en"), "");
});
