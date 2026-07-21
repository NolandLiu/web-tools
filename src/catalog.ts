import type { CategoryId, Lang, Tool } from "./types";

export const CATEGORY_ORDER: CategoryId[] = ["units", "developer", "calculators", "qr"];

export const categories: Record<CategoryId, Record<Lang, string>> = {
  units: { en: "Unit converters", "zh-CN": "单位转换", "zh-TW": "單位轉換" },
  developer: { en: "Format & developer", "zh-CN": "格式与开发", "zh-TW": "格式與開發" },
  calculators: { en: "Calculators", "zh-CN": "计算工具", "zh-TW": "計算工具" },
  qr: { en: "QR Code", "zh-CN": "QR Code", "zh-TW": "QR Code" },
};

export const TOOLS: Tool[] = [
  { id: "length", kind: "unit", category: "units", icon: "ruler", order: 1, defaultWeight: 10, group: "length" },
  { id: "weight", kind: "unit", category: "units", icon: "scale", order: 2, defaultWeight: 9, group: "weight" },
  { id: "temperature", kind: "unit", category: "units", icon: "temperature", order: 3, defaultWeight: 9 },
  { id: "area", kind: "unit", category: "units", icon: "area", order: 4, defaultWeight: 5, group: "area" },
  { id: "volume", kind: "unit", category: "units", icon: "volume", order: 5, defaultWeight: 5, group: "volume" },
  { id: "speed", kind: "unit", category: "units", icon: "speed", order: 6, defaultWeight: 5, group: "speed" },
  { id: "time", kind: "unit", category: "units", icon: "clock", order: 7, defaultWeight: 5, group: "time" },
  { id: "storage", kind: "unit", category: "units", icon: "storage", order: 8, defaultWeight: 7, group: "storage" },
  { id: "json", kind: "json", category: "developer", icon: "code", order: 9, defaultWeight: 9 },
  { id: "base64", kind: "base64", category: "developer", icon: "binary", order: 10, defaultWeight: 8 },
  { id: "url", kind: "url", category: "developer", icon: "link", order: 11, defaultWeight: 7 },
  { id: "uuid", kind: "uuid", category: "developer", icon: "hash", order: 12, defaultWeight: 8 },
  { id: "timestamp", kind: "timestamp", category: "developer", icon: "clock", order: 13, defaultWeight: 7 },
  { id: "case", kind: "case", category: "developer", icon: "case", order: 14, defaultWeight: 6 },
  { id: "text", kind: "text", category: "developer", icon: "text", order: 15, defaultWeight: 8 },
  { id: "color", kind: "color", category: "developer", icon: "palette", order: 16, defaultWeight: 6 },
  { id: "percentage", kind: "calculator", category: "calculators", icon: "percent", order: 17, defaultWeight: 8, calculator: "percentage" },
  { id: "discount", kind: "calculator", category: "calculators", icon: "tag", order: 18, defaultWeight: 7, calculator: "discount" },
  { id: "bmi", kind: "calculator", category: "calculators", icon: "activity", order: 19, defaultWeight: 6, calculator: "bmi" },
  { id: "compound", kind: "calculator", category: "calculators", icon: "trend", order: 20, defaultWeight: 6, calculator: "compound" },
  { id: "datecalc", kind: "calculator", category: "calculators", icon: "calendar", order: 21, defaultWeight: 7, calculator: "date" },
  { id: "qr", kind: "qr", category: "qr", icon: "qr", order: 22, defaultWeight: 8 },
];

type ToolCopy = Record<Lang, { name: string; description: string }>;
const copy = (en: [string, string], zhCN: [string, string], zhTW: [string, string]): ToolCopy => ({
  en: { name: en[0], description: en[1] },
  "zh-CN": { name: zhCN[0], description: zhCN[1] },
  "zh-TW": { name: zhTW[0], description: zhTW[1] },
});

export const toolText: Record<string, ToolCopy> = {
  length: copy(["Length converter", "Meters, feet, miles, and more."], ["长度转换", "米、英尺、英里等单位互转。"], ["長度轉換", "公尺、英尺、英里等單位互轉。"]),
  weight: copy(["Weight converter", "Kilograms, pounds, ounces, and tons."], ["重量转换", "千克、磅、盎司、吨互转。"], ["重量轉換", "公斤、磅、盎司、公噸互轉。"]),
  temperature: copy(["Temperature converter", "Celsius, Fahrenheit, and Kelvin."], ["温度转换", "摄氏、华氏、开尔文公式换算。"], ["溫度轉換", "攝氏、華氏、克氏公式換算。"]),
  area: copy(["Area converter", "Square meters, acres, and square feet."], ["面积转换", "平方米、公顷、英亩等面积换算。"], ["面積轉換", "平方公尺、公頃、英畝等面積換算。"]),
  volume: copy(["Volume converter", "Liters, milliliters, gallons, and cups."], ["体积转换", "升、毫升、美制加仑和杯互转。"], ["體積轉換", "公升、毫升、美制加侖與杯互轉。"]),
  speed: copy(["Speed converter", "km/h, mph, knots, and m/s."], ["速度转换", "公里／小时、英里／小时、节互转。"], ["速度轉換", "公里／小時、英里／小時、節互轉。"]),
  time: copy(["Time converter", "Milliseconds through weeks."], ["时间转换", "毫秒、秒、分钟、小时、天互转。"], ["時間轉換", "毫秒、秒、分鐘、小時、天互轉。"]),
  storage: copy(["Data storage converter", "Bytes through petabytes."], ["数据存储转换", "B、KB、MB、GB、TB 换算。"], ["資料儲存轉換", "B、KB、MB、GB、TB 換算。"]),
  json: copy(["JSON tools", "Format, minify, and validate JSON."], ["JSON 工具", "格式化、压缩并校验 JSON。"], ["JSON 工具", "格式化、壓縮並驗證 JSON。"]),
  base64: copy(["Base64", "Encode and decode Unicode text."], ["Base64 编解码", "支持 Unicode 文本编码和解码。"], ["Base64 編解碼", "支援 Unicode 文字編碼和解碼。"]),
  url: copy(["URL encoder", "Encode and decode URL text."], ["URL 编解码", "安全编码和还原 URL 文本。"], ["URL 編解碼", "安全編碼和還原 URL 文字。"]),
  uuid: copy(["UUID generator", "Generate secure UUID v4 values."], ["UUID 生成器", "用安全随机源生成 UUID v4。"], ["UUID 產生器", "用安全隨機源產生 UUID v4。"]),
  timestamp: copy(["Timestamp converter", "Convert seconds, milliseconds, and dates."], ["时间戳转换", "秒、毫秒和日期时间互转。"], ["時間戳轉換", "秒、毫秒和日期時間互轉。"]),
  case: copy(["Text case converter", "Upper, lower, title, and camel case."], ["文本大小写转换", "大写、小写、标题和驼峰格式。"], ["文字大小寫轉換", "大寫、小寫、標題和駝峰格式。"]),
  text: copy(["Word counter", "Characters, words, and lines."], ["字数统计", "字符数、字词数和行数统计。"], ["字數統計", "字元數、字詞數和行數統計。"]),
  color: copy(["Color converter", "HEX, RGB, and HSL conversion."], ["颜色转换", "HEX、RGB、HSL 基础转换。"], ["顏色轉換", "HEX、RGB、HSL 基礎轉換。"]),
  percentage: copy(["Percentage calculator", "Calculate a percentage of a value."], ["百分比计算", "计算某数值的百分比。"], ["百分比計算", "計算某數值的百分比。"]),
  discount: copy(["Discount calculator", "Final price and savings."], ["折扣计算", "计算折后价和节省金额。"], ["折扣計算", "計算折後價與省下金額。"]),
  bmi: copy(["BMI calculator", "Body mass index reference."], ["BMI 计算", "身体质量指数参考计算。"], ["BMI 計算", "身體質量指數參考計算。"]),
  compound: copy(["Compound interest", "Reference compound growth calculation."], ["复利计算", "复利增长参考计算。"], ["複利計算", "複利成長參考計算。"]),
  datecalc: copy(["Date interval", "Days between two dates."], ["日期间隔计算", "计算两个日期相隔天数。"], ["日期間隔計算", "計算兩個日期相隔天數。"]),
  qr: copy(["QR Code generator", "Create and download local QR Codes."], ["QR Code 生成器", "本地生成并下载 QR Code。"], ["QR Code 產生器", "本機產生並下載 QR Code。"]),
};

export const unitLabels: Record<Lang, Record<string, string>> = {
  en: { m: "meter", km: "kilometer", cm: "centimeter", mm: "millimeter", in: "inch", ft: "foot", yd: "yard", mi: "mile", kg: "kilogram", g: "gram", mg: "milligram", lb: "pound", oz: "ounce", t: "metric ton", m2: "square meter", km2: "square kilometer", cm2: "square centimeter", mm2: "square millimeter", ha: "hectare", acre: "acre", ft2: "square foot", l: "liter", ml: "milliliter", m3: "cubic meter", gal_us: "US gallon", qt_us: "US quart", pt_us: "US pint", cup_us: "US cup", mps: "m/s", kph: "km/h", mph: "mph", knot: "knot", fps: "ft/s", ms: "millisecond", s: "second", min: "minute", h: "hour", day: "day", week: "week", B: "B", KB: "KB", MB: "MB", GB: "GB", TB: "TB", PB: "PB", c: "Celsius", f: "Fahrenheit", k: "Kelvin" },
  "zh-CN": { m: "米", km: "千米", cm: "厘米", mm: "毫米", in: "英寸", ft: "英尺", yd: "码", mi: "英里", kg: "千克", g: "克", mg: "毫克", lb: "磅", oz: "盎司", t: "吨", m2: "平方米", km2: "平方千米", cm2: "平方厘米", mm2: "平方毫米", ha: "公顷", acre: "英亩", ft2: "平方英尺", l: "升", ml: "毫升", m3: "立方米", gal_us: "美制加仑", qt_us: "美制夸脱", pt_us: "美制品脱", cup_us: "美制杯", mps: "米／秒", kph: "公里／小时", mph: "英里／小时", knot: "节", fps: "英尺／秒", ms: "毫秒", s: "秒", min: "分钟", h: "小时", day: "天", week: "周", B: "B", KB: "KB", MB: "MB", GB: "GB", TB: "TB", PB: "PB", c: "摄氏度", f: "华氏度", k: "开尔文" },
  "zh-TW": { m: "公尺", km: "公里", cm: "公分", mm: "毫米", in: "英寸", ft: "英尺", yd: "碼", mi: "英里", kg: "公斤", g: "公克", mg: "毫克", lb: "磅", oz: "盎司", t: "公噸", m2: "平方公尺", km2: "平方公里", cm2: "平方公分", mm2: "平方毫米", ha: "公頃", acre: "英畝", ft2: "平方英尺", l: "公升", ml: "毫升", m3: "立方公尺", gal_us: "美制加侖", qt_us: "美制夸脫", pt_us: "美制品脫", cup_us: "美制杯", mps: "公尺／秒", kph: "公里／小時", mph: "英里／小時", knot: "節", fps: "英尺／秒", ms: "毫秒", s: "秒", min: "分鐘", h: "小時", day: "天", week: "週", B: "B", KB: "KB", MB: "MB", GB: "GB", TB: "TB", PB: "PB", c: "攝氏度", f: "華氏度", k: "克氏" },
};
