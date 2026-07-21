import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("project contains the product shell", async () => {
  const i18n = await readFile(new URL("../src/i18n.ts", import.meta.url), "utf8");
  const catalog = await readFile(new URL("../src/catalog.ts", import.meta.url), "utf8");
  assert.match(i18n, /轻工具/);
  assert.match(i18n, /Lite Tools/);
  assert.match(i18n, /輕工具/);
  assert.match(catalog, /长度转换/);
  assert.match(catalog, /QR Code 生成器/);
  assert.match(i18n, /AdSense 默认关闭/);
});

test("source contains sidebar and mobile drawer accessibility contracts", async () => {
  const shell = await readFile(new URL("../src/components/AppShell.tsx", import.meta.url), "utf8");
  const sidebar = await readFile(new URL("../src/components/ToolSidebar.tsx", import.meta.url), "utf8");
  assert.match(shell, /aria-expanded/);
  assert.match(shell, /aria-controls="tool-navigation"/);
  assert.match(sidebar, /aria-current/);
  assert.match(sidebar, /<nav/);
});

test("application composes the redesigned shell and tool workspace", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.match(app, /<AppShell/);
  assert.match(app, /<ToolWorkspace/);
  assert.doesNotMatch(app, /function UnitTool/);
});
