import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

import { TOOLS } from "../src/registry.js";
import { readToolStats, trackToolOpen } from "../src/lib/core.js";
import { buildPath, parsePath } from "../src/lib/routes.js";
import { TOOL_CONTRACTS } from "../src/lib/tool-contracts.js";

const toolIds = new Set(TOOLS.map(tool => tool.id));

function memoryStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  const writes = [];
  return {
    writes,
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      writes.push([key, value]);
      values.set(key, value);
    },
  };
}

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async entry => {
    const path = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(?:js|ts|tsx)$/.test(entry.name) ? [path] : [];
  }));
  return nested.flat();
}

test("tool URL state is an explicit empty allowlist and query input is ignored", () => {
  for (const tool of TOOLS) {
    assert.deepEqual(TOOL_CONTRACTS[tool.id].privacy.urlFields, []);
    const route = { kind: "tool", lang: "en", toolId: tool.id };
    assert.equal(buildPath(route).includes("?"), false);
    assert.deepEqual(parsePath(`${buildPath(route)}?input=private&result=secret`), route);
  }
});

test("local tool stats accept only registered IDs and validated aggregate values", () => {
  const malformed = memoryStorage({
    "lite-tools:tool-stats": JSON.stringify({
      version: 1,
      tools: {
        json: { count: -1, lastOpenedAt: "now" },
        unknown: { count: 100, lastOpenedAt: 1000 },
        length: { count: 2, lastOpenedAt: 1000 },
      },
    }),
  });
  assert.deepEqual(readToolStats(malformed, toolIds), {
    version: 1,
    tools: { length: { count: 2, lastOpenedAt: 1000 } },
  });

  const writesBefore = malformed.writes.length;
  const unchanged = trackToolOpen(malformed, "unknown", 2000, toolIds);
  assert.deepEqual(unchanged.tools, { length: { count: 2, lastOpenedAt: 1000 } });
  assert.equal(malformed.writes.length, writesBefore);
});

test("tool runtime source contains no external request or dynamic execution primitives", async () => {
  const paths = await sourceFiles(new URL("../src/tools/", import.meta.url).pathname);
  const source = (await Promise.all(paths.map(path => readFile(path, "utf8")))).join("\n");
  const fetchMatches = source.match(/\bfetch\s*\(/g) ?? [];
  assert.equal(fetchMatches.length, 1, "only the NetworkTools same-origin helper may call fetch");
  assert.match(source, /fetch\(path, \{ method: "POST"/);
  assert.doesNotMatch(source, /XMLHttpRequest|sendBeacon\s*\(/);
  assert.doesNotMatch(source, /\beval\s*\(|new\s+Function\s*\(|dangerouslySetInnerHTML/);
});

test("password and QR production sources exclude weak random and remote logo paths", async () => {
  const password = await readFile(new URL("../src/lib/password.js", import.meta.url), "utf8");
  const qr = await readFile(new URL("../src/tools/QrTool.tsx", import.meta.url), "utf8");
  assert.match(password, /crypto\?\.getRandomValues|crypto\.getRandomValues/);
  assert.doesNotMatch(password, /Math\.random/);
  assert.doesNotMatch(qr, /\bfetch\s*\(|https?:\/\/[^"]*logo/i);
  assert.match(qr, /accept="image\/png,image\/jpeg,image\/webp"/);
  assert.match(qr, /download="lite-tools-qr\.png"/);
});

test("cheque formatting options do not serialize user amounts or results", async () => {
  const cheque = await readFile(new URL("../src/tools/ChequeTool.tsx", import.meta.url), "utf8");
  assert.match(cheque, /formatChequeAmount\(input, \{ currency, englishCase, chineseScript \}\)/);
  assert.doesNotMatch(cheque, /localStorage|sessionStorage|indexedDB|URLSearchParams|history\.pushState|history\.replaceState/);
  assert.doesNotMatch(cheque, /metadata|jsonLd|feedback/i);
});

test("persistent tool contracts contain no user input or result fields", () => {
  for (const contract of Object.values(TOOL_CONTRACTS)) {
    assert.deepEqual(contract.privacy.persistentFields, []);
    assert.equal(contract.privacy.network, contract.id === "ip-info");
  }
});

test("only approved network tools call same-origin network API paths", async () => {
  const source = await readFile(new URL("../src/tools/NetworkTools.tsx", import.meta.url), "utf8");
  assert.match(source, /NETWORK_API_PATHS\.lookup/);
  assert.match(source, /NETWORK_API_PATHS\.rdap/);
  assert.match(source, /mode: "current"/);
  assert.match(source, /Use my current IP/);
  assert.match(source, /使用当前 IP/);
  assert.match(source, /使用目前 IP/);
  assert.match(source, /Upstream services are temporarily limited/);
  assert.match(source, /上游服务暂时限流/);
  assert.match(source, /上游服務暫時限流/);
  assert.doesNotMatch(source, /https?:\/\/(?:[^"']+)/);
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB|URLSearchParams|history\.pushState|history\.replaceState/);
});

test("privacy policy names Google Analytics and excludes tool content from analytics", async () => {
  const source = await readFile(new URL("../src/App.tsx", import.meta.url), "utf8");
  assert.match(source, /Google Analytics/);
  assert.match(source, /Google tag/);
  assert.match(source, /工具输入、输出、密码、金额、二维码内容、文件和自由文本不会由应用发送到 Google Analytics/);
  assert.match(source, /工具輸入、輸出、密碼、金額、QR Code 內容、檔案和自由文字不會由應用程式傳送到 Google Analytics/);
  assert.match(source, /[Tt]ool inputs, outputs, passwords, amounts, QR Code content, files, and free-form text are not sent to Google Analytics/);
});
