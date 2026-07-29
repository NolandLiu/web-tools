export const SUPPORTED_LANGUAGES = ["en", "zh-CN", "zh-TW"];

export const UNIT_GROUPS = {
  length: {
    base: "m",
    units: {
      m: 1,
      km: 1000,
      cm: 0.01,
      mm: 0.001,
      in: 0.0254,
      ft: 0.3048,
      yd: 0.9144,
      mi: 1609.344,
    },
    defaultFrom: "m",
    defaultTo: "ft",
  },
  weight: {
    base: "kg",
    units: {
      kg: 1,
      g: 0.001,
      mg: 0.000001,
      lb: 0.45359237,
      oz: 0.028349523125,
      t: 1000,
    },
    defaultFrom: "kg",
    defaultTo: "lb",
  },
  area: {
    base: "m2",
    units: {
      m2: 1,
      km2: 1000000,
      cm2: 0.0001,
      mm2: 0.000001,
      ha: 10000,
      acre: 4046.8564224,
      ft2: 0.09290304,
    },
    defaultFrom: "m2",
    defaultTo: "ft2",
  },
  volume: {
    base: "l",
    units: {
      l: 1,
      ml: 0.001,
      m3: 1000,
      gal_us: 3.785411784,
      qt_us: 0.946352946,
      pt_us: 0.473176473,
      cup_us: 0.2365882365,
    },
    defaultFrom: "l",
    defaultTo: "gal_us",
  },
  speed: {
    base: "mps",
    units: {
      mps: 1,
      kph: 0.2777777777777778,
      mph: 0.44704,
      knot: 0.5144444444444445,
      fps: 0.3048,
    },
    defaultFrom: "kph",
    defaultTo: "mph",
  },
  time: {
    base: "s",
    units: {
      ms: 0.001,
      s: 1,
      min: 60,
      h: 3600,
      day: 86400,
      week: 604800,
    },
    defaultFrom: "h",
    defaultTo: "min",
  },
  storage: {
    base: "B",
    units: {
      B: 1,
      KB: 1000,
      MB: 1000000,
      GB: 1000000000,
      TB: 1000000000000,
      PB: 1000000000000000,
      KiB: 1024,
      MiB: 1048576,
      GiB: 1073741824,
      TiB: 1099511627776,
      PiB: 1125899906842624,
    },
    defaultFrom: "GB",
    defaultTo: "MB",
  },
};

export const TEMP_UNITS = ["c", "f", "k"];

const DECIMAL_NUMBER_PATTERN = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
const EDITING_NUMBER_PATTERN = /^[+-]?(?:(?:\.)|(?:(?:\d+\.?\d*|\.\d+)[eE][+-]?))?$/;

export function parseNumberInput(value) {
  if (typeof value === "number") {
    return Number.isFinite(value)
      ? { state: "valid", value }
      : { state: "out-of-range" };
  }
  if (typeof value !== "string") return { state: "invalid" };
  const trimmed = value.trim();
  if (trimmed === "") return { state: "empty" };
  if (EDITING_NUMBER_PATTERN.test(trimmed) && !DECIMAL_NUMBER_PATTERN.test(trimmed)) {
    return { state: "editing" };
  }
  if (!DECIMAL_NUMBER_PATTERN.test(trimmed)) return { state: "invalid" };
  const numeric = Number(trimmed);
  return Number.isFinite(numeric)
    ? { state: "valid", value: numeric }
    : { state: "out-of-range" };
}

export function parseFiniteNumber(value) {
  const parsed = parseNumberInput(value);
  return parsed.state === "valid" ? parsed.value : null;
}

export function convertUnit(value, groupId, from, to) {
  const numeric = parseFiniteNumber(value);
  const group = UNIT_GROUPS[groupId];
  if (numeric === null || !group || !(from in group.units) || !(to in group.units)) return null;
  const result = (numeric * group.units[from]) / group.units[to];
  if (!Number.isFinite(result) || Math.abs(result) > Number.MAX_SAFE_INTEGER) return null;
  return normalizeNegativeZero(result);
}

export function validateTemperatureInput(value, unit) {
  const parsed = parseNumberInput(value);
  if (parsed.state !== "valid") return parsed;
  const minimum = { c: -273.15, f: -459.67, k: 0 }[unit];
  if (minimum === undefined) return { state: "invalid" };
  return parsed.value < minimum ? { state: "out-of-range" } : parsed;
}

export function convertTemperature(value, from, to) {
  if (!TEMP_UNITS.includes(from) || !TEMP_UNITS.includes(to)) return null;
  const parsed = validateTemperatureInput(value, from);
  if (parsed.state !== "valid") return null;
  const numeric = parsed.value;
  let celsius;
  if (from === "c") celsius = numeric;
  else if (from === "f") celsius = (numeric - 32) * 5 / 9;
  else celsius = numeric - 273.15;
  const result = to === "c" ? celsius : to === "f" ? celsius * 9 / 5 + 32 : celsius + 273.15;
  return Number.isFinite(result) ? normalizeNegativeZero(result) : null;
}

export function normalizeNegativeZero(value) {
  return Object.is(value, -0) ? 0 : value;
}

function formatScientific(value) {
  const [coefficient, rawExponent] = value.toExponential(10).split("e");
  const compactCoefficient = coefficient.replace(/(?:\.0+|(\.\d+?)0+)$/, "$1");
  const exponent = Number(rawExponent);
  return `${compactCoefficient}e${exponent >= 0 ? "+" : ""}${exponent}`;
}

export function formatNumber(value, locale = "en") {
  if (!Number.isFinite(value)) return "";
  const normalized = normalizeNegativeZero(value);
  const magnitude = Math.abs(normalized);
  if (magnitude !== 0 && (magnitude < 1e-9 || magnitude >= 1e12)) {
    return formatScientific(normalized);
  }
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 10 }).format(normalized);
}

export const MAX_TEXT_BYTES = 1_000_000;

export function utf8ByteLength(input) {
  return new globalThis.TextEncoder().encode(input).byteLength;
}

function hasUnsafeJsonInteger(input) {
  let inString = false;
  let escaped = false;
  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === "\"") inString = false;
      continue;
    }
    if (char === "\"") {
      inString = true;
      continue;
    }
    if (char !== "-" && !/\d/.test(char)) continue;
    const token = input.slice(index).match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/)?.[0];
    if (!token) continue;
    index += token.length - 1;
    if (/[.eE]/.test(token)) continue;
    try {
      if (
        BigInt(token) > BigInt(Number.MAX_SAFE_INTEGER)
        || BigInt(token) < BigInt(Number.MIN_SAFE_INTEGER)
      ) return true;
    } catch {
      return true;
    }
  }
  return false;
}

export function formatJson(input, mode = "pretty") {
  if (typeof input !== "string" || input.trim() === "") return { ok: false, error: "empty" };
  if (utf8ByteLength(input) > MAX_TEXT_BYTES) return { ok: false, error: "too-large" };
  try {
    const parsed = JSON.parse(input);
    const result = {
      ok: true,
      value: JSON.stringify(parsed, null, mode === "minify" ? 0 : 2),
    };
    return hasUnsafeJsonInteger(input)
      ? { ...result, warning: "unsafe-integer" }
      : result;
  } catch {
    return { ok: false, error: "invalid-json" };
  }
}

export function base64Encode(input) {
  if (utf8ByteLength(input) > MAX_TEXT_BYTES) return { ok: false, error: "too-large" };
  const bytes = new globalThis.TextEncoder().encode(input);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 32768) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 32768));
  }
  return globalThis.btoa(binary);
}

export function base64Decode(input) {
  if (
    typeof input !== "string"
    || utf8ByteLength(input) > MAX_TEXT_BYTES
    || (
      input !== ""
      && (
        input.length % 4 !== 0
        || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(input)
      )
    )
  ) {
    return { ok: false, error: input?.length > MAX_TEXT_BYTES ? "too-large" : "invalid" };
  }
  try {
    const bytes = Uint8Array.from(globalThis.atob(input), char => char.codePointAt(0) ?? 0);
    return { ok: true, value: new globalThis.TextDecoder("utf-8", { fatal: true }).decode(bytes) };
  } catch {
    return { ok: false, error: "invalid" };
  }
}

export function urlTransform(input, mode) {
  if (mode !== "encode" && mode !== "decode") {
    return { ok: false, error: "unsupported", input };
  }
  try {
    return { ok: true, value: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input) };
  } catch {
    return { ok: false, error: "invalid", input };
  }
}

export function timestampToDate(input, unit = "auto") {
  const parsed = parseNumberInput(input);
  if (parsed.state !== "valid" || !Number.isInteger(parsed.value)) return null;
  if (!["seconds", "milliseconds", "auto"].includes(unit)) return null;
  const ms = unit === "seconds"
    ? parsed.value * 1000
    : unit === "milliseconds"
      ? parsed.value
      : Math.abs(parsed.value) < 100000000000 ? parsed.value * 1000 : parsed.value;
  if (!Number.isFinite(ms)) return null;
  const date = new Date(ms);
  try {
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  } catch {
    return null;
  }
}

function parseDateTimeParts(input) {
  const match = typeof input === "string"
    ? input.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/)
    : null;
  if (!match) return null;
  const [, year, month, day, hour, minute, second = "0", fraction = "0"] = match;
  const parts = {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
    millisecond: Number(fraction.padEnd(3, "0")),
  };
  if (
    parts.month < 1 || parts.month > 12
    || parts.day < 1 || parts.day > 31
    || parts.hour > 23 || parts.minute > 59 || parts.second > 59
  ) return null;
  return parts;
}

function createUtcDate(parts) {
  const date = new Date(0);
  date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
  date.setUTCHours(parts.hour, parts.minute, parts.second, parts.millisecond);
  return date;
}

function partsMatch(date, parts, interpretation) {
  const prefix = interpretation === "utc" ? "UTC" : "";
  return (
    date[`get${prefix}FullYear`]() === parts.year
    && date[`get${prefix}Month`]() === parts.month - 1
    && date[`get${prefix}Date`]() === parts.day
    && date[`get${prefix}Hours`]() === parts.hour
    && date[`get${prefix}Minutes`]() === parts.minute
    && date[`get${prefix}Seconds`]() === parts.second
    && date[`get${prefix}Milliseconds`]() === parts.millisecond
  );
}

export function dateToTimestamp(input, unit = "seconds", interpretation = "local") {
  if (!["seconds", "milliseconds"].includes(unit)) return null;
  if (!["local", "utc"].includes(interpretation)) return null;
  let time;
  if (typeof input === "string" && /(?:Z|[+-]\d{2}:\d{2})$/.test(input)) {
    time = Date.parse(input);
  } else {
    const parts = parseDateTimeParts(input);
    if (!parts) return null;
    const date = interpretation === "utc"
      ? createUtcDate(parts)
      : new Date(
        parts.year,
        parts.month - 1,
        parts.day,
        parts.hour,
        parts.minute,
        parts.second,
        parts.millisecond,
      );
    if (!partsMatch(date, parts, interpretation)) return null;
    time = date.getTime();
  }
  if (!Number.isFinite(time)) return null;
  return unit === "milliseconds" ? time : Math.floor(time / 1000);
}

export function parseCalendarDate(input) {
  const match = typeof input === "string" ? input.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
  if (!match) return null;
  const [, yearText, monthText, dayText] = match;
  const parts = {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };
  if (parts.month < 1 || parts.month > 12 || parts.day < 1 || parts.day > 31) return null;
  const date = createUtcDate(parts);
  if (!partsMatch(date, parts, "utc")) return null;
  return { year: parts.year, month: parts.month, day: parts.day, utcMs: date.getTime() };
}

export function textStats(input) {
  const lines = input.length === 0 ? 0 : input.split(/\r\n|\r|\n/).length;
  const words = input.trim() ? input.trim().split(/\s+/u).length : 0;
  const segmenter = typeof Intl.Segmenter === "function"
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;
  const characters = segmenter
    ? [...segmenter.segment(input)].length
    : [...input].filter((char, index, chars) => (
      !/\p{Mark}|\uFE0F|\u200D/u.test(char)
      && (index === 0 || chars[index - 1] !== "\u200D")
      && !/[\u{1F3FB}-\u{1F3FF}]/u.test(char)
    )).length;
  return { characters, words, lines };
}

export function changeCase(input, mode) {
  if (mode === "upper") return input.toLocaleUpperCase();
  if (mode === "lower") return input.toLocaleLowerCase();
  if (mode === "title") {
    return input.toLocaleLowerCase().replace(/\p{L}[\p{L}\p{N}'-]*/gu, word => word[0].toLocaleUpperCase() + word.slice(1));
  }
  return input.replace(/[\s_-]+(.)?/g, (_, char = "") => char.toLocaleUpperCase()).replace(/^(.)/, char => char.toLocaleLowerCase());
}

export function hexToRgb(hex) {
  const cleaned = hex.trim().replace(/^#/, "");
  const expanded = cleaned.length === 3 ? cleaned.split("").map(char => char + char).join("") : cleaned;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
  const value = Number.parseInt(expanded, 16);
  return { r: (value >> 16) & 255, g: (value >> 8) & 255, b: value & 255 };
}

export function rgbToHex(r, g, b) {
  const channels = [r, g, b].map(parseFiniteNumber);
  if (channels.some(value => value === null || !Number.isInteger(value) || value < 0 || value > 255)) return null;
  return `#${channels.map(value => value.toString(16).padStart(2, "0")).join("")}`;
}

export function rgbToHsl(r, g, b) {
  const channels = [r, g, b].map(parseFiniteNumber);
  if (channels.some(value => value === null || !Number.isInteger(value) || value < 0 || value > 255)) return null;
  const [red, green, blue] = channels.map(value => value / 255);
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  let hue = 0;
  let saturation = 0;
  if (max !== min) {
    const delta = max - min;
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    if (max === red) hue = (green - blue) / delta + (green < blue ? 6 : 0);
    else if (max === green) hue = (blue - red) / delta + 2;
    else hue = (red - green) / delta + 4;
    hue *= 60;
  }
  return { h: Math.round(hue), s: Math.round(saturation * 100), l: Math.round(lightness * 100) };
}

export function isUuidV4(value) {
  return typeof value === "string"
    && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export function generateUuidV4(cryptoProvider = globalThis.crypto) {
  try {
    if (typeof cryptoProvider?.randomUUID === "function") {
      const value = cryptoProvider.randomUUID();
      return isUuidV4(value) ? value.toLowerCase() : null;
    }
    if (typeof cryptoProvider?.getRandomValues !== "function") return null;
    const bytes = new Uint8Array(16);
    cryptoProvider.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(byte => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  } catch {
    return null;
  }
}

export function percentOf(percent, value) {
  const p = parseFiniteNumber(percent);
  const v = parseFiniteNumber(value);
  if (p === null || v === null) return null;
  const result = (p / 100) * v;
  return Number.isFinite(result) ? normalizeNegativeZero(result) : null;
}

export function discountPrice(price, discountPercent) {
  const p = parseFiniteNumber(price);
  const d = parseFiniteNumber(discountPercent);
  if (p === null || d === null || p < 0 || d < 0 || d > 100) return null;
  const finalPrice = p * (1 - d / 100);
  const saved = p * d / 100;
  if (!Number.isFinite(finalPrice) || !Number.isFinite(saved)) return null;
  return { finalPrice: normalizeNegativeZero(finalPrice), saved: normalizeNegativeZero(saved) };
}

export function bmi(weightKg, heightCm) {
  const weight = parseFiniteNumber(weightKg);
  const height = parseFiniteNumber(heightCm);
  if (weight === null || height === null || weight <= 0 || weight > 1000 || height <= 0 || height > 300) return null;
  const result = weight / ((height / 100) ** 2);
  return Number.isFinite(result) ? result : null;
}

export function bmiCategory(value) {
  const parsed = parseFiniteNumber(value);
  if (parsed === null || parsed < 0) return null;
  if (parsed < 18.5) return "underweight";
  if (parsed < 25) return "healthy";
  if (parsed < 30) return "overweight";
  return "obesity";
}

export function compoundInterest(principal, annualRatePercent, years, compoundsPerYear = 12) {
  const p = parseFiniteNumber(principal);
  const r = parseFiniteNumber(annualRatePercent);
  const y = parseFiniteNumber(years);
  const n = parseFiniteNumber(compoundsPerYear);
  if (
    p === null || r === null || y === null || n === null
    || p < 0 || y < 0 || y > 1000 || !Number.isInteger(n) || n <= 0 || n > 365
  ) return null;
  const periodicBase = 1 + (r / 100) / n;
  if (periodicBase <= 0) return null;
  const amount = p * periodicBase ** (n * y);
  const interest = amount - p;
  if (!Number.isFinite(amount) || !Number.isFinite(interest)) return null;
  return { amount: normalizeNegativeZero(amount), interest: normalizeNegativeZero(interest) };
}

export function dateInterval(start, end) {
  const a = parseCalendarDate(start);
  const b = parseCalendarDate(end);
  if (!a || !b) return null;
  return Math.abs((b.utcMs - a.utcMs) / 86400000);
}

export const MAX_QR_UTF8_BYTES = 1200;

export function createQrGenerationKey(value, size, dark, light) {
  return JSON.stringify([value, Number(size), dark, light]);
}

export function validateQrInput(value) {
  const bytes = utf8ByteLength(value);
  if (!value.trim()) return { ok: false, error: "empty", bytes };
  if (bytes > MAX_QR_UTF8_BYTES) return { ok: false, error: "tooLarge", bytes };
  return { ok: true, bytes };
}

export const POPULAR_VERSION = 1;

export function readToolStats(storage, allowedToolIds) {
  try {
    const raw = storage?.getItem("lite-tools:tool-stats");
    if (!raw) return { version: POPULAR_VERSION, tools: {} };
    const parsed = JSON.parse(raw);
    if (parsed?.version !== POPULAR_VERSION || typeof parsed.tools !== "object" || parsed.tools === null) {
      return { version: POPULAR_VERSION, tools: {} };
    }
    const tools = Object.fromEntries(Object.entries(parsed.tools).filter(([toolId, stat]) => (
      toolId !== "__proto__"
      && toolId !== "constructor"
      && toolId !== "prototype"
      && (!allowedToolIds || allowedToolIds.has(toolId))
      && typeof stat === "object"
      && stat !== null
      && Number.isSafeInteger(stat.count)
      && stat.count >= 0
      && Number.isFinite(stat.lastOpenedAt)
      && stat.lastOpenedAt >= 0
    )));
    return { version: POPULAR_VERSION, tools };
  } catch {
    return { version: POPULAR_VERSION, tools: {} };
  }
}

export function trackToolOpen(storage, toolId, now = Date.now(), allowedToolIds) {
  const stats = readToolStats(storage, allowedToolIds);
  if (allowedToolIds && !allowedToolIds.has(toolId)) return stats;
  if (!Number.isFinite(now) || now < 0) return stats;
  const previous = stats.tools[toolId] ?? { count: 0, lastOpenedAt: 0 };
  if (previous.count >= Number.MAX_SAFE_INTEGER) return stats;
  const next = {
    version: POPULAR_VERSION,
    tools: {
      ...stats.tools,
      [toolId]: { count: previous.count + 1, lastOpenedAt: now },
    },
  };
  try {
    storage?.setItem("lite-tools:tool-stats", JSON.stringify(next));
  } catch {
    return stats;
  }
  return next;
}

export function sortToolsByPopularity(tools, stats, now = Date.now()) {
  return [...tools].sort((a, b) => {
    const statA = stats.tools[a.id] ?? { count: 0, lastOpenedAt: 0 };
    const statB = stats.tools[b.id] ?? { count: 0, lastOpenedAt: 0 };
    const recencyA = statA.lastOpenedAt ? Math.max(0, 1 - ((now - statA.lastOpenedAt) / 604800000)) : 0;
    const recencyB = statB.lastOpenedAt ? Math.max(0, 1 - ((now - statB.lastOpenedAt) / 604800000)) : 0;
    const scoreA = (a.defaultWeight ?? 0) + Math.log1p(statA.count) * 4 + recencyA * 2;
    const scoreB = (b.defaultWeight ?? 0) + Math.log1p(statB.count) * 4 + recencyB * 2;
    return scoreB - scoreA || a.order - b.order;
  });
}
