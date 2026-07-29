import { CATEGORY_CONTENT } from "./category-content.js";
import { TOOL_CONTENT_EN } from "./tool-content.en.js";
import { TOOL_CONTENT_ZH_CN } from "./tool-content.zh-cn.js";
import { TOOL_CONTENT_ZH_TW } from "./tool-content.zh-tw.js";

export { CATEGORY_CONTENT };

export const TOOL_CONTENT = Object.fromEntries(
  Object.keys(TOOL_CONTENT_EN).map(toolId => [
    toolId,
    {
      en: TOOL_CONTENT_EN[toolId],
      "zh-CN": TOOL_CONTENT_ZH_CN[toolId],
      "zh-TW": TOOL_CONTENT_ZH_TW[toolId],
    },
  ]),
);
