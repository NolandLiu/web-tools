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
      KB: 1024,
      MB: 1048576,
      GB: 1073741824,
      TB: 1099511627776,
      PB: 1125899906842624,
    },
    defaultFrom: "GB",
    defaultTo: "MB",
  },
};

export const TEMP_UNITS = ["c", "f", "k"];

export function parseFiniteNumber(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || value.trim() === "") return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export function convertUnit(value, groupId, from, to) {
  const numeric = parseFiniteNumber(value);
  const group = UNIT_GROUPS[groupId];
  if (numeric === null || !group || !(from in group.units) || !(to in group.units)) return null;
  const result = (numeric * group.units[from]) / group.units[to];
  return Number.isFinite(result) ? result : null;
}

export function convertTemperature(value, from, to) {
  const numeric = parseFiniteNumber(value);
  if (numeric === null || !TEMP_UNITS.includes(from) || !TEMP_UNITS.includes(to)) return null;
  let celsius;
  if (from === "c") celsius = numeric;
  else if (from === "f") celsius = (numeric - 32) * 5 / 9;
  else celsius = numeric - 273.15;
  const result = to === "c" ? celsius : to === "f" ? celsius * 9 / 5 + 32 : celsius + 273.15;
  return Number.isFinite(result) ? result : null;
}

export function formatNumber(value, locale = "en") {
  if (!Number.isFinite(value)) return "";
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 10 }).format(value);
}

export function formatJson(input, mode = "pretty") {
  try {
    const parsed = JSON.parse(input);
    return { ok: true, value: JSON.stringify(parsed, null, mode === "minify" ? 0 : 2) };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Invalid JSON" };
  }
}

export function base64Encode(input) {
  return globalThis.btoa(String.fromCodePoint(...new globalThis.TextEncoder().encode(input)));
}

export function base64Decode(input) {
  try {
    const bytes = Uint8Array.from(globalThis.atob(input), char => char.codePointAt(0) ?? 0);
    return { ok: true, value: new globalThis.TextDecoder().decode(bytes) };
  } catch {
    return { ok: false, error: "Invalid Base64 input" };
  }
}

export function urlTransform(input, mode) {
  try {
    return { ok: true, value: mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input) };
  } catch {
    return { ok: false, error: "Invalid URL encoded input" };
  }
}

export function timestampToDate(input) {
  const numeric = parseFiniteNumber(input);
  if (numeric === null) return null;
  const ms = Math.abs(numeric) < 100000000000 ? numeric * 1000 : numeric;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function dateToTimestamp(input, unit = "seconds") {
  const time = new Date(input).getTime();
  if (!Number.isFinite(time)) return null;
  return unit === "milliseconds" ? time : Math.floor(time / 1000);
}

export function textStats(input) {
  const lines = input.length === 0 ? 0 : input.split(/\r\n|\r|\n/).length;
  const words = input.trim() ? input.trim().split(/\s+/u).length : 0;
  return { characters: [...input].length, words, lines };
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
  if (channels.some(value => value === null || value < 0 || value > 255)) return null;
  return `#${channels.map(value => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}

export function rgbToHsl(r, g, b) {
  const channels = [r, g, b].map(parseFiniteNumber);
  if (channels.some(value => value === null || value < 0 || value > 255)) return null;
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

export function percentOf(percent, value) {
  const p = parseFiniteNumber(percent);
  const v = parseFiniteNumber(value);
  return p === null || v === null ? null : (p / 100) * v;
}

export function discountPrice(price, discountPercent) {
  const p = parseFiniteNumber(price);
  const d = parseFiniteNumber(discountPercent);
  if (p === null || d === null || p < 0 || d < 0 || d > 100) return null;
  return { finalPrice: p * (1 - d / 100), saved: p * d / 100 };
}

export function bmi(weightKg, heightCm) {
  const weight = parseFiniteNumber(weightKg);
  const height = parseFiniteNumber(heightCm);
  if (weight === null || height === null || weight <= 0 || height <= 0) return null;
  return weight / ((height / 100) ** 2);
}

export function compoundInterest(principal, annualRatePercent, years, compoundsPerYear = 12) {
  const p = parseFiniteNumber(principal);
  const r = parseFiniteNumber(annualRatePercent);
  const y = parseFiniteNumber(years);
  const n = parseFiniteNumber(compoundsPerYear);
  if (p === null || r === null || y === null || n === null || p < 0 || y < 0 || n <= 0) return null;
  const amount = p * (1 + (r / 100) / n) ** (n * y);
  return { amount, interest: amount - p };
}

export function dateInterval(start, end) {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return Math.abs(Math.round((b - a) / 86400000));
}

export function validateQrInput(value) {
  if (!value.trim()) return { ok: false, error: "empty" };
  if ([...value].length > 1200) return { ok: false, error: "tooLong" };
  return { ok: true };
}

export const POPULAR_VERSION = 1;

export function readToolStats(storage) {
  try {
    const raw = storage?.getItem("lite-tools:tool-stats");
    if (!raw) return { version: POPULAR_VERSION, tools: {} };
    const parsed = JSON.parse(raw);
    if (parsed?.version !== POPULAR_VERSION || typeof parsed.tools !== "object" || parsed.tools === null) {
      return { version: POPULAR_VERSION, tools: {} };
    }
    return parsed;
  } catch {
    return { version: POPULAR_VERSION, tools: {} };
  }
}

export function trackToolOpen(storage, toolId, now = Date.now()) {
  const stats = readToolStats(storage);
  const previous = stats.tools[toolId] ?? { count: 0, lastOpenedAt: 0 };
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
