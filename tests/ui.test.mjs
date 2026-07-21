import assert from "node:assert/strict";
import test from "node:test";
import {
  buildToolTree,
  getCopyState,
  serializeStatsResult,
  swapConversion,
} from "../src/lib/ui.js";

test("tool tree preserves category and tool order", () => {
  const tree = buildToolTree([
    { id: "json", category: "developer", order: 2 },
    { id: "length", category: "units", order: 1 },
  ], ["units", "developer"]);

  assert.deepEqual(tree.map(group => [group.id, group.tools.map(tool => tool.id)]), [
    ["units", ["length"]],
    ["developer", ["json"]],
  ]);
});

test("swap uses the current output as the next input when valid", () => {
  assert.deepEqual(swapConversion({ input: "1", output: "3.28", from: "m", to: "ft" }), {
    input: "3.28",
    from: "ft",
    to: "m",
  });
  assert.deepEqual(swapConversion({ input: "1", output: "", from: "m", to: "ft" }), {
    input: "1",
    from: "ft",
    to: "m",
  });
});

test("invalid and empty outputs are not copyable", () => {
  assert.equal(getCopyState("", ["Invalid"]), "disabled");
  assert.equal(getCopyState("Invalid", ["Invalid"]), "disabled");
  assert.equal(getCopyState("42", ["Invalid"]), "ready");
});

test("text statistics serialize into a portable copy value", () => {
  assert.equal(
    serializeStatsResult({ characters: 12, words: 3, lines: 2 }),
    "Characters: 12\nWords: 3\nLines: 2",
  );
});
