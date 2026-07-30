export const SITE_ORIGIN = "https://tools.godeskhub.com";
export const DEFAULT_LANG = "en";

export const LANGUAGES = [
  { id: "en", path: "en", htmlLang: "en", hreflang: "en", label: "English" },
  { id: "zh-CN", path: "zh-cn", htmlLang: "zh-CN", hreflang: "zh-CN", label: "简体中文" },
  { id: "zh-TW", path: "zh-tw", htmlLang: "zh-TW", hreflang: "zh-TW", label: "繁體中文" },
];

const localized = (enName, enDescription, zhCNName, zhCNDescription, zhTWName, zhTWDescription) => ({
  en: { name: enName, description: enDescription },
  "zh-CN": { name: zhCNName, description: zhCNDescription },
  "zh-TW": { name: zhTWName, description: zhTWDescription },
});

export const CATEGORIES = [
  {
    id: "units",
    slug: "unit-converters",
    text: localized(
      "Unit converters",
      "Convert length, weight, temperature, area, volume, speed, time, and data storage units.",
      "单位转换",
      "转换长度、重量、温度、面积、体积、速度、时间和数据存储单位。",
      "單位轉換",
      "轉換長度、重量、溫度、面積、體積、速度、時間和資料儲存單位。",
    ),
  },
  {
    id: "developer",
    slug: "developer-tools",
    text: localized(
      "Format & developer tools",
      "Format data and generate identifiers, text transformations, colors, and secure local passwords.",
      "格式与开发工具",
      "处理数据、标识符、文本、颜色并在本地安全生成密码。",
      "格式與開發工具",
      "處理資料、識別碼、文字、顏色，並在本機安全產生密碼。",
    ),
  },
  {
    id: "calculators",
    slug: "calculators",
    text: localized(
      "Calculators",
      "Run everyday calculations, fixed-period IRR analysis, and cheque amount word conversion.",
      "计算工具",
      "进行日常计算、固定周期 IRR 分析和支票金额文字转换。",
      "計算工具",
      "進行日常計算、固定週期 IRR 分析和支票金額文字轉換。",
    ),
  },
  {
    id: "qr",
    slug: "qr-code",
    text: localized(
      "QR Code",
      "Create customizable QR Codes locally in your browser.",
      "QR Code",
      "在浏览器本地创建可自定义的 QR Code。",
      "QR Code",
      "在瀏覽器本機建立可自訂的 QR Code。",
    ),
  },
];

const tool = (definition, text) => ({ ...definition, text });

export const TOOLS = [
  tool({ id: "length", slug: "length-converter", kind: "unit", category: "units", icon: "ruler", order: 1, defaultWeight: 10, group: "length" }, localized("Length converter", "Convert meters, feet, miles, and more.", "长度转换", "米、英尺、英里等单位互转。", "長度轉換", "公尺、英尺、英里等單位互轉。")),
  tool({ id: "weight", slug: "weight-converter", kind: "unit", category: "units", icon: "scale", order: 2, defaultWeight: 9, group: "weight" }, localized("Weight converter", "Convert kilograms, pounds, ounces, and tons.", "重量转换", "千克、磅、盎司、吨互转。", "重量轉換", "公斤、磅、盎司、公噸互轉。")),
  tool({ id: "temperature", slug: "temperature-converter", kind: "unit", category: "units", icon: "temperature", order: 3, defaultWeight: 9 }, localized("Temperature converter", "Convert Celsius, Fahrenheit, and Kelvin.", "温度转换", "摄氏、华氏、开尔文公式换算。", "溫度轉換", "攝氏、華氏、克氏公式換算。")),
  tool({ id: "area", slug: "area-converter", kind: "unit", category: "units", icon: "area", order: 4, defaultWeight: 5, group: "area" }, localized("Area converter", "Convert square meters, acres, and square feet.", "面积转换", "平方米、公顷、英亩等面积换算。", "面積轉換", "平方公尺、公頃、英畝等面積換算。")),
  tool({ id: "volume", slug: "volume-converter", kind: "unit", category: "units", icon: "volume", order: 5, defaultWeight: 5, group: "volume" }, localized("Volume converter", "Convert liters, milliliters, gallons, and cups.", "体积转换", "升、毫升、美制加仑和杯互转。", "體積轉換", "公升、毫升、美制加侖與杯互轉。")),
  tool({ id: "speed", slug: "speed-converter", kind: "unit", category: "units", icon: "speed", order: 6, defaultWeight: 5, group: "speed" }, localized("Speed converter", "Convert km/h, mph, knots, and m/s.", "速度转换", "公里／小时、英里／小时、节互转。", "速度轉換", "公里／小時、英里／小時、節互轉。")),
  tool({ id: "time", slug: "time-converter", kind: "unit", category: "units", icon: "clock", order: 7, defaultWeight: 5, group: "time" }, localized("Time converter", "Convert milliseconds through weeks.", "时间转换", "毫秒、秒、分钟、小时、天互转。", "時間轉換", "毫秒、秒、分鐘、小時、天互轉。")),
  tool({ id: "storage", slug: "data-storage-converter", kind: "unit", category: "units", icon: "storage", order: 8, defaultWeight: 7, group: "storage" }, localized("Data storage converter", "Convert bytes through petabytes.", "数据存储转换", "B、KB、MB、GB、TB 换算。", "資料儲存轉換", "B、KB、MB、GB、TB 換算。")),
  tool({ id: "json", slug: "json-tools", kind: "json", category: "developer", icon: "code", order: 9, defaultWeight: 9 }, localized("JSON tools", "Format, minify, and validate JSON locally.", "JSON 工具", "在本地格式化、压缩并校验 JSON。", "JSON 工具", "在本機格式化、壓縮並驗證 JSON。")),
  tool({ id: "base64", slug: "base64-encoder-decoder", kind: "base64", category: "developer", icon: "binary", order: 10, defaultWeight: 8 }, localized("Base64 encoder and decoder", "Encode and decode Unicode text with Base64.", "Base64 编解码", "支持 Unicode 文本编码和解码。", "Base64 編解碼", "支援 Unicode 文字編碼和解碼。")),
  tool({ id: "url", slug: "url-encoder-decoder", kind: "url", category: "developer", icon: "link", order: 11, defaultWeight: 7 }, localized("URL encoder and decoder", "Encode and decode URL text safely.", "URL 编解码", "安全编码和还原 URL 文本。", "URL 編解碼", "安全編碼和還原 URL 文字。")),
  tool({ id: "uuid", slug: "uuid-generator", kind: "uuid", category: "developer", icon: "hash", order: 12, defaultWeight: 8 }, localized("UUID generator", "Generate secure UUID v4 values in your browser.", "UUID 生成器", "用安全随机源生成 UUID v4。", "UUID 產生器", "用安全隨機源產生 UUID v4。")),
  tool({ id: "timestamp", slug: "timestamp-converter", kind: "timestamp", category: "developer", icon: "clock", order: 13, defaultWeight: 7 }, localized("Timestamp converter", "Convert seconds, milliseconds, and dates.", "时间戳转换", "秒、毫秒和日期时间互转。", "時間戳轉換", "秒、毫秒和日期時間互轉。")),
  tool({ id: "case", slug: "text-case-converter", kind: "case", category: "developer", icon: "case", order: 14, defaultWeight: 6 }, localized("Text case converter", "Convert upper, lower, title, and camel case.", "文本大小写转换", "大写、小写、标题和驼峰格式。", "文字大小寫轉換", "大寫、小寫、標題和駝峰格式。")),
  tool({ id: "text", slug: "word-counter", kind: "text", category: "developer", icon: "text", order: 15, defaultWeight: 8 }, localized("Word counter", "Count characters, words, and lines locally.", "字数统计", "字符数、字词数和行数统计。", "字數統計", "字元數、字詞數和行數統計。")),
  tool({ id: "color", slug: "color-converter", kind: "color", category: "developer", icon: "palette", order: 16, defaultWeight: 6 }, localized("Color converter", "Convert HEX, RGB, and HSL colors.", "颜色转换", "HEX、RGB、HSL 基础转换。", "顏色轉換", "HEX、RGB、HSL 基礎轉換。")),
  tool({ id: "percentage", slug: "percentage-calculator", kind: "calculator", category: "calculators", icon: "percent", order: 17, defaultWeight: 8, calculator: "percentage" }, localized("Percentage calculator", "Calculate a percentage of a value.", "百分比计算", "计算某数值的百分比。", "百分比計算", "計算某數值的百分比。")),
  tool({ id: "discount", slug: "discount-calculator", kind: "calculator", category: "calculators", icon: "tag", order: 18, defaultWeight: 7, calculator: "discount" }, localized("Discount calculator", "Calculate final price and savings.", "折扣计算", "计算折后价和节省金额。", "折扣計算", "計算折後價與省下金額。")),
  tool({ id: "bmi", slug: "bmi-calculator", kind: "calculator", category: "calculators", icon: "activity", order: 19, defaultWeight: 6, calculator: "bmi" }, localized("BMI calculator", "Calculate a body mass index reference.", "BMI 计算", "身体质量指数参考计算。", "BMI 計算", "身體質量指數參考計算。")),
  tool({ id: "compound", slug: "compound-interest-calculator", kind: "calculator", category: "calculators", icon: "trend", order: 20, defaultWeight: 6, calculator: "compound" }, localized("Compound interest calculator", "Calculate reference compound growth.", "复利计算", "复利增长参考计算。", "複利計算", "複利成長參考計算。")),
  tool({ id: "datecalc", slug: "date-interval-calculator", kind: "calculator", category: "calculators", icon: "calendar", order: 21, defaultWeight: 7, calculator: "date" }, localized("Date interval calculator", "Calculate the days between two dates.", "日期间隔计算", "计算两个日期相隔天数。", "日期間隔計算", "計算兩個日期相隔天數。")),
  tool({ id: "qr", slug: "qr-code-generator", kind: "qr", category: "qr", icon: "qr", order: 22, defaultWeight: 8 }, localized("QR Code generator", "Create and download customizable QR Codes locally.", "QR Code 生成器", "本地生成并下载可自定义的 QR Code。", "QR Code 產生器", "本機產生並下載可自訂的 QR Code。")),
  tool({ id: "irr", slug: "irr-calculator", kind: "irr", category: "calculators", icon: "trend", order: 23, defaultWeight: 7 }, localized("IRR calculator", "Calculate fixed-period IRR and its annualized equivalent.", "IRR 计算器", "计算固定周期内部收益率及其年化结果。", "IRR 計算器", "計算固定週期內部收益率及其年化結果。")),
  tool({ id: "cheque", slug: "cheque-amount-converter", kind: "cheque", category: "calculators", icon: "text", order: 24, defaultWeight: 6 }, localized("Cheque amount converter", "Write a decimal amount in English and Chinese financial words.", "支票金额转换", "把十进制金额转换为英文和中文金融大写。", "支票金額轉換", "把十進位金額轉換為英文和中文金融大寫。")),
  tool({ id: "password", slug: "password-generator", kind: "password", category: "developer", icon: "hash", order: 25, defaultWeight: 8 }, localized("Password generator", "Generate constrained passwords with browser cryptography.", "密码生成器", "使用浏览器密码学安全随机源生成符合规则的密码。", "密碼產生器", "使用瀏覽器密碼學安全隨機來源產生符合規則的密碼。")),
];

export const INFO_PAGES = [
  { id: "about", slug: "about", text: localized("About GoDeskHub", "Learn about GoDeskHub and its privacy-first browser tools.", "关于 GoDeskHub", "了解 GoDeskHub 及其隐私优先的浏览器工具。", "關於 GoDeskHub", "了解 GoDeskHub 及其重視隱私的瀏覽器工具。") },
  { id: "privacy", slug: "privacy", text: localized("Privacy Policy", "Read how GoDeskHub protects tool input and visitor privacy.", "隐私政策", "了解 GoDeskHub 如何保护工具输入和访问者隐私。", "隱私權政策", "了解 GoDeskHub 如何保護工具輸入和訪客隱私。") },
  { id: "terms", slug: "terms", text: localized("Terms of Service", "Read the terms for using GoDeskHub online tools.", "服务条款", "阅读使用 GoDeskHub 在线工具的服务条款。", "服務條款", "閱讀使用 GoDeskHub 線上工具的服務條款。") },
  { id: "contact", slug: "contact", text: localized("Contact GoDeskHub", "Contact GoDeskHub for support, feedback, and privacy questions.", "联系 GoDeskHub", "联系 GoDeskHub 获取支持、提供反馈或咨询隐私问题。", "聯絡 GoDeskHub", "聯絡 GoDeskHub 取得支援、提供回饋或詢問隱私問題。") },
];
