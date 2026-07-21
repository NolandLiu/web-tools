import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("project contains the product shell", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.match(app, /轻工具/);
  assert.match(app, /Lite Tools/);
  assert.match(app, /輕工具/);
  assert.match(app, /长度转换/);
  assert.match(app, /QR Code 生成器/);
  assert.match(app, /AdSense 默认关闭/);
});
