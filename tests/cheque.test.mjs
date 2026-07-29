import assert from "node:assert/strict";
import test from "node:test";
import {
  formatChequeAmount,
  parseChequeAmount,
  toEnglishChequeWords,
  toTraditionalChequeWords,
} from "../src/lib/cheque.js";

test("cheque parser preserves cents exactly and normalizes supported input", () => {
  assert.deepEqual(parseChequeAmount("001,001.5"), {
    ok: true,
    normalized: "1001.50",
    integer: 1001n,
    cents: 50,
  });
  assert.deepEqual(parseChequeAmount("0"), {
    ok: true,
    normalized: "0.00",
    integer: 0n,
    cents: 0,
  });
});

test("cheque parser rejects ambiguity, rounding, negatives, and overflow", () => {
  for (const [input, reason] of [
    ["", "empty"],
    ["1.001", "fraction"],
    ["1,00", "format"],
    ["1000,000", "format"],
    ["-1", "negative"],
    ["1e3", "format"],
    ["NaN", "format"],
    ["1000000000000000", "range"],
  ]) {
    assert.deepEqual(parseChequeAmount(input), { ok: false, reason });
  }
});

test("English cheque words follow the defined currency-neutral style", () => {
  const cases = new Map([
    ["0", "ZERO AND 00/100 ONLY"],
    ["1", "ONE AND 00/100 ONLY"],
    ["10", "TEN AND 00/100 ONLY"],
    ["11", "ELEVEN AND 00/100 ONLY"],
    ["20", "TWENTY AND 00/100 ONLY"],
    ["21.05", "TWENTY-ONE AND 05/100 ONLY"],
    ["101", "ONE HUNDRED ONE AND 00/100 ONLY"],
    ["110", "ONE HUNDRED TEN AND 00/100 ONLY"],
    ["1001.50", "ONE THOUSAND ONE AND 50/100 ONLY"],
  ]);
  for (const [input, expected] of cases) {
    const parsed = parseChequeAmount(input);
    assert.equal(parsed.ok, true);
    assert.equal(toEnglishChequeWords(parsed.integer, parsed.cents), expected);
  }
});

test("Traditional financial words handle zeros and section boundaries", () => {
  const cases = new Map([
    ["0", "零圓正"],
    ["1", "壹圓正"],
    ["10", "壹拾圓正"],
    ["21.05", "貳拾壹圓零伍分"],
    ["1001.50", "壹仟零壹圓伍角正"],
    ["10000", "壹萬圓正"],
    ["100000000", "壹億圓正"],
    ["1000000000000", "壹兆圓正"],
    ["100010001", "壹億零壹萬零壹圓正"],
    ["1.01", "壹圓零壹分"],
    ["1.10", "壹圓壹角正"],
    ["1.99", "壹圓玖角玖分"],
  ]);
  for (const [input, expected] of cases) {
    const parsed = parseChequeAmount(input);
    assert.equal(parsed.ok, true);
    assert.equal(toTraditionalChequeWords(parsed.integer, parsed.cents), expected);
  }
});

test("formatChequeAmount returns both independently copyable values", () => {
  assert.deepEqual(formatChequeAmount("999,999,999,999,999.99"), {
    ok: true,
    normalized: "999999999999999.99",
    english: "NINE HUNDRED NINETY-NINE TRILLION NINE HUNDRED NINETY-NINE BILLION NINE HUNDRED NINETY-NINE MILLION NINE HUNDRED NINETY-NINE THOUSAND NINE HUNDRED NINETY-NINE AND 99/100 ONLY",
    traditional: "玖佰玖拾玖兆玖仟玖佰玖拾玖億玖仟玖佰玖拾玖萬玖仟玖佰玖拾玖圓玖角玖分",
  });
});
