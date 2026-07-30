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
  listLegacyRedirects,
  listCanonicalRoutes,
  parsePath,
  switchRouteLanguage,
} from "../src/lib/routes.js";

test("registry contains the approved origin, languages, categories, and registered Phase 5 tools", () => {
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
    "network-ip",
  ]);
  assert.equal(TOOLS.length, 28);
  assert.deepEqual(TOOLS.slice(-3).map(tool => tool.id), [
    "ipv4-network",
    "ipv6-toolbox",
    "ip-info",
  ]);
  assert.equal(INFO_PAGES.length, 4);
});

test("tool and category slugs are unique and every reference is valid", () => {
  assert.equal(new Set(TOOLS.map(tool => tool.slug)).size, TOOLS.length);
  assert.equal(new Set(CATEGORIES.map(category => category.slug)).size, CATEGORIES.length);
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

test("canonical route enumeration covers every registered localized page exactly once", () => {
  const routes = listCanonicalRoutes();
  const paths = routes.map(buildPath);
  const expected = LANGUAGES.length * (1 + TOOLS.length + CATEGORIES.length + INFO_PAGES.length);
  assert.equal(routes.length, expected);
  assert.equal(new Set(paths).size, expected);
  assert.ok(paths.includes("/en/tools/qr-code-generator"));
  assert.ok(paths.includes("/en/tools/irr-calculator"));
  assert.ok(paths.includes("/zh-cn/tools/cheque-amount-converter"));
  assert.ok(paths.includes("/zh-tw/tools/password-generator"));
  assert.ok(paths.includes("/en/tools/ipv4-network-toolbox"));
  assert.ok(paths.includes("/zh-cn/tools/ipv6-toolbox"));
  assert.ok(paths.includes("/zh-tw/tools/ip-info-lookup"));
  assert.ok(!paths.some(path => /ipv4-subnet-calculator|ip-range-cidr-converter|ip-address-converter|ipv6-address-tool|ip-lookup$|ip-whois-rdap/.test(path)));
  assert.ok(paths.includes("/en/categories/network-ip"));
  assert.ok(paths.includes("/zh-cn/categories/calculators"));
  assert.ok(paths.includes("/zh-tw/contact"));
  assert.ok(paths.every(path => /^\/(en|zh-cn|zh-tw)\//.test(path)));
});

test("legacy network tool routes redirect to consolidated canonical pages and anchors", () => {
  assert.deepEqual(parsePath("/en/tools/ipv4-network-toolbox"), { kind: "tool", lang: "en", toolId: "ipv4-network" });
  assert.deepEqual(parsePath("/zh-cn/tools/ipv6-toolbox"), { kind: "tool", lang: "zh-CN", toolId: "ipv6-toolbox" });
  assert.deepEqual(parsePath("/zh-tw/tools/ip-info-lookup"), { kind: "tool", lang: "zh-TW", toolId: "ip-info" });

  const redirects = listLegacyRedirects();
  assert.ok(redirects.some(item => item.from === "/en/tools/ipv4-subnet-calculator" && item.to === "/en/tools/ipv4-network-toolbox#subnet"));
  assert.ok(redirects.some(item => item.from === "/zh-cn/tools/ip-range-cidr-converter" && item.to === "/zh-cn/tools/ipv4-network-toolbox#range-cidr"));
  assert.ok(redirects.some(item => item.from === "/zh-tw/tools/ip-address-converter" && item.to === "/zh-tw/tools/ipv4-network-toolbox#ipv4-converter"));
  assert.ok(redirects.some(item => item.from === "/en/tools/ipv6-address-tool" && item.to === "/en/tools/ipv6-toolbox#ipv6-normalize"));
  assert.ok(redirects.some(item => item.from === "/zh-cn/tools/ip-lookup" && item.to === "/zh-cn/tools/ip-info-lookup#ip-lookup"));
  assert.ok(redirects.some(item => item.from === "/zh-tw/tools/ip-whois-rdap" && item.to === "/zh-tw/tools/ip-info-lookup#ip-rdap"));
  assert.equal(new Set(redirects.map(item => item.from)).size, redirects.length);
});
