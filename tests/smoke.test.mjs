import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("project contains the product shell", async () => {
  const i18n = await readFile(new URL("../src/i18n.ts", import.meta.url), "utf8");
  const registry = await readFile(new URL("../src/registry.js", import.meta.url), "utf8");
  assert.match(i18n, /GoDeskHub/);
  assert.match(registry, /长度转换/);
  assert.match(registry, /QR Code 生成器/);
  assert.doesNotMatch(i18n, /AdSense 默认关闭|AdSense is disabled|AdSense 預設關閉/);
});

test("compliance pages use public GoDeskHub policy content", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  const shell = await readFile(new URL("../src/components/AppShell.tsx", import.meta.url), "utf8");
  const index = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const manifest = await readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8");

  for (const text of [
    "About GoDeskHub",
    "Privacy Policy",
    "Terms of Service",
    "Contact Us",
    "support@godeskhub.com",
    "Cookies and Web Beacons",
    "Third-Party Advertising",
    "Most of our tools execute directly in your web browser",
    "© 2026 GoDeskHub. All rights reserved.",
  ]) {
    assert.match(`${app}\n${shell}`, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }

  assert.match(index, /https:\/\/tools\.godeskhub\.com\/en\//);
  assert.match(manifest, /"name": "GoDeskHub"/);
  assert.doesNotMatch(`${app}\n${index}`, /googlesyndication|adsbygoogle|ca-pub-/);
});

test("source contains sidebar and mobile drawer accessibility contracts", async () => {
  const shell = await readFile(new URL("../src/components/AppShell.tsx", import.meta.url), "utf8");
  const sidebar = await readFile(new URL("../src/components/ToolSidebar.tsx", import.meta.url), "utf8");
  assert.match(shell, /aria-expanded/);
  assert.match(shell, /aria-controls="tool-navigation"/);
  assert.match(sidebar, /aria-current/);
  assert.match(sidebar, /<nav/);
});

test("topbar stays focused on brand, language, and tool navigation controls", async () => {
  const shell = await readFile(new URL("../src/components/AppShell.tsx", import.meta.url), "utf8");
  assert.doesNotMatch(shell, /className="topbar-links"/);
  assert.doesNotMatch(shell, /\{t\.adsOff\}/);
  assert.match(shell, /className="footer-links"/);
  assert.match(shell, /© 2026 GoDeskHub\. All rights reserved\./);
});

test("application composes the redesigned shell and tool workspace", async () => {
  const app = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.match(app, /<AppShell/);
  assert.match(app, /<ToolWorkspace/);
  assert.doesNotMatch(app, /function UnitTool/);
});
