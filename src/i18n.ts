import type { FieldCopy, Lang, LocalizedText } from "./types";

export const LANGS: Lang[] = ["en", "zh-CN", "zh-TW"];

export const messages = {
  en: {
    siteName: "GoDeskHub", tagline: "Free, fast, privacy-first online tools for everyday work.", search: "Search tools",
    popular: "Popular tools", allTools: "All tools", noResults: "No matching tools.", privacyBadge: "Inputs stay in your browser",
    open: "Open", copy: "Copy", copied: "Copied", copyFailed: "Copy failed", clear: "Clear", reset: "Reset", swap: "Swap",
    input: "Input", output: "Output", from: "From", to: "To", value: "Value", result: "Result", invalid: "Enter a finite valid value.", belowAbsoluteZero: "Temperature cannot be below absolute zero.",
    nonNegative: "Enter zero or a positive value.", percentRange: "Enter a percentage from 0 to 100.", bmiWeightRange: "Enter a weight greater than 0 and no more than 1,000 kg.", bmiHeightRange: "Enter a height greater than 0 and no more than 300 cm.", compoundRateRange: "Enter a rate that keeps each compounding factor above zero.", yearRange: "Enter a duration from 0 to 1,000 years.", frequencyRange: "Enter a whole number from 1 to 365.", invalidDate: "Choose a valid Gregorian calendar date.",
    invalidJson: "Enter valid JSON.", unsafeJsonInteger: "This JSON contains an integer outside JavaScript’s safe integer range and may lose precision.", inputTooLarge: "Input is too large to process safely.", invalidBase64: "Enter standard padded Base64 containing valid UTF-8 text.", invalidUrlEncoding: "Enter a complete valid percent-encoded sequence.", uuidUnavailable: "Secure UUID generation is unavailable in this browser.",
    about: "About Us", privacy: "Privacy Policy", terms: "Terms of Service", contact: "Contact Us", home: "Home", categories: "Categories", tools: "Tools",
    navigation: "Tool navigation", menu: "Open tool navigation", closeMenu: "Close tool navigation", showHelp: "Show field help", language: "Language", footerNavigation: "Footer navigation",
    related: "Related tools", usage: "How to use", useCases: "When to use this tool", example: "Example", principles: "How it works", limitations: "Limits and notes",
    faq: "Frequently asked questions", references: "References", reviewed: "Content last reviewed", feedback: "Send tool feedback", feedbackPrompt: "Choose a topic. Your tool input and result are never included.",
    generate: "Generate", download: "Download PNG", sourceText: "Source text",
    financeNote: "Results are for reference only and are not financial advice.", healthNote: "BMI is for reference only and is not a medical diagnosis.",
    qrEmpty: "Enter text or a URL to generate a QR Code.", qrTooLong: "Input exceeds the 1,200-byte UTF-8 safety limit.", qrGenerationFailed: "The QR Code could not be generated. Shorten the content or adjust the settings and try again.", qrAlt: "Generated QR Code preview",
  },
  "zh-CN": {
    siteName: "GoDeskHub", tagline: "免费、快速、隐私优先的在线日常工具。", search: "搜索工具",
    popular: "常用工具", allTools: "全部工具", noResults: "没有找到匹配工具。", privacyBadge: "输入内容只留在浏览器",
    open: "打开", copy: "复制", copied: "已复制", copyFailed: "复制失败", clear: "清空", reset: "重置", swap: "互换",
    input: "输入", output: "输出", from: "来源", to: "目标", value: "数值", result: "结果", invalid: "请输入有限且有效的数值。", belowAbsoluteZero: "温度不能低于绝对零度。",
    nonNegative: "请输入 0 或正数。", percentRange: "请输入 0 至 100 的百分比。", bmiWeightRange: "请输入大于 0 且不超过 1,000 千克的体重。", bmiHeightRange: "请输入大于 0 且不超过 300 厘米的身高。", compoundRateRange: "请输入使每个复利周期增长因子大于 0 的利率。", yearRange: "请输入 0 至 1,000 年的期限。", frequencyRange: "请输入 1 至 365 的整数。", invalidDate: "请选择有效的 Gregorian 日历日期。",
    invalidJson: "请输入有效的 JSON。", unsafeJsonInteger: "JSON 含有超出 JavaScript 安全整数范围的整数，可能发生精度损失。", inputTooLarge: "输入过大，无法安全处理。", invalidBase64: "请输入带正确填充且内容为有效 UTF-8 文本的标准 Base64。", invalidUrlEncoding: "请输入完整且有效的百分号编码序列。", uuidUnavailable: "当前浏览器无法安全生成 UUID。",
    about: "关于", privacy: "隐私政策", terms: "使用条款", contact: "联系反馈", home: "首页", categories: "分类", tools: "工具",
    navigation: "工具导航", menu: "打开工具导航", closeMenu: "关闭工具导航", showHelp: "查看字段说明", language: "语言", footerNavigation: "页脚导航",
    related: "相关工具", usage: "使用步骤", useCases: "适用场景", example: "实际示例", principles: "工作原理与规则", limitations: "限制与注意事项",
    faq: "常见问题", references: "参考资料", reviewed: "内容最后审查日期", feedback: "提交工具反馈", feedbackPrompt: "请选择反馈类型。工具输入和结果不会被加入反馈。",
    generate: "生成", download: "下载 PNG", sourceText: "原始内容",
    financeNote: "计算结果仅供参考，不构成投资或理财建议。", healthNote: "BMI 结果仅供参考，不构成医疗诊断。",
    qrEmpty: "输入文本或 URL 后生成 QR Code。", qrTooLong: "输入超过 1,200 字节的 UTF-8 安全限制。", qrGenerationFailed: "无法生成 QR Code。请缩短内容或调整设置后重试。", qrAlt: "已生成的 QR Code 预览",
  },
  "zh-TW": {
    siteName: "GoDeskHub", tagline: "免費、快速、重視隱私的線上日常工具。", search: "搜尋工具",
    popular: "常用工具", allTools: "全部工具", noResults: "沒有找到相符工具。", privacyBadge: "輸入內容只留在瀏覽器",
    open: "開啟", copy: "複製", copied: "已複製", copyFailed: "複製失敗", clear: "清除", reset: "重設", swap: "互換",
    input: "輸入", output: "輸出", from: "來源", to: "目標", value: "數值", result: "結果", invalid: "請輸入有限且有效的數值。", belowAbsoluteZero: "溫度不能低於絕對零度。",
    nonNegative: "請輸入 0 或正數。", percentRange: "請輸入 0 至 100 的百分比。", bmiWeightRange: "請輸入大於 0 且不超過 1,000 公斤的體重。", bmiHeightRange: "請輸入大於 0 且不超過 300 公分的身高。", compoundRateRange: "請輸入使每個複利週期成長因子大於 0 的利率。", yearRange: "請輸入 0 至 1,000 年的期限。", frequencyRange: "請輸入 1 至 365 的整數。", invalidDate: "請選擇有效的 Gregorian 日曆日期。",
    invalidJson: "請輸入有效的 JSON。", unsafeJsonInteger: "JSON 含有超出 JavaScript 安全整數範圍的整數，可能發生精度損失。", inputTooLarge: "輸入過大，無法安全處理。", invalidBase64: "請輸入含正確填充且內容為有效 UTF-8 文字的標準 Base64。", invalidUrlEncoding: "請輸入完整且有效的百分號編碼序列。", uuidUnavailable: "目前瀏覽器無法安全產生 UUID。",
    about: "關於", privacy: "隱私權政策", terms: "使用條款", contact: "聯絡與回饋", home: "首頁", categories: "分類", tools: "工具",
    navigation: "工具導覽", menu: "開啟工具導覽", closeMenu: "關閉工具導覽", showHelp: "查看欄位說明", language: "語言", footerNavigation: "頁尾導覽",
    related: "相關工具", usage: "使用步驟", useCases: "適用情境", example: "實際範例", principles: "運作原理與規則", limitations: "限制與注意事項",
    faq: "常見問題", references: "參考資料", reviewed: "內容最後審查日期", feedback: "提交工具回饋", feedbackPrompt: "請選擇回饋類型。工具輸入和結果不會加入回饋。",
    generate: "產生", download: "下載 PNG", sourceText: "原始內容",
    financeNote: "計算結果僅供參考，不構成投資或理財建議。", healthNote: "BMI 結果僅供參考，不構成醫療診斷。",
    qrEmpty: "輸入文字或 URL 後產生 QR Code。", qrTooLong: "輸入超過 1,200 位元組的 UTF-8 安全限制。", qrGenerationFailed: "無法產生 QR Code。請縮短內容或調整設定後再試。", qrAlt: "已產生的 QR Code 預覽",
  },
} satisfies Record<Lang, Record<string, string>>;

const createField = (
  en: [string, string, string],
  zhCN: [string, string, string],
  zhTW: [string, string, string],
): FieldCopy => ({
  en: { label: en[0], placeholder: en[1], help: en[2] },
  "zh-CN": { label: zhCN[0], placeholder: zhCN[1], help: zhCN[2] },
  "zh-TW": { label: zhTW[0], placeholder: zhTW[1], help: zhTW[2] },
});

export const fieldText = {
  number: createField(["Input value", "e.g. 100", "Enter the finite numeric value to process."], ["输入数值", "例如：100", "输入需要处理的有限数值。"], ["輸入數值", "例如：100", "輸入需要處理的有限數值。"]),
  text: createField(["Input text", "Enter or paste text", "Content is processed only in this browser."], ["输入内容", "输入或粘贴文本", "内容只在当前浏览器中处理。"], ["輸入內容", "輸入或貼上文字", "內容只在目前瀏覽器中處理。"]),
  fromUnit: createField(["From unit", "", "Choose the unit used by the input value."], ["来源单位", "", "选择输入数值当前使用的单位。"], ["來源單位", "", "選擇輸入數值目前使用的單位。"]),
  toUnit: createField(["To unit", "", "Choose the unit for the converted result."], ["目标单位", "", "选择转换结果使用的单位。"], ["目標單位", "", "選擇轉換結果使用的單位。"]),
  json: createField(["JSON input", "Paste JSON to format or minify", "The JSON is parsed locally and is never uploaded."], ["JSON 输入", "粘贴需要格式化或压缩的 JSON", "JSON 仅在本地解析，不会上传。"], ["JSON 輸入", "貼上需要格式化或壓縮的 JSON", "JSON 僅在本機解析，不會上傳。"]),
  timestamp: createField(["Timestamp", "e.g. 1704067200", "Enter an integer Unix timestamp and choose its unit explicitly."], ["时间戳", "例如：1704067200", "输入整数 Unix 时间戳，并明确选择单位。"], ["時間戳", "例如：1704067200", "輸入整數 Unix 時間戳，並明確選擇單位。"]),
  timestampUnit: createField(["Timestamp unit", "", "Choose whether the timestamp is seconds or milliseconds since the Unix epoch."], ["时间戳单位", "", "选择 Unix epoch 起算的秒或毫秒。"], ["時間戳單位", "", "選擇自 Unix epoch 起算的秒或毫秒。"]),
  dateTime: createField(["Date and time", "", "Choose a local date and time to convert."], ["日期与时间", "", "选择需要转换的本地日期和时间。"], ["日期與時間", "", "選擇需要轉換的本機日期與時間。"]),
  color: createField(["Color value", "e.g. #187b69", "Enter a HEX or RGB channel value in the shown range."], ["颜色数值", "例如：#187b69", "按所示范围输入 HEX 或 RGB 通道值。"], ["顏色數值", "例如：#187b69", "依顯示範圍輸入 HEX 或 RGB 色頻值。"]),
  qr: createField(["Text or URL", "Enter text or a URL", "This content is encoded locally into the QR Code."], ["文本或 URL", "输入文本或 URL", "内容仅在本地编码为 QR Code。"], ["文字或 URL", "輸入文字或 URL", "內容僅在本機編碼為 QR Code。"]),
  size: createField(["Image size", "", "Choose the PNG width and height in pixels."], ["图片尺寸", "", "选择 PNG 的像素宽度和高度。"], ["圖片尺寸", "", "選擇 PNG 的像素寬度與高度。"]),
  foreground: createField(["Foreground color", "", "Controls the dark modules of the QR Code."], ["前景颜色", "", "控制 QR Code 的深色图形。"], ["前景顏色", "", "控制 QR Code 的深色圖形。"]),
  background: createField(["Background color", "", "Use a high-contrast background for reliable scanning."], ["背景颜色", "", "使用高对比背景以便可靠扫码。"], ["背景顏色", "", "使用高對比背景以便可靠掃描。"]),
} satisfies Record<string, FieldCopy>;

export const navLabels: Record<string, LocalizedText> = {
  home: { en: "Home", "zh-CN": "首页", "zh-TW": "首頁" },
  about: { en: "About Us", "zh-CN": "关于我们", "zh-TW": "關於我們" },
  privacy: { en: "Privacy Policy", "zh-CN": "隐私政策", "zh-TW": "隱私權政策" },
  terms: { en: "Terms of Service", "zh-CN": "服务条款", "zh-TW": "服務條款" },
  contact: { en: "Contact Us", "zh-CN": "联系我们", "zh-TW": "聯絡我們" },
  "not-found": { en: "404", "zh-CN": "404", "zh-TW": "404" },
};

export function getFieldCopy(field: keyof typeof fieldText, lang: Lang) {
  return fieldText[field][lang];
}
