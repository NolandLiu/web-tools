import { CATEGORY_CONTENT } from "./category-content.js";
import { TOOL_CONTENT_EN } from "./tool-content.en.js";
import { NETWORK_TOOL_CONTENT } from "./network-tool-content.js";
import { TOOL_CONTENT_ZH_CN } from "./tool-content.zh-cn.js";
import { TOOL_CONTENT_ZH_TW } from "./tool-content.zh-tw.js";

export { CATEGORY_CONTENT };

export const TOOL_CONTENT = Object.fromEntries(
  Object.keys({ ...TOOL_CONTENT_EN, ...NETWORK_TOOL_CONTENT.en }).map(toolId => [
    toolId,
    {
      en: NETWORK_TOOL_CONTENT.en[toolId] ?? TOOL_CONTENT_EN[toolId],
      "zh-CN": NETWORK_TOOL_CONTENT["zh-CN"][toolId] ?? TOOL_CONTENT_ZH_CN[toolId],
      "zh-TW": NETWORK_TOOL_CONTENT["zh-TW"][toolId] ?? TOOL_CONTENT_ZH_TW[toolId],
    },
  ]),
);
