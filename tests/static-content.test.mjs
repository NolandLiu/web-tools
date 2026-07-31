import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { generateSite } from "../scripts/generate-static-pages.mjs";
import { TOOL_CONTENT } from "../src/content/index.js";

const analyticsScriptUrl = "https://www.googletagmanager.com/gtag/js?id=G-N47VDQ0D85";
const analyticsConfigCall = "gtag('config', 'G-N47VDQ0D85')";

async function generateFixture() {
  const root = await mkdtemp(join(tmpdir(), "godeskhub-content-"));
  const template = await readFile(new URL("../index.html", import.meta.url), "utf8");
  await writeFile(join(root, "index.html"), template);
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
  assert.match(privacy, /Google Analytics/);
  assert.match(privacy, /工具輸入、輸出、密碼、金額、QR Code 內容、檔案和自由文字不會由應用程式傳送到 Google Analytics/);
  assert.doesNotMatch(privacy, /"@type":"FAQPage"/);
  assert.match(notFound, /data-static-route="not-found"/);
  assert.match(notFound, /Page not found/);
});

test("static HTML pages include one Google tag inherited from the template", async () => {
  const root = await generateFixture();
  const paths = [
    join(root, "en", "index.html"),
    join(root, "en", "tools", "json-tools.html"),
    join(root, "zh-cn", "categories", "developer-tools.html"),
    join(root, "zh-tw", "privacy.html"),
    join(root, "404.html"),
  ];

  for (const path of paths) {
    const html = await readFile(path, "utf8");
    assert.equal(html.split(analyticsScriptUrl).length - 1, 1);
    assert.equal((html.match(/window\.dataLayer = window\.dataLayer \|\| \[\]/g) ?? []).length, 1);
    assert.equal((html.match(new RegExp(analyticsConfigCall.replace(/[()']/g, "\\$&"), "g")) ?? []).length, 1);
    assert.ok(html.indexOf("<head>") < html.indexOf(analyticsScriptUrl));
    assert.ok(html.indexOf(analyticsScriptUrl) < html.indexOf("<!-- route-metadata:start -->"));
  }
});

test("network category static HTML lists only consolidated network pages", async () => {
  const root = await generateFixture();
  const category = await readFile(join(root, "en", "categories", "network-ip.html"), "utf8");
  assert.match(category, /IPv4 network toolbox/);
  assert.match(category, /IPv6 toolbox/);
  assert.doesNotMatch(category, /IP information lookup/);
  assert.doesNotMatch(category, /IPv4 subnet calculator/);
  assert.doesNotMatch(category, /IP range and CIDR converter/);
  assert.doesNotMatch(category, /IP WHOIS \/ RDAP lookup/);
  await assert.rejects(
    readFile(join(root, "en", "tools", "ip-info-lookup.html"), "utf8"),
    /ENOENT/,
  );
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
