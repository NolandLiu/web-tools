import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

test("every supported language has global and field copy", async () => {
  const source = await readFile(new URL("../src/i18n.ts", import.meta.url), "utf8");
  for (const language of ["en", "zh-CN", "zh-TW"]) {
    assert.match(source, new RegExp(`["']${language}["']`));
  }
  for (const key of ["input", "output", "swap", "copy", "copied", "copyFailed", "showHelp", "navigation"]) {
    assert.match(source, new RegExp(`${key}:`));
  }
});

test("field and result primitives expose help and copy status", async () => {
  const field = await readFile(new URL("../src/components/Field.tsx", import.meta.url), "utf8");
  const result = await readFile(new URL("../src/components/ResultCard.tsx", import.meta.url), "utf8");
  assert.match(field, /aria-describedby/);
  assert.match(field, /role="tooltip"/);
  assert.match(result, /aria-live="polite"/);
  assert.match(result, /navigator\.clipboard/);
  assert.match(result, /disabled=/);
});
