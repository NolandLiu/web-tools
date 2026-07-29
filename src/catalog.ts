import { CATEGORIES, TOOLS as REGISTERED_TOOLS } from "./registry.js";
import type { CategoryId, Lang, Tool } from "./types";

export const CATEGORY_ORDER: CategoryId[] = CATEGORIES.map(category => category.id);

export const categories: Record<CategoryId, Record<Lang, string>> = Object.fromEntries(
  CATEGORIES.map(category => [
    category.id,
    Object.fromEntries(
      Object.entries(category.text).map(([lang, text]) => [lang, text.name]),
    ),
  ]),
) as Record<CategoryId, Record<Lang, string>>;

export const TOOLS: Tool[] = REGISTERED_TOOLS;

export const toolText = Object.fromEntries(
  REGISTERED_TOOLS.map(tool => [tool.id, tool.text]),
);

export const unitLabels: Record<Lang, Record<string, string>> = {
  en: { m: "meter", km: "kilometer", cm: "centimeter", mm: "millimeter", in: "inch", ft: "foot", yd: "yard", mi: "mile", kg: "kilogram", g: "gram", mg: "milligram", lb: "pound", oz: "ounce", t: "metric ton", m2: "square meter", km2: "square kilometer", cm2: "square centimeter", mm2: "square millimeter", ha: "hectare", acre: "acre", ft2: "square foot", l: "liter", ml: "milliliter", m3: "cubic meter", gal_us: "US gallon", qt_us: "US quart", pt_us: "US pint", cup_us: "US cup", mps: "m/s", kph: "km/h", mph: "mph", knot: "knot", fps: "ft/s", ms: "millisecond", s: "second", min: "minute", h: "hour", day: "day", week: "week", B: "B", KB: "KB", MB: "MB", GB: "GB", TB: "TB", PB: "PB", c: "Celsius", f: "Fahrenheit", k: "Kelvin" },
  "zh-CN": { m: "米", km: "千米", cm: "厘米", mm: "毫米", in: "英寸", ft: "英尺", yd: "码", mi: "英里", kg: "千克", g: "克", mg: "毫克", lb: "磅", oz: "盎司", t: "吨", m2: "平方米", km2: "平方千米", cm2: "平方厘米", mm2: "平方毫米", ha: "公顷", acre: "英亩", ft2: "平方英尺", l: "升", ml: "毫升", m3: "立方米", gal_us: "美制加仑", qt_us: "美制夸脱", pt_us: "美制品脱", cup_us: "美制杯", mps: "米／秒", kph: "公里／小时", mph: "英里／小时", knot: "节", fps: "英尺／秒", ms: "毫秒", s: "秒", min: "分钟", h: "小时", day: "天", week: "周", B: "B", KB: "KB", MB: "MB", GB: "GB", TB: "TB", PB: "PB", c: "摄氏度", f: "华氏度", k: "开尔文" },
  "zh-TW": { m: "公尺", km: "公里", cm: "公分", mm: "毫米", in: "英寸", ft: "英尺", yd: "碼", mi: "英里", kg: "公斤", g: "公克", mg: "毫克", lb: "磅", oz: "盎司", t: "公噸", m2: "平方公尺", km2: "平方公里", cm2: "平方公分", mm2: "平方毫米", ha: "公頃", acre: "英畝", ft2: "平方英尺", l: "公升", ml: "毫升", m3: "立方公尺", gal_us: "美制加侖", qt_us: "美制夸脫", pt_us: "美制品脫", cup_us: "美制杯", mps: "公尺／秒", kph: "公里／小時", mph: "英里／小時", knot: "節", fps: "英尺／秒", ms: "毫秒", s: "秒", min: "分鐘", h: "小時", day: "天", week: "週", B: "B", KB: "KB", MB: "MB", GB: "GB", TB: "TB", PB: "PB", c: "攝氏度", f: "華氏度", k: "克氏" },
};
