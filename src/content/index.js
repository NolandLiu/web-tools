import { CATEGORY_CONTENT } from "./category-content.js";
import { TOOL_CONTENT_EN } from "./tool-content.en.js";
import { NETWORK_TOOL_CONTENT } from "./network-tool-content.js";
import { TOOL_CONTENT_ZH_CN } from "./tool-content.zh-cn.js";
import { TOOL_CONTENT_ZH_TW } from "./tool-content.zh-tw.js";
import { getCatalogFaqsByToolId } from "../lib/catalog-data.js";

export { CATEGORY_CONTENT };

export const TOOL_CONTENT = Object.fromEntries(
  Object.keys({ ...TOOL_CONTENT_EN, ...NETWORK_TOOL_CONTENT.en })
    .filter(toolId => toolId !== "ip-info")
    .map(toolId => [
      toolId,
      {
        en: NETWORK_TOOL_CONTENT.en[toolId] ?? TOOL_CONTENT_EN[toolId],
        "zh-CN": NETWORK_TOOL_CONTENT["zh-CN"][toolId] ?? TOOL_CONTENT_ZH_CN[toolId],
        "zh-TW": NETWORK_TOOL_CONTENT["zh-TW"][toolId] ?? TOOL_CONTENT_ZH_TW[toolId],
      },
    ]),
);

for (const [toolId, localizedContent] of Object.entries(TOOL_CONTENT)) {
  for (const lang of ["en", "zh-CN", "zh-TW"]) {
    const faqs = getCatalogFaqsByToolId(toolId, lang);
    if (faqs.length > 0) {
      localizedContent[lang] = {
        ...localizedContent[lang],
        faqs,
      };
    }
  }
}
