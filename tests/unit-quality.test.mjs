import assert from "node:assert/strict";
import test from "node:test";
import * as core from "../src/lib/core.js";

const {
  UNIT_GROUPS,
  convertTemperature,
  convertUnit,
} = core;

const closeTo = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Number.isFinite(actual));
  const scale = Math.max(1, Math.abs(expected));
  assert.ok(Math.abs(actual - expected) <= tolerance * scale, `${actual} != ${expected}`);
};

test("all registered proportional unit groups convert directly through one positive base", () => {
  for (const [groupId, group] of Object.entries(UNIT_GROUPS)) {
    assert.ok(group.units[group.base] === 1, `${groupId} base must have factor 1`);
    assert.ok(Object.values(group.units).every(factor => Number.isFinite(factor) && factor > 0));
    for (const unit of Object.keys(group.units)) {
      for (const value of [0, 1, -2.5, 1e-6, 1e6]) {
        const same = convertUnit(value, groupId, unit, unit);
        closeTo(same, value);
        if (value === 0) assert.equal(Object.is(same, -0), false);
      }
    }
    const units = Object.keys(group.units);
    const roundTripInput = groupId === "storage" ? 0.001 : 12.345;
    for (const from of units) {
      for (const to of units) {
        const converted = convertUnit(roundTripInput, groupId, from, to);
        const roundTrip = convertUnit(converted, groupId, to, from);
        closeTo(roundTrip, roundTripInput);
      }
    }
  }
});

test("known proportional conversion values and overflow behavior are correct", () => {
  closeTo(convertUnit(1, "length", "mi", "km"), 1.609344);
  closeTo(convertUnit(1, "weight", "lb", "kg"), 0.45359237);
  closeTo(convertUnit(1, "area", "acre", "m2"), 4046.8564224);
  closeTo(convertUnit(1, "volume", "gal_us", "l"), 3.785411784);
  closeTo(convertUnit(100, "speed", "kph", "mph"), 62.1371192237);
  closeTo(convertUnit(1, "time", "week", "day"), 7);
  assert.equal(convertUnit("1e308", "length", "km", "mm"), null);
  assert.equal(convertUnit("not-a-number", "length", "m", "ft"), null);
});

test("temperature enforces absolute zero for every source scale", () => {
  assert.equal(typeof core.validateTemperatureInput, "function");
  closeTo(convertTemperature(0, "k", "c"), -273.15);
  closeTo(convertTemperature(0, "k", "f"), -459.67);
  closeTo(convertTemperature(100, "c", "f"), 212);
  closeTo(convertTemperature(32, "f", "c"), 0);
  assert.equal(Object.is(convertTemperature(-0, "c", "c"), -0), false);

  assert.deepEqual(core.validateTemperatureInput("-273.15", "c"), { state: "valid", value: -273.15 });
  assert.deepEqual(core.validateTemperatureInput("-459.67", "f"), { state: "valid", value: -459.67 });
  assert.deepEqual(core.validateTemperatureInput("0", "k"), { state: "valid", value: 0 });
  assert.deepEqual(core.validateTemperatureInput("-273.151", "c"), { state: "out-of-range" });
  assert.deepEqual(core.validateTemperatureInput("-459.671", "f"), { state: "out-of-range" });
  assert.deepEqual(core.validateTemperatureInput("-0.001", "k"), { state: "out-of-range" });
  assert.deepEqual(core.validateTemperatureInput("-", "k"), { state: "editing" });
  assert.equal(convertTemperature(-273.151, "c", "f"), null);
  assert.equal(convertTemperature(-459.671, "f", "k"), null);
  assert.equal(convertTemperature(-0.001, "k", "c"), null);
});

test("storage distinguishes decimal SI and binary IEC units", () => {
  assert.deepEqual(Object.keys(UNIT_GROUPS.storage.units), [
    "B",
    "KB", "MB", "GB", "TB", "PB",
    "KiB", "MiB", "GiB", "TiB", "PiB",
  ]);
  assert.equal(convertUnit(1, "storage", "KB", "B"), 1000);
  assert.equal(convertUnit(1, "storage", "KiB", "B"), 1024);
  assert.equal(convertUnit(1, "storage", "GB", "MB"), 1000);
  assert.equal(convertUnit(1, "storage", "GiB", "MiB"), 1024);
  closeTo(convertUnit(1, "storage", "MiB", "MB"), 1.048576);
  assert.equal(convertUnit(10, "storage", "PiB", "B"), null);
});
