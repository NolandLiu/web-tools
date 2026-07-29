import { LANGUAGES, SITE_ORIGIN, TOOLS } from "../registry.js";
import { buildPath } from "./routes.js";

export const FEEDBACK_TYPES = [
  "incorrect",
  "missing-option",
  "experience",
  "suggestion",
];

const languageIds = new Set(LANGUAGES.map(language => language.id));
const toolsById = new Map(TOOLS.map(tool => [tool.id, tool]));

export function buildFeedbackMailto({
  toolId,
  slug,
  lang,
  canonicalUrl,
  type,
}) {
  const tool = toolsById.get(toolId);
  if (!tool || tool.slug !== slug) throw new Error("Unknown tool context.");
  if (!languageIds.has(lang)) throw new Error("Unsupported feedback language.");
  if (!FEEDBACK_TYPES.includes(type)) throw new Error("Unsupported feedback type.");

  const expectedUrl = `${SITE_ORIGIN}${buildPath({ kind: "tool", lang, toolId })}`;
  if (canonicalUrl !== expectedUrl) throw new Error("Feedback URL must be canonical.");

  const subject = `[GoDeskHub] Tool feedback: ${toolId}`;
  const body = [
    "Please describe the issue or suggestion below.",
    "",
    "--- Page context (no tool input or result is included) ---",
    `Tool ID: ${toolId}`,
    `Tool slug: ${slug}`,
    `Language: ${lang}`,
    `Feedback type: ${type}`,
    `Page URL: ${canonicalUrl}`,
  ].join("\n");

  return `mailto:support@godeskhub.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
