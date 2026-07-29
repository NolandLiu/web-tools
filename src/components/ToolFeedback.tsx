import { useState } from "react";
import { SITE_ORIGIN, TOOLS } from "../registry.js";
import { messages } from "../i18n";
import { buildFeedbackMailto } from "../lib/feedback.js";
import { buildPath } from "../lib/routes.js";
import type { FeedbackType } from "../lib/feedback.js";
import type { Lang, Tool } from "../types";

const feedbackLabels: Record<Lang, Record<FeedbackType, string>> = {
  en: {
    incorrect: "A result or explanation may be incorrect",
    "missing-option": "A unit or option is missing",
    experience: "Usability problem",
    suggestion: "Feature suggestion",
  },
  "zh-CN": {
    incorrect: "结果或说明可能有误",
    "missing-option": "缺少单位或选项",
    experience: "使用体验问题",
    suggestion: "功能建议",
  },
  "zh-TW": {
    incorrect: "結果或說明可能有誤",
    "missing-option": "缺少單位或選項",
    experience: "使用體驗問題",
    suggestion: "功能建議",
  },
};

export function ToolFeedback({ tool, lang }: { tool: Tool; lang: Lang }) {
  const [type, setType] = useState<FeedbackType>("incorrect");
  const registeredTool = TOOLS.find(item => item.id === tool.id);
  if (!registeredTool) return null;

  const canonicalUrl = `${SITE_ORIGIN}${buildPath({ kind: "tool", lang, toolId: tool.id })}`;
  const href = buildFeedbackMailto({
    toolId: tool.id,
    slug: registeredTool.slug,
    lang,
    canonicalUrl,
    type,
  });

  return (
    <section className="tool-feedback" aria-labelledby="tool-feedback-title">
      <div>
        <h2 id="tool-feedback-title">{messages[lang].feedback}</h2>
        <p>{messages[lang].feedbackPrompt}</p>
      </div>
      <div className="feedback-actions">
        <label>
          <span className="visually-hidden">{messages[lang].feedback}</span>
          <select value={type} onChange={event => setType(event.target.value as FeedbackType)}>
            {Object.entries(feedbackLabels[lang]).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <a className="button-secondary" href={href}>{messages[lang].feedback}</a>
      </div>
    </section>
  );
}
