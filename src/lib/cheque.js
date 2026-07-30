const MAX_INTEGER = 999_999_999_999_999n;
const SMALL = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
const TENS = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
const ENGLISH_GROUPS = ["", "THOUSAND", "MILLION", "BILLION", "TRILLION"];
const FINANCIAL_DIGITS = ["零", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
const SIMPLIFIED_FINANCIAL_DIGITS = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
const SECTION_UNITS = ["", "萬", "億", "兆"];
const SIMPLIFIED_SECTION_UNITS = ["", "万", "亿", "兆"];
const DIGIT_UNITS = ["", "拾", "佰", "仟"];
const DEFAULT_OPTIONS = { currency: "none", englishCase: "upper", chineseScript: "traditional" };

const CURRENCY_OPTIONS = {
  none: { englishPrefix: "", englishMinor: "", traditionalPrefix: "", simplifiedPrefix: "" },
  HKD: { englishPrefix: "HONG KONG DOLLARS", englishMinor: "CENTS", traditionalPrefix: "港幣", simplifiedPrefix: "港币" },
  USD: { englishPrefix: "US DOLLARS", englishMinor: "CENTS", traditionalPrefix: "美元", simplifiedPrefix: "美元" },
  RMB: { englishPrefix: "RENMINBI", englishMinor: "FEN", traditionalPrefix: "人民幣", simplifiedPrefix: "人民币" },
  SGD: { englishPrefix: "SINGAPORE DOLLARS", englishMinor: "CENTS", traditionalPrefix: "新加坡元", simplifiedPrefix: "新加坡元" },
};

export function parseChequeAmount(raw) {
  const input = String(raw).trim();
  if (!input) return { ok: false, reason: "empty" };
  if (input.startsWith("-")) return { ok: false, reason: "negative" };
  const fractionMatch = input.match(/\.(\d*)$/);
  if (fractionMatch && fractionMatch[1].length > 2) return { ok: false, reason: "fraction" };

  const plain = /^\d+(?:\.\d{1,2})?$/;
  const grouped = /^\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?$/;
  if (!plain.test(input) && !grouped.test(input)) return { ok: false, reason: "format" };

  const canonical = input.replaceAll(",", "");
  const [rawInteger, rawFraction = ""] = canonical.split(".");
  const integerText = rawInteger.replace(/^0+(?=\d)/, "");
  const integer = BigInt(integerText);
  if (integer > MAX_INTEGER) return { ok: false, reason: "range" };
  const fraction = rawFraction.padEnd(2, "0");
  const cents = Number(fraction || "00");
  return {
    ok: true,
    normalized: `${integer}.${fraction || "00"}`,
    integer,
    cents,
  };
}

function englishUnderThousand(value) {
  if (value < 20) return SMALL[value];
  if (value < 100) {
    const ones = value % 10;
    return ones ? `${TENS[Math.floor(value / 10)]}-${SMALL[ones]}` : TENS[Math.floor(value / 10)];
  }
  const rest = value % 100;
  return `${SMALL[Math.floor(value / 100)]} HUNDRED${rest ? ` ${englishUnderThousand(rest)}` : ""}`;
}

export function toEnglishChequeWords(integer, cents) {
  if (integer === 0n) return `ZERO AND ${String(cents).padStart(2, "0")}/100 ONLY`;
  const groups = [];
  let remaining = integer;
  let groupIndex = 0;
  while (remaining > 0n) {
    const group = Number(remaining % 1000n);
    if (group) {
      const suffix = ENGLISH_GROUPS[groupIndex];
      groups.unshift(`${englishUnderThousand(group)}${suffix ? ` ${suffix}` : ""}`);
    }
    remaining /= 1000n;
    groupIndex += 1;
  }
  return `${groups.join(" ")} AND ${String(cents).padStart(2, "0")}/100 ONLY`;
}

function englishIntegerWords(integer) {
  if (integer === 0n) return "ZERO";
  const groups = [];
  let remaining = integer;
  let groupIndex = 0;
  while (remaining > 0n) {
    const group = Number(remaining % 1000n);
    if (group) {
      const suffix = ENGLISH_GROUPS[groupIndex];
      groups.unshift(`${englishUnderThousand(group)}${suffix ? ` ${suffix}` : ""}`);
    }
    remaining /= 1000n;
    groupIndex += 1;
  }
  return groups.join(" ");
}

function applyEnglishCase(value, mode) {
  if (mode === "upper") return value;
  if (mode === "sentence") {
    const lower = value.toLowerCase();
    if (value.startsWith("US ")) return `US ${lower.slice(3)}`;
    return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
  }
  return value.toLowerCase().replace(/[a-z]+(?:-[a-z]+)?|us\b/gi, word => {
    if (word.toUpperCase() === "US") return "US";
    return word.split("-").map(part => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("-");
  });
}

function toCurrencyEnglishWords(integer, cents, currency, englishCase) {
  const option = CURRENCY_OPTIONS[currency] ?? CURRENCY_OPTIONS.none;
  const integerWords = englishIntegerWords(integer);
  const words = option.englishPrefix
    ? cents > 0
      ? `${option.englishPrefix} ${integerWords} AND ${option.englishMinor} ${englishUnderThousand(cents)} ONLY`
      : `${option.englishPrefix} ${integerWords} ONLY`
    : toEnglishChequeWords(integer, cents);
  return applyEnglishCase(words, englishCase);
}

function financialSection(value, digits) {
  let output = "";
  let pendingZero = false;
  for (let position = 3; position >= 0; position -= 1) {
    const divisor = 10 ** position;
    const digit = Math.floor(value / divisor) % 10;
    if (digit === 0) {
      if (output && value % divisor !== 0) pendingZero = true;
      continue;
    }
    if (pendingZero) output += digits[0];
    output += `${digits[digit]}${DIGIT_UNITS[position]}`;
    pendingZero = false;
  }
  return output;
}

function toChineseChequeWords(integer, cents, script) {
  const digits = script === "simplified" ? SIMPLIFIED_FINANCIAL_DIGITS : FINANCIAL_DIGITS;
  const sectionUnits = script === "simplified" ? SIMPLIFIED_SECTION_UNITS : SECTION_UNITS;
  const yuan = script === "simplified" ? "圆" : "圓";
  let integerWords = "";
  if (integer === 0n) {
    integerWords = digits[0];
  } else {
    const sections = [];
    let remaining = integer;
    while (remaining > 0n) {
      sections.push(Number(remaining % 10_000n));
      remaining /= 10_000n;
    }
    let pendingZero = false;
    for (let index = sections.length - 1; index >= 0; index -= 1) {
      const section = sections[index];
      if (section === 0) {
        if (integerWords) pendingZero = true;
        continue;
      }
      if (integerWords && (pendingZero || section < 1000)) integerWords += digits[0];
      integerWords += `${financialSection(section, digits)}${sectionUnits[index]}`;
      pendingZero = false;
    }
  }

  const jiao = Math.floor(cents / 10);
  const fen = cents % 10;
  let fractionWords = "";
  if (jiao) fractionWords += `${digits[jiao]}角`;
  if (fen) fractionWords += `${jiao ? "" : digits[0]}${digits[fen]}分`;
  if (!fen) fractionWords += "正";
  return `${integerWords}${yuan}${fractionWords}`;
}

export function toTraditionalChequeWords(integer, cents) {
  return toChineseChequeWords(integer, cents, "traditional");
}

export function toSimplifiedChequeWords(integer, cents) {
  return toChineseChequeWords(integer, cents, "simplified");
}

export function formatChequeDisplayInput(input) {
  const parsed = parseChequeAmount(input);
  if (!parsed.ok) return String(input);
  const groupedInteger = parsed.integer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${groupedInteger}.${String(parsed.cents).padStart(2, "0")}`;
}

export function formatChequeAmount(input, options = DEFAULT_OPTIONS) {
  const parsed = parseChequeAmount(input);
  if (!parsed.ok) return parsed;
  const merged = { ...DEFAULT_OPTIONS, ...options };
  const chinese = merged.chineseScript === "simplified"
    ? toSimplifiedChequeWords(parsed.integer, parsed.cents)
    : toTraditionalChequeWords(parsed.integer, parsed.cents);
  const currency = CURRENCY_OPTIONS[merged.currency] ?? CURRENCY_OPTIONS.none;
  const chinesePrefix = merged.chineseScript === "simplified" ? currency.simplifiedPrefix : currency.traditionalPrefix;
  return {
    ok: true,
    normalized: parsed.normalized,
    english: toCurrencyEnglishWords(parsed.integer, parsed.cents, merged.currency, merged.englishCase),
    chinese: `${chinesePrefix}${chinese}`,
    traditional: toTraditionalChequeWords(parsed.integer, parsed.cents),
  };
}
