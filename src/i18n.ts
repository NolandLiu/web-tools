import type { FieldCopy, Lang, LocalizedText } from "./types";

export const LANGS: Lang[] = ["en", "zh-CN", "zh-TW"];

export const messages = {
  en: {
    siteName: "GoDeskHub", tagline: "Free, fast, privacy-first online tools for everyday work.", search: "Search tools",
    popular: "Popular tools", allTools: "All tools", noResults: "No matching tools.", privacyBadge: "Inputs stay in your browser",
    open: "Open", copy: "Copy", copied: "Copied", copyFailed: "Copy failed", clear: "Clear", reset: "Reset", swap: "Swap",
    input: "Input", output: "Output", from: "From", to: "To", value: "Value", result: "Result", invalid: "Enter a finite valid value.",
    about: "About Us", privacy: "Privacy Policy", terms: "Terms of Service", contact: "Contact Us", home: "Home", categories: "Categories", tools: "Tools",
    navigation: "Tool navigation", menu: "Open tool navigation", closeMenu: "Close tool navigation", showHelp: "Show field help",
    related: "Related tools", usage: "How to use", generate: "Generate", download: "Download PNG", sourceText: "Source text",
    financeNote: "Results are for reference only and are not financial advice.", healthNote: "BMI is for reference only and is not a medical diagnosis.",
    qrEmpty: "Enter text or a URL to generate a QR Code.", qrTooLong: "Input is too long for a reliable QR Code.",
  },
  "zh-CN": {
    siteName: "GoDeskHub", tagline: "免费、快速、隐私优先的在线日常工具。", search: "搜索工具",
    popular: "常用工具", allTools: "全部工具", noResults: "没有找到匹配工具。", privacyBadge: "输入内容只留在浏览器",
    open: "打开", copy: "复制", copied: "已复制", copyFailed: "复制失败", clear: "清空", reset: "重置", swap: "互换",
    input: "输入", output: "输出", from: "来源", to: "目标", value: "数值", result: "结果", invalid: "请输入有限且有效的数值。",
    about: "关于", privacy: "隐私政策", terms: "使用条款", contact: "联系反馈", home: "首页", categories: "分类", tools: "工具",
    navigation: "工具导航", menu: "打开工具导航", closeMenu: "关闭工具导航", showHelp: "查看字段说明",
    related: "相关工具", usage: "使用说明", generate: "生成", download: "下载 PNG", sourceText: "原始内容",
    financeNote: "计算结果仅供参考，不构成投资或理财建议。", healthNote: "BMI 结果仅供参考，不构成医疗诊断。",
    qrEmpty: "输入文本或 URL 后生成 QR Code。", qrTooLong: "输入过长，无法可靠生成 QR Code。",
  },
  "zh-TW": {
    siteName: "GoDeskHub", tagline: "免費、快速、重視隱私的線上日常工具。", search: "搜尋工具",
    popular: "常用工具", allTools: "全部工具", noResults: "沒有找到相符工具。", privacyBadge: "輸入內容只留在瀏覽器",
    open: "開啟", copy: "複製", copied: "已複製", copyFailed: "複製失敗", clear: "清除", reset: "重設", swap: "互換",
    input: "輸入", output: "輸出", from: "來源", to: "目標", value: "數值", result: "結果", invalid: "請輸入有限且有效的數值。",
    about: "關於", privacy: "隱私權政策", terms: "使用條款", contact: "聯絡與回饋", home: "首頁", categories: "分類", tools: "工具",
    navigation: "工具導覽", menu: "開啟工具導覽", closeMenu: "關閉工具導覽", showHelp: "查看欄位說明",
    related: "相關工具", usage: "使用說明", generate: "產生", download: "下載 PNG", sourceText: "原始內容",
    financeNote: "計算結果僅供參考，不構成投資或理財建議。", healthNote: "BMI 結果僅供參考，不構成醫療診斷。",
    qrEmpty: "輸入文字或 URL 後產生 QR Code。", qrTooLong: "輸入過長，無法可靠產生 QR Code。",
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
  timestamp: createField(["Timestamp", "e.g. 1704067200", "Seconds and milliseconds are detected automatically."], ["时间戳", "例如：1704067200", "自动识别秒与毫秒时间戳。"], ["時間戳", "例如：1704067200", "自動辨識秒與毫秒時間戳。"]),
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
