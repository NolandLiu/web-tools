import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("project contains the product shell", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.match(app, /轻工具/);
  assert.match(app, /长度转换/);
  assert.match(app, /所有数据仅在你的浏览器中处理/);
});
