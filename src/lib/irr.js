import { parseNumberInput } from "./core.js";

const DEFAULT_OPTIONS = {
  maxIterations: 160,
  tolerance: 1e-10,
  scanSteps: 4096,
  minimumRate: -0.999999999,
  maximumRate: 1_000_000,
};

function normalizedNpvAtLogRate(cashFlows, logFactor) {
  const scale = Math.max(...cashFlows.map(value => Math.abs(value)));
  let sum = 0;
  for (let period = 0; period < cashFlows.length; period += 1) {
    const term = (cashFlows[period] / scale) * Math.exp(-logFactor * period);
    if (!Number.isFinite(term)) return Math.sign(term) * Number.POSITIVE_INFINITY;
    sum += term;
  }
  return sum;
}

function bisectLogBracket(cashFlows, lowerLog, upperLog, options) {
  if (options.maxIterations <= 0) return null;
  let lower = lowerLog;
  let upper = upperLog;
  let lowerValue = normalizedNpvAtLogRate(cashFlows, lower);

  for (let iteration = 0; iteration < options.maxIterations; iteration += 1) {
    const middle = (lower + upper) / 2;
    const middleValue = normalizedNpvAtLogRate(cashFlows, middle);
    if (Math.abs(middleValue) <= options.tolerance || upper - lower <= options.tolerance) {
      return Math.expm1(middle);
    }
    if (Math.sign(lowerValue) === Math.sign(middleValue)) {
      lower = middle;
      lowerValue = middleValue;
    } else {
      upper = middle;
    }
  }
  return null;
}

function uniqueRoots(roots, tolerance) {
  return roots
    .sort((a, b) => a - b)
    .filter((root, index, values) => index === 0 || Math.abs(root - values[index - 1]) > tolerance * 10);
}

export function npvAtRate(cashFlows, rate) {
  if (!Array.isArray(cashFlows) || rate <= -1 || !Number.isFinite(rate)) return Number.NaN;
  let sum = 0;
  for (let period = 0; period < cashFlows.length; period += 1) {
    sum += cashFlows[period] / ((1 + rate) ** period);
  }
  return sum;
}

export function annualizeIrr(periodicRate, periodsPerYear) {
  if (!Number.isFinite(periodicRate) || periodicRate <= -1) return Number.NaN;
  if (!Number.isInteger(periodsPerYear) || periodsPerYear <= 0) return Number.NaN;
  const result = (1 + periodicRate) ** periodsPerYear - 1;
  return Object.is(result, -0) ? 0 : result;
}

export function roundIrrPercent(rate, digits = 6) {
  const factor = 10 ** digits;
  const rounded = Math.round(rate * 100 * factor) / factor;
  return Object.is(rounded, -0) ? 0 : rounded;
}

export function parseCashFlowInputs(inputs) {
  for (let index = 0; index < inputs.length; index += 1) {
    const parsed = parseNumberInput(inputs[index]);
    if (parsed.state !== "valid") {
      return { ok: false, reason: parsed.state, index };
    }
  }
  return { ok: true, values: inputs.map(value => parseNumberInput(value).value) };
}

export function addCashFlowInput(inputs) {
  return inputs.length >= 200 ? inputs : [...inputs, ""];
}

export function removeCashFlowInput(inputs, index) {
  if (inputs.length <= 2 || index < 0 || index >= inputs.length) return inputs;
  return inputs.filter((_, itemIndex) => itemIndex !== index);
}

export function cashFlowFocusAfterRemoval(length, index) {
  const nextLength = Math.max(2, length - 1);
  return Math.max(0, Math.min(index, nextLength - 1));
}

export function solveFixedPeriodIrr(cashFlows, suppliedOptions = {}) {
  if (!Array.isArray(cashFlows) || cashFlows.length < 2 || cashFlows.length > 200) {
    return { status: "invalid", reason: "count" };
  }
  if (cashFlows.some(value => !Number.isFinite(value))) {
    return { status: "invalid", reason: "non-finite" };
  }
  const hasNegative = cashFlows.some(value => value < 0);
  const hasPositive = cashFlows.some(value => value > 0);
  if (!hasNegative && !hasPositive) {
    return { status: "invalid", reason: "missing-negative-and-positive" };
  }
  if (!hasNegative) return { status: "invalid", reason: "missing-negative" };
  if (!hasPositive) return { status: "invalid", reason: "missing-positive" };

  const options = { ...DEFAULT_OPTIONS, ...suppliedOptions };
  const minimumLog = Math.log1p(options.minimumRate);
  const maximumLog = Math.log1p(options.maximumRate);
  const scanLogs = Array.from(
    { length: options.scanSteps + 1 },
    (_, index) => minimumLog + ((maximumLog - minimumLog) * index) / options.scanSteps,
  );
  scanLogs.push(0);
  scanLogs.sort((a, b) => a - b);

  const roots = [];
  const intervals = [];
  const unresolvedIntervals = [];
  let previousLog = scanLogs[0];
  let previousValue = normalizedNpvAtLogRate(cashFlows, previousLog);

  for (let index = 1; index < scanLogs.length; index += 1) {
    const currentLog = scanLogs[index];
    const currentValue = normalizedNpvAtLogRate(cashFlows, currentLog);
    if (Math.abs(previousValue) <= options.tolerance) roots.push(Math.expm1(previousLog));
    if (Math.sign(previousValue) !== Math.sign(currentValue)) {
      const interval = [Math.expm1(previousLog), Math.expm1(currentLog)];
      intervals.push(interval);
      const root = bisectLogBracket(cashFlows, previousLog, currentLog, options);
      if (root === null || !Number.isFinite(root)) {
        unresolvedIntervals.push(interval);
      } else {
        roots.push(root);
      }
    }
    previousLog = currentLog;
    previousValue = currentValue;
  }
  if (Math.abs(previousValue) <= options.tolerance) roots.push(Math.expm1(previousLog));

  const stableRoots = uniqueRoots(roots, options.tolerance);
  if (unresolvedIntervals.length > 0) {
    return { status: "non-convergent", intervals: unresolvedIntervals };
  }
  if (stableRoots.length === 0) return { status: "no-root" };
  if (stableRoots.length > 1) {
    return { status: "multiple", roots: stableRoots, intervals };
  }
  const rate = Object.is(stableRoots[0], -0) ? 0 : stableRoots[0];
  return { status: "single", rate };
}
