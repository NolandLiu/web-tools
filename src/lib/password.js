export const AMBIGUOUS_CHARACTERS = "Il1O0o|";
export const DEFAULT_SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";

const DEFAULT_POOLS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: DEFAULT_SYMBOLS,
};
const CATEGORY_KEYS = ["upper", "lower", "digits", "symbols"];

const uniqueCharacters = value => [...new Set(Array.from(value))].join("");

function isPrintableAsciiPunctuation(value) {
  return Array.from(value).every(character => {
    const code = character.codePointAt(0);
    return code >= 33 && code <= 126 && !/[A-Za-z0-9]/.test(character);
  });
}

export function normalizePasswordConfig(input = {}) {
  const length = input.length ?? 16;
  const count = input.count ?? 1;
  if (!Number.isInteger(length) || length < 8 || length > 128) return { ok: false, reason: "length" };
  if (!Number.isInteger(count) || count < 1 || count > 50) return { ok: false, reason: "count" };

  const enabled = {
    upper: input.upper ?? true,
    lower: input.lower ?? true,
    digits: input.digits ?? true,
    symbols: input.symbols ?? true,
  };
  if (!CATEGORY_KEYS.some(key => enabled[key])) return { ok: false, reason: "category" };

  if (enabled.symbols && Object.hasOwn(input, "customSymbols") && input.customSymbols === "") {
    return { ok: false, reason: "symbol-pool" };
  }
  const rawSymbols = input.customSymbols ?? DEFAULT_SYMBOLS;
  if (enabled.symbols && !isPrintableAsciiPunctuation(rawSymbols)) {
    return { ok: false, reason: "symbol-format" };
  }

  const customPools = input.customPools ?? {};
  const pools = {
    upper: customPools.upper ?? DEFAULT_POOLS.upper,
    lower: customPools.lower ?? DEFAULT_POOLS.lower,
    digits: customPools.digits ?? DEFAULT_POOLS.digits,
    symbols: rawSymbols,
  };
  for (const key of CATEGORY_KEYS) {
    pools[key] = uniqueCharacters(pools[key]);
    if (input.excludeAmbiguous) {
      pools[key] = Array.from(pools[key]).filter(character => !AMBIGUOUS_CHARACTERS.includes(character)).join("");
    }
    if (enabled[key] && !pools[key]) return { ok: false, reason: "empty-pool" };
  }

  const suppliedMinimums = input.minimums ?? {};
  const minimums = {};
  for (const key of CATEGORY_KEYS) {
    const minimum = suppliedMinimums[key] ?? (enabled[key] ? 1 : 0);
    if (!Number.isInteger(minimum) || minimum < 0) return { ok: false, reason: "minimum" };
    if (!enabled[key] && minimum !== 0) return { ok: false, reason: "disabled-minimum" };
    minimums[key] = minimum;
  }
  if (Object.values(minimums).reduce((sum, value) => sum + value, 0) > length) {
    return { ok: false, reason: "minimum-total" };
  }

  return {
    ok: true,
    config: { length, count, enabled, minimums, pools, excludeAmbiguous: Boolean(input.excludeAmbiguous) },
  };
}

const browserRandomSource = {
  fill(bytes) {
    if (!globalThis.crypto?.getRandomValues) throw new Error("Secure random source unavailable");
    return globalThis.crypto.getRandomValues(bytes);
  },
};

export function secureRandomIndex(size, source = browserRandomSource) {
  if (!Number.isInteger(size) || size < 1 || size > 256) throw new RangeError("Invalid pool size");
  const limit = Math.floor(256 / size) * size;
  const byte = new Uint8Array(1);
  for (let attempts = 0; attempts < 1024; attempts += 1) {
    source.fill(byte);
    if (byte[0] < limit) return byte[0] % size;
  }
  throw new Error("Secure random source did not yield an unbiased value");
}

function choose(pool, source) {
  return pool[secureRandomIndex(pool.length, source)];
}

function shuffle(characters, source) {
  for (let index = characters.length - 1; index > 0; index -= 1) {
    const target = secureRandomIndex(index + 1, source);
    [characters[index], characters[target]] = [characters[target], characters[index]];
  }
  return characters;
}

function generateOne(config, source) {
  const characters = [];
  const activePools = [];
  for (const key of CATEGORY_KEYS) {
    if (!config.enabled[key]) continue;
    activePools.push(config.pools[key]);
    for (let index = 0; index < config.minimums[key]; index += 1) {
      characters.push(choose(config.pools[key], source));
    }
  }
  const combined = uniqueCharacters(activePools.join(""));
  while (characters.length < config.length) characters.push(choose(combined, source));
  return shuffle(characters, source).join("");
}

export function generatePasswords(input = {}, source = browserRandomSource, options = {}) {
  const normalized = normalizePasswordConfig(input);
  if (!normalized.ok) return normalized;
  const passwords = [];
  const seen = new Set();
  const retryLimit = options.maxDuplicateRetries ?? 100;
  try {
    for (let item = 0; item < normalized.config.count; item += 1) {
      let password = "";
      let attempts = 0;
      do {
        password = generateOne(normalized.config, source);
        attempts += 1;
      } while (seen.has(password) && attempts <= retryLimit);
      if (seen.has(password)) return { ok: false, reason: "unique-space" };
      seen.add(password);
      passwords.push(password);
    }
  } catch {
    return { ok: false, reason: "random-source" };
  }
  return { ok: true, passwords, config: normalized.config };
}

export function passwordStrength(input = {}) {
  const normalized = normalizePasswordConfig(input);
  if (!normalized.ok) return { label: "weak", bits: 0 };
  const poolSize = uniqueCharacters(
    CATEGORY_KEYS.filter(key => normalized.config.enabled[key]).map(key => normalized.config.pools[key]).join(""),
  ).length;
  const bits = normalized.config.length * Math.log2(poolSize);
  const label = bits < 50 ? "weak" : bits < 70 ? "fair" : bits < 100 ? "strong" : "very-strong";
  return { label, bits };
}
