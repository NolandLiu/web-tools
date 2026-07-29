const MAX_INTEGER = 999_999_999_999_999n;
const SMALL = ["ZERO", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE", "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"];
const TENS = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"];
const ENGLISH_GROUPS = ["", "THOUSAND", "MILLION", "BILLION", "TRILLION"];
const FINANCIAL_DIGITS = ["零", "壹", "貳", "參", "肆", "伍", "陸", "柒", "捌", "玖"];
const SECTION_UNITS = ["", "萬", "億", "兆"];
const DIGIT_UNITS = ["", "拾", "佰", "仟"];

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

function traditionalSection(value) {
  let output = "";
  let pendingZero = false;
  for (let position = 3; position >= 0; position -= 1) {
    const divisor = 10 ** position;
    const digit = Math.floor(value / divisor) % 10;
    if (digit === 0) {
      if (output && value % divisor !== 0) pendingZero = true;
      continue;
    }
    if (pendingZero) output += FINANCIAL_DIGITS[0];
    output += `${FINANCIAL_DIGITS[digit]}${DIGIT_UNITS[position]}`;
    pendingZero = false;
  }
  return output;
}

export function toTraditionalChequeWords(integer, cents) {
  let integerWords = "";
  if (integer === 0n) {
    integerWords = FINANCIAL_DIGITS[0];
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
      if (integerWords && (pendingZero || section < 1000)) integerWords += FINANCIAL_DIGITS[0];
      integerWords += `${traditionalSection(section)}${SECTION_UNITS[index]}`;
      pendingZero = false;
    }
  }

  const jiao = Math.floor(cents / 10);
  const fen = cents % 10;
  let fractionWords = "";
  if (jiao) fractionWords += `${FINANCIAL_DIGITS[jiao]}角`;
  if (fen) fractionWords += `${jiao ? "" : FINANCIAL_DIGITS[0]}${FINANCIAL_DIGITS[fen]}分`;
  if (!fen) fractionWords += "正";
  return `${integerWords}圓${fractionWords}`;
}

export function formatChequeAmount(input) {
  const parsed = parseChequeAmount(input);
  if (!parsed.ok) return parsed;
  return {
    ok: true,
    normalized: parsed.normalized,
    english: toEnglishChequeWords(parsed.integer, parsed.cents),
    traditional: toTraditionalChequeWords(parsed.integer, parsed.cents),
  };
}
