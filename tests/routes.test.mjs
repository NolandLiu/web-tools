import assert from "node:assert/strict";
import test from "node:test";
import {
  CATEGORIES,
  DEFAULT_LANG,
  INFO_PAGES,
  LANGUAGES,
  SITE_ORIGIN,
  TOOLS,
} from "../src/registry.js";
import {
  buildPath,
  listCanonicalRoutes,
  parsePath,
  switchRouteLanguage,
} from "../src/lib/routes.js";

test("registry contains the approved origin, languages, categories, and all 22 tools", () => {
  assert.equal(SITE_ORIGIN, "https://tools.godeskhub.com");
  assert.equal(DEFAULT_LANG, "en");
  assert.deepEqual(
    LANGUAGES.map(({ id, path, htmlLang, hreflang }) => ({ id, path, htmlLang, hreflang })),
    [
      { id: "en", path: "en", htmlLang: "en", hreflang: "en" },
      { id: "zh-CN", path: "zh-cn", htmlLang: "zh-CN", hreflang: "zh-CN" },
      { id: "zh-TW", path: "zh-tw", htmlLang: "zh-TW", hreflang: "zh-TW" },
    ],
  );
  assert.deepEqual(CATEGORIES.map(category => category.slug), [
    "unit-converters",
    "developer-tools",
    "calculators",
    "qr-code",
  ]);
  assert.equal(TOOLS.length, 22);
  assert.equal(INFO_PAGES.length, 4);
});

test("tool and category slugs are unique and every reference is valid", () => {
  assert.equal(new Set(TOOLS.map(tool => tool.slug)).size, 22);
  assert.equal(new Set(CATEGORIES.map(category => category.slug)).size, 4);
  const categoryIds = new Set(CATEGORIES.map(category => category.id));
  for (const tool of TOOLS) {
    assert.ok(categoryIds.has(tool.category), `${tool.id} references an unknown category`);
  }
});

test("every tool and category has localized names, descriptions, and SEO metadata inputs", () => {
  for (const item of [...TOOLS, ...CATEGORIES]) {
    for (const language of ["en", "zh-CN", "zh-TW"]) {
      assert.ok(item.text[language].name, `${item.id} lacks ${language} name`);
      assert.ok(item.text[language].description, `${item.id} lacks ${language} description`);
    }
  }
});

test("localized home, tool, category, and information paths resolve semantically", () => {
  assert.deepEqual(parsePath("/en/"), { kind: "home", lang: "en" });
  assert.deepEqual(parsePath("/zh-cn/tools/json-tools"), { kind: "tool", lang: "zh-CN", toolId: "json" });
  assert.deepEqual(parsePath("/zh-tw/categories/unit-converters"), { kind: "category", lang: "zh-TW", categoryId: "units" });
  assert.deepEqual(parsePath("/en/privacy"), { kind: "info", lang: "en", page: "privacy" });
});

test("unknown languages, tools, categories, and extra segments resolve to 404", () => {
  assert.deepEqual(parsePath("/fr/tools/json-tools"), { kind: "not-found", lang: "en" });
  assert.deepEqual(parsePath("/en/tools/not-real"), { kind: "not-found", lang: "en" });
  assert.deepEqual(parsePath("/zh-cn/categories/not-real"), { kind: "not-found", lang: "zh-CN" });
  assert.deepEqual(parsePath("/en/privacy/extra"), { kind: "not-found", lang: "en" });
});

test("path building and language switching preserve page semantics", () => {
  const toolRoute = { kind: "tool", lang: "en", toolId: "length" };
  assert.equal(buildPath(toolRoute), "/en/tools/length-converter");
  assert.deepEqual(switchRouteLanguage(toolRoute, "zh-TW"), {
    kind: "tool",
    lang: "zh-TW",
    toolId: "length",
  });
  assert.equal(buildPath(switchRouteLanguage(toolRoute, "zh-TW")), "/zh-tw/tools/length-converter");
  assert.equal(buildPath({ kind: "category", lang: "zh-CN", categoryId: "developer" }), "/zh-cn/categories/developer-tools");
});

test("canonical route enumeration has 93 unique final pages", () => {
  const routes = listCanonicalRoutes();
  const paths = routes.map(buildPath);
  assert.equal(routes.length, 93);
  assert.equal(new Set(paths).size, 93);
  assert.ok(paths.includes("/en/tools/qr-code-generator"));
  assert.ok(paths.includes("/zh-cn/categories/calculators"));
  assert.ok(paths.includes("/zh-tw/contact"));
  assert.ok(paths.every(path => /^\/(en|zh-cn|zh-tw)\//.test(path)));
});
