import assert from "node:assert/strict";
import test from "node:test";

import {
  bmi,
  bmiCategory,
  compoundInterest,
  discountPrice,
  percentOf,
} from "../src/lib/core.js";

test("percentage calculator handles ordinary, zero, signed, and overflow cases", () => {
  assert.equal(percentOf(10, 200), 20);
  assert.equal(percentOf(0, 200), 0);
  assert.equal(percentOf(-10, 200), -20);
  assert.equal(percentOf("1e308", "1e308"), null);
});

test("discount calculator enforces its price and percentage domain", () => {
  assert.deepEqual(discountPrice(100, 15), { finalPrice: 85, saved: 15 });
  assert.deepEqual(discountPrice(100, 0), { finalPrice: 100, saved: 0 });
  assert.deepEqual(discountPrice(100, 100), { finalPrice: 0, saved: 100 });
  assert.equal(discountPrice(-1, 10), null);
  assert.equal(discountPrice(100, 100.01), null);
  assert.equal(discountPrice("1e308", 50), null);
});

test("BMI uses the metric formula and stable category boundaries", () => {
  assert.ok(Math.abs(bmi(70, 175) - 22.857142857142858) < 1e-12);
  assert.equal(bmiCategory(18.499), "underweight");
  assert.equal(bmiCategory(18.5), "healthy");
  assert.equal(bmiCategory(24.999), "healthy");
  assert.equal(bmiCategory(25), "overweight");
  assert.equal(bmiCategory(29.999), "overweight");
  assert.equal(bmiCategory(30), "obesity");
});

test("BMI rejects empty, non-positive, and unsupported extreme inputs", () => {
  assert.equal(bmi("", 175), null);
  assert.equal(bmi(0, 175), null);
  assert.equal(bmi(70, 0), null);
  assert.equal(bmi(1001, 175), null);
  assert.equal(bmi(70, 301), null);
  assert.equal(bmiCategory(Number.NaN), null);
});

test("compound interest matches known annual and monthly reference cases", () => {
  assert.ok(Math.abs(compoundInterest(1000, 5, 2, 1).amount - 1102.5) < 1e-12);
  assert.ok(Math.abs(compoundInterest(1000, 5, 2, 12).amount - 1104.941335558) < 1e-9);
  assert.deepEqual(compoundInterest(1000, 0, 10, 12), { amount: 1000, interest: 0 });
  assert.deepEqual(compoundInterest(1000, 5, 0, 12), { amount: 1000, interest: 0 });
});

test("compound interest validates frequency, negative rates, and overflow", () => {
  assert.equal(compoundInterest(1000, 5, 2, 0), null);
  assert.equal(compoundInterest(1000, 5, 2, 1.5), null);
  assert.equal(compoundInterest(1000, 5, 2, 366), null);
  assert.equal(compoundInterest(1000, -1200, 1, 12), null);
  assert.ok(compoundInterest(1000, -5, 1, 12).amount < 1000);
  assert.equal(compoundInterest("1e308", 100, 1000, 365), null);
});
