import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { generateSite } from "../scripts/generate-static-pages.mjs";
import { TOOL_CONTENT } from "../src/content/index.js";

async function generateFixture() {
  const root = await mkdtemp(join(tmpdir(), "godeskhub-content-"));
  await writeFile(
    join(root, "index.html"),
    '<!doctype html><html lang="en"><head><!-- route-metadata:start --><title>Template</title><!-- route-metadata:end --></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>',
  );
  await generateSite({ distDir: root });
  return root;
}

test("three-language tool HTML contains useful visible content before JavaScript", async () => {
  const root = await generateFixture();
  const fixtures = [
    ["en", "json-tools", "json", "Format, minify, and validate JSON"],
    ["zh-cn", "bmi-calculator", "bmi", "BMI"],
    ["zh-tw", "qr-code-generator", "qr", "QR Code"],
  ];

  for (const [pathLang, slug, toolId, marker] of fixtures) {
    const html = await readFile(join(root, pathLang, "tools", `${slug}.html`), "utf8");
    assert.match(html, /<main class="static-route-content" data-static-route="tool">/);
    assert.ok(html.includes(marker));
    assert.ok(html.indexOf('class="static-tool-surface"') < html.indexOf('class="static-tool-guide"'));
    for (const faq of TOOL_CONTENT[toolId][pathLang === "en" ? "en" : pathLang === "zh-cn" ? "zh-CN" : "zh-TW"].faqs) {
      assert.ok(html.includes(faq.question));
      assert.ok(html.includes(faq.answer));
    }
    assert.match(html, /mailto:support@godeskhub\.com/);
    assert.equal((html.match(/type="application\/ld\+json"/g) ?? []).length, 1);
  }
});

test("category, home, information, and 404 HTML have distinct visible shells", async () => {
  const root = await generateFixture();
  const home = await readFile(join(root, "en", "index.html"), "utf8");
  const category = await readFile(join(root, "zh-cn", "categories", "developer-tools.html"), "utf8");
  const privacy = await readFile(join(root, "zh-tw", "privacy.html"), "utf8");
  const notFound = await readFile(join(root, "404.html"), "utf8");

  assert.match(home, /data-static-route="home"/);
  assert.match(home, /role="search"/);
  assert.match(category, /data-static-route="category"/);
  assert.match(category, /格式与开发工具/);
  assert.match(category, /JSON 工具/);
  assert.match(category, /本分类处理表示形式和标识符/);
  assert.match(privacy, /data-static-route="info"/);
  assert.match(privacy, /隱私權政策/);
  assert.doesNotMatch(privacy, /"@type":"FAQPage"/);
  assert.match(notFound, /data-static-route="not-found"/);
  assert.match(notFound, /Page not found/);
});

test("visible FAQ and FAQPage JSON-LD are generated from the same content", async () => {
  const root = await generateFixture();
  const html = await readFile(join(root, "en", "tools", "json-tools.html"), "utf8");
  const script = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script);
  const jsonLd = JSON.parse(script);
  const faq = jsonLd["@graph"].find(entity => entity["@type"] === "FAQPage");
  assert.deepEqual(
    faq.mainEntity.map(entity => [entity.name, entity.acceptedAnswer.text]),
    TOOL_CONTENT.json.en.faqs.map(item => [item.question, item.answer]),
  );
});
