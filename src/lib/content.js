import { CATEGORY_CONTENT, TOOL_CONTENT } from "../content/index.js";
import { CATEGORIES, LANGUAGES, TOOLS } from "../registry.js";

const REQUIRED_STRINGS = ["summary", "introduction", "reviewedAt"];
const REQUIRED_ARRAYS = [
  "useCases",
  "steps",
  "principles",
  "limitations",
  "faqs",
  "references",
  "aliases",
  "keywords",
];
const PLACEHOLDER_PATTERN = /\b(?:TODO|TBD)\b|placeholder text|待补充|待完善|待補充|待完善|机器生成|機器生成/i;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function validateToolLocale(toolId, lang, content) {
  assert(content && typeof content === "object", `Missing ${toolId}.${lang} content.`);
  for (const field of REQUIRED_STRINGS) {
    assert(typeof content[field] === "string" && content[field].trim(), `Invalid ${toolId}.${lang}.${field}.`);
  }
  assert(/^\d{4}-\d{2}-\d{2}$/.test(content.reviewedAt), `Invalid ${toolId}.${lang}.reviewedAt.`);
  for (const field of REQUIRED_ARRAYS) {
    assert(Array.isArray(content[field]) && content[field].length > 0, `Invalid ${toolId}.${lang}.${field}.`);
  }
  assert(content.useCases.length >= 2, `${toolId}.${lang} needs at least two use cases.`);
  assert(content.steps.length >= 3, `${toolId}.${lang} needs at least three steps.`);
  assert(content.faqs.length >= 2 && content.faqs.length <= 4, `${toolId}.${lang} needs 2-4 FAQs.`);
  assert(content.example?.title?.trim() && content.example?.description?.trim(), `Invalid ${toolId}.${lang}.example.`);
  assert(new Set(content.faqs.map(item => item.question)).size === content.faqs.length, `Duplicate FAQ in ${toolId}.${lang}.`);
  for (const faq of content.faqs) {
    assert(faq.question?.trim() && faq.answer?.trim(), `Empty FAQ in ${toolId}.${lang}.`);
  }
  for (const reference of content.references) {
    assert(reference.label?.trim(), `Empty reference label in ${toolId}.${lang}.`);
    let parsed;
    try {
      parsed = new globalThis.URL(reference.url);
    } catch {
      throw new Error(`Invalid reference URL in ${toolId}.${lang}.`);
    }
    assert(parsed.protocol === "https:", `Reference must use HTTPS in ${toolId}.${lang}.`);
  }
  assert(!PLACEHOLDER_PATTERN.test(JSON.stringify(content)), `Placeholder text found in ${toolId}.${lang}.`);
}

export function validateContentRegistry() {
  const languageIds = LANGUAGES.map(language => language.id);
  const toolIds = TOOLS.map(tool => tool.id);
  const categoryIds = CATEGORIES.map(category => category.id);

  assert(Object.keys(TOOL_CONTENT).length === toolIds.length, "Tool content count does not match the registry.");
  assert(Object.keys(CATEGORY_CONTENT).length === categoryIds.length, "Category content count does not match the registry.");
  assert(Object.keys(TOOL_CONTENT).every(id => toolIds.includes(id)), "Tool content contains an unknown tool ID.");
  assert(Object.keys(CATEGORY_CONTENT).every(id => categoryIds.includes(id)), "Category content contains an unknown category ID.");

  for (const toolId of toolIds) {
    assert(TOOL_CONTENT[toolId], `Missing content for ${toolId}.`);
    for (const lang of languageIds) validateToolLocale(toolId, lang, TOOL_CONTENT[toolId][lang]);
  }
  for (const categoryId of categoryIds) {
    for (const lang of languageIds) {
      const content = CATEGORY_CONTENT[categoryId]?.[lang];
      assert(content?.introduction?.trim(), `Missing ${categoryId}.${lang}.introduction.`);
      assert(Array.isArray(content.useCases) && content.useCases.length >= 2, `Missing ${categoryId}.${lang}.useCases.`);
      assert(content.distinction?.trim(), `Missing ${categoryId}.${lang}.distinction.`);
      assert(!PLACEHOLDER_PATTERN.test(JSON.stringify(content)), `Placeholder text found in ${categoryId}.${lang}.`);
    }
  }

  return {
    toolCount: toolIds.length,
    categoryCount: categoryIds.length,
    languageCount: languageIds.length,
  };
}
