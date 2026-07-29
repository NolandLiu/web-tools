import assert from "node:assert/strict";
import test from "node:test";
import { CATEGORIES, LANGUAGES, TOOLS } from "../src/registry.js";

const contentModule = await import("../src/content/index.js").catch(() => null);
const validationModule = await import("../src/lib/content.js").catch(() => null);

const requiredStrings = ["summary", "introduction", "reviewedAt"];
const requiredArrays = [
  "useCases",
  "steps",
  "principles",
  "limitations",
  "faqs",
  "references",
  "aliases",
  "keywords",
];
const forbiddenPlaceholder = /\b(?:TODO|TBD)\b|placeholder text|待补充|待完善|待補充|待完善|机器生成|機器生成/i;

test("content registry covers every current tool and category in all three languages", () => {
  assert.ok(contentModule, "Expected src/content/index.js to define the Phase 2 content registry.");
  const { CATEGORY_CONTENT, TOOL_CONTENT } = contentModule;

  assert.deepEqual(Object.keys(TOOL_CONTENT).sort(), TOOLS.map(tool => tool.id).sort());
  assert.deepEqual(Object.keys(CATEGORY_CONTENT).sort(), CATEGORIES.map(category => category.id).sort());

  for (const tool of TOOLS) {
    assert.deepEqual(Object.keys(TOOL_CONTENT[tool.id]).sort(), LANGUAGES.map(language => language.id).sort());
  }
  for (const category of CATEGORIES) {
    assert.deepEqual(Object.keys(CATEGORY_CONTENT[category.id]).sort(), LANGUAGES.map(language => language.id).sort());
  }
});

test("tool content has useful required sections without placeholders", () => {
  assert.ok(contentModule, "Expected the tool content registry to exist.");
  const serialized = JSON.stringify(contentModule.TOOL_CONTENT);
  assert.doesNotMatch(serialized, forbiddenPlaceholder);

  for (const tool of TOOLS) {
    for (const { id: lang } of LANGUAGES) {
      const content = contentModule.TOOL_CONTENT[tool.id][lang];
      for (const field of requiredStrings) {
        assert.equal(typeof content[field], "string", `${tool.id}.${lang}.${field} must be a string`);
        assert.ok(content[field].trim(), `${tool.id}.${lang}.${field} must not be empty`);
      }
      assert.match(content.reviewedAt, /^\d{4}-\d{2}-\d{2}$/);
      for (const field of requiredArrays) {
        assert.ok(Array.isArray(content[field]), `${tool.id}.${lang}.${field} must be an array`);
        assert.ok(content[field].length > 0, `${tool.id}.${lang}.${field} must not be empty`);
      }
      assert.ok(content.useCases.length >= 2);
      assert.ok(content.steps.length >= 3);
      assert.ok(content.principles.length >= 1);
      assert.ok(content.limitations.length >= 1);
      assert.ok(content.faqs.length >= 2 && content.faqs.length <= 4);
      assert.equal(new Set(content.faqs.map(item => item.question)).size, content.faqs.length);
      for (const faq of content.faqs) {
        assert.ok(faq.question.trim());
        assert.ok(faq.answer.trim());
      }
      assert.ok(content.example.title.trim());
      assert.ok(content.example.description.trim());
      for (const reference of content.references) {
        assert.ok(reference.label.trim());
        assert.doesNotThrow(() => new URL(reference.url));
        assert.ok(reference.url.startsWith("https://"), `${reference.url} must use HTTPS`);
      }
    }
  }
});

test("category content provides localized introductions, scenarios, and boundaries", () => {
  assert.ok(contentModule, "Expected the category content registry to exist.");
  for (const category of CATEGORIES) {
    for (const { id: lang } of LANGUAGES) {
      const content = contentModule.CATEGORY_CONTENT[category.id][lang];
      assert.ok(content.introduction.trim());
      assert.ok(content.useCases.length >= 2);
      assert.ok(content.distinction.trim());
    }
  }
});

test("special tool guidance matches the implemented behavior and boundaries", () => {
  assert.ok(contentModule, "Expected the special tool guidance to exist.");
  const { TOOL_CONTENT } = contentModule;

  assert.match(TOOL_CONTENT.json.en.introduction, /format.*minif.*valid/i);
  assert.match(TOOL_CONTENT.base64.en.limitations.join(" "), /encoding.*not encryption/i);
  assert.match(TOOL_CONTENT.url.en.principles.join(" "), /encodeURIComponent/);
  assert.match(TOOL_CONTENT.uuid.en.principles.join(" "), /version 4|v4/i);
  assert.match(TOOL_CONTENT.timestamp.en.introduction, /seconds.*milliseconds/i);
  assert.match(TOOL_CONTENT.timestamp.en.limitations.join(" "), /selected unit|never inferred/i);
  assert.doesNotMatch(TOOL_CONTENT.timestamp.en.limitations.join(" "), /100,000,000,000/);
  assert.match(TOOL_CONTENT.storage.en.principles.join(" "), /1,024|1024/);
  assert.match(TOOL_CONTENT.temperature.en.limitations.join(" "), /absolute zero|-273\.15/);
  assert.match(TOOL_CONTENT.bmi.en.limitations.join(" "), /not.*medical diagnosis/i);
  assert.match(TOOL_CONTENT.compound.en.principles.join(" "), /r\/n.*nt|periods per year/i);
  assert.match(TOOL_CONTENT.compound.en.limitations.join(" "), /1 to 365/);
  assert.match(TOOL_CONTENT.datecalc.en.limitations.join(" "), /not inclusive|excludes/i);
  assert.match(TOOL_CONTENT.text.en.principles.join(" "), /whitespace/i);
  assert.match(TOOL_CONTENT.qr.en.limitations.join(" "), /1,200|1200/);
});

test("content validator accepts the complete registry and reports exact counts", () => {
  assert.ok(validationModule, "Expected src/lib/content.js to validate content at test and build time.");
  assert.deepEqual(validationModule.validateContentRegistry(), {
    toolCount: 22,
    categoryCount: 4,
    languageCount: 3,
  });
});
