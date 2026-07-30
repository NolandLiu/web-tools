import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

let search;
try {
  search = await import("../src/lib/search.js");
} catch {
  search = null;
}

test("localized search covers names, aliases, keywords, scenarios, and categories", () => {
  assert.ok(search, "search module must exist");
  assert.equal(search.searchTools("JSON", "en")[0].toolId, "json");
  assert.equal(search.searchTools("GUID", "en")[0].toolId, "uuid");
  assert.equal(search.searchTools("身体质量", "zh-CN")[0].toolId, "bmi");
  assert.equal(search.searchTools("掃描", "zh-TW")[0].toolId, "qr");
  assert.ok(search.searchTools("debugging", "en").some(result => result.toolId === "json"));
  assert.ok(search.searchTools("unit converters", "en").some(result => result.toolId === "length"));
});

test("search results use the current language route and useful labels", () => {
  assert.ok(search, "search module must exist");
  const [result] = search.searchTools("base64", "zh-CN");
  assert.equal(result.toolId, "base64");
  assert.equal(result.path, "/zh-cn/tools/base64-encoder-decoder");
  assert.ok(result.name);
  assert.ok(result.category);
  assert.ok(result.summary);
  assert.deepEqual(search.searchTools("", "en"), []);
  assert.deepEqual(search.searchTools("definitely-no-tool", "en"), []);
});

test("network search aliases resolve to consolidated main pages", () => {
  assert.ok(search, "search module must exist");
  assert.equal(search.searchTools("subnet mask", "en")[0].toolId, "ipv4-network");
  assert.equal(search.searchTools("range to CIDR", "en")[0].toolId, "ipv4-network");
  assert.equal(search.searchTools("IPv6 prefix", "en")[0].toolId, "ipv6-toolbox");
  assert.equal(search.searchTools("IP RDAP", "en")[0].toolId, "ip-info");
  assert.equal(search.searchTools("子网计算", "zh-CN")[0].path, "/zh-cn/tools/ipv4-network-toolbox");
  assert.equal(search.searchTools("RDAP 查詢", "zh-TW")[0].path, "/zh-tw/tools/ip-info-lookup");
});

test("keyboard selection wraps safely", () => {
  assert.ok(search, "search module must exist");
  assert.equal(search.moveSearchSelection(-1, "next", 3), 0);
  assert.equal(search.moveSearchSelection(2, "next", 3), 0);
  assert.equal(search.moveSearchSelection(0, "previous", 3), 2);
  assert.equal(search.moveSearchSelection(0, "next", 0), -1);
});

test("search dialog exposes shortcut, focus, ARIA, and keyboard controls", async () => {
  const source = await readFile(new URL("../src/components/SearchDialog.tsx", import.meta.url), "utf8");
  assert.match(source, /event\.(metaKey|ctrlKey)[\s\S]*event\.key\.toLowerCase\(\) === "k"/);
  assert.match(source, /ArrowDown/);
  assert.match(source, /ArrowUp/);
  assert.match(source, /Enter/);
  assert.match(source, /Escape/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /role="combobox"/);
  assert.match(source, /role="listbox"/);
  assert.match(source, /aria-activedescendant/);
  assert.match(source, /inputRef\.current\?\.focus/);
  assert.match(source, /previousFocusRef\.current[\s\S]*\.focus/);
});
