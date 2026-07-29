import assert from "node:assert/strict";
import test from "node:test";
import {
  addCashFlowInput,
  annualizeIrr,
  cashFlowFocusAfterRemoval,
  npvAtRate,
  parseCashFlowInputs,
  removeCashFlowInput,
  roundIrrPercent,
  solveFixedPeriodIrr,
} from "../src/lib/irr.js";

const closeTo = (actual, expected, tolerance = 1e-8) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
};

test("IRR solves independently verified one-period and two-period references", () => {
  const onePeriod = solveFixedPeriodIrr([-1000, 1100]);
  assert.equal(onePeriod.status, "single");
  closeTo(onePeriod.rate, 0.1);
  closeTo(npvAtRate([-1000, 1100], onePeriod.rate), 0, 1e-6);

  const twoPeriod = solveFixedPeriodIrr([-1000, 0, 1210]);
  assert.equal(twoPeriod.status, "single");
  closeTo(twoPeriod.rate, 0.1);
});

test("IRR annualization distinguishes monthly, quarterly, and yearly periods", () => {
  closeTo(annualizeIrr(0.01, 12), 0.12682503013196977, 1e-12);
  closeTo(annualizeIrr(0.01, 4), 0.04060401, 1e-12);
  closeTo(annualizeIrr(0.01, 1), 0.01, 1e-12);
});

test("IRR display rounding removes floating noise and negative zero", () => {
  assert.equal(roundIrrPercent(0.099999999999), 10);
  assert.equal(roundIrrPercent(0.01), 1);
  assert.equal(roundIrrPercent(-1e-15), 0);
  assert.equal(Object.is(roundIrrPercent(-1e-15), -0), false);
});

test("IRR rejects incomplete, non-finite, and sign-deficient cash flows", () => {
  assert.deepEqual(solveFixedPeriodIrr([100, 200]), { status: "invalid", reason: "missing-negative" });
  assert.deepEqual(solveFixedPeriodIrr([-100, -20]), { status: "invalid", reason: "missing-positive" });
  assert.deepEqual(solveFixedPeriodIrr([0, 0]), { status: "invalid", reason: "missing-negative-and-positive" });
  assert.deepEqual(solveFixedPeriodIrr([-100]), { status: "invalid", reason: "count" });
  assert.deepEqual(solveFixedPeriodIrr([-100, Number.POSITIVE_INFINITY]), { status: "invalid", reason: "non-finite" });
});

test("IRR protects the domain near negative one and reports a valid negative root", () => {
  const result = solveFixedPeriodIrr([-1000, 1]);
  assert.equal(result.status, "single");
  closeTo(result.rate, -0.999, 1e-8);
  assert.ok(result.rate > -1);
});

test("IRR reports multiple roots instead of selecting one silently", () => {
  const result = solveFixedPeriodIrr([-100, 230, -132]);
  assert.equal(result.status, "multiple");
  assert.equal(result.roots.length, 2);
  closeTo(result.roots[0], 0.1, 1e-7);
  closeTo(result.roots[1], 0.2, 1e-7);
  assert.equal(result.intervals.length, 2);
});

test("IRR distinguishes no root from an iteration limit", () => {
  const noRoot = solveFixedPeriodIrr([-100, 50, -10]);
  assert.equal(noRoot.status, "no-root");

  const limited = solveFixedPeriodIrr([-1000, 1100], { maxIterations: 0 });
  assert.equal(limited.status, "non-convergent");
  assert.ok(limited.intervals.length >= 1);
});

test("IRR handles small and large finite cash flows without returning infinity", () => {
  for (const flows of [[-1e-9, 1.1e-9], [-1e200, 1.1e200]]) {
    const result = solveFixedPeriodIrr(flows);
    assert.equal(result.status, "single");
    closeTo(result.rate, 0.1, 1e-7);
    assert.ok(Number.isFinite(result.rate));
  }
});

test("cash-flow input parsing preserves empty and editing states", () => {
  assert.deepEqual(parseCashFlowInputs(["-1000", "1.1e3"]), {
    ok: true,
    values: [-1000, 1100],
  });
  assert.deepEqual(parseCashFlowInputs(["-1000", ""]), {
    ok: false,
    reason: "empty",
    index: 1,
  });
  assert.deepEqual(parseCashFlowInputs(["-1000", "1e-"]), {
    ok: false,
    reason: "editing",
    index: 1,
  });
  assert.deepEqual(parseCashFlowInputs(["-1000", "1,100"]), {
    ok: false,
    reason: "invalid",
    index: 1,
  });
});

test("cash-flow rows add and remove without violating the 2 to 200 contract", () => {
  assert.deepEqual(addCashFlowInput(["-100", "120"]), ["-100", "120", ""]);
  assert.deepEqual(removeCashFlowInput(["-100", "0", "120"], 1), ["-100", "120"]);
  assert.deepEqual(removeCashFlowInput(["-100", "120"], 0), ["-100", "120"]);
  assert.equal(addCashFlowInput(Array.from({ length: 200 }, () => "0")).length, 200);
  assert.equal(cashFlowFocusAfterRemoval(3, 1), 1);
  assert.equal(cashFlowFocusAfterRemoval(3, 2), 1);
});
