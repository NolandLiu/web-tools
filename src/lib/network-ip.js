/* global Response, TextEncoder */

const IPV4_MAX = 0xffffffffn;
const IPV6_MAX = (1n << 128n) - 1n;

export const NETWORK_API_PATHS = {
  lookup: "/api/network/ip-lookup",
  rdap: "/api/network/ip-rdap",
};

export const NETWORK_ERROR_CODES = [
  "INVALID_REQUEST",
  "INVALID_CONTENT_TYPE",
  "INVALID_IP",
  "UNSUPPORTED_ADDRESS_TYPE",
  "REQUEST_TOO_LARGE",
  "RATE_LIMITED",
  "UPSTREAM_TIMEOUT",
  "UPSTREAM_UNAVAILABLE",
  "UPSTREAM_INVALID_RESPONSE",
  "ALL_PROVIDERS_FAILED",
  "RESPONSE_TOO_LARGE",
  "CONFIGURATION_ERROR",
  "INTERNAL_ERROR",
];

const ok = data => ({ ok: true, data });
const fail = reason => ({ ok: false, reason });

export function parseIpv4(input) {
  const value = String(input ?? "").trim();
  if (!value) return fail("empty");
  const parts = value.split(".");
  if (parts.length !== 4) return fail("format");
  let numeric = 0n;
  for (const part of parts) {
    if (/^\d+$/.test(part) && part.length > 1 && part.startsWith("0")) return fail("ambiguous-leading-zero");
    if (!/^(0|[1-9]\d*)$/.test(part)) return fail("format");
    const octet = Number(part);
    if (!Number.isInteger(octet) || octet < 0 || octet > 255) return fail("range");
    numeric = (numeric << 8n) + BigInt(octet);
  }
  return ok({ value, numeric });
}

export function parseIpv4Octets(octets) {
  const values = Array.isArray(octets) ? octets.map(value => String(value ?? "").trim()) : [];
  if (values.length !== 4) return fail("format");
  if (values.some(value => !value)) return fail("empty");
  const parsed = parseIpv4(values.join("."));
  return parsed.ok ? ok({ ...parsed.data, ip: parsed.data.value }) : parsed;
}

export function shouldAutoAdvanceIpv4Octet({ value, inputType, index }) {
  const text = String(value ?? "").trim();
  if (Number(index) >= 3) return false;
  if (inputType !== "insertText") return false;
  if (!/^\d{3}$/.test(text)) return false;
  return parseIpv4Octets([text, "0", "0", "0"]).ok;
}

export function ipv4ToString(numeric) {
  const value = BigInt(numeric);
  if (value < 0n || value > IPV4_MAX) throw new RangeError("IPv4 out of range");
  return [24n, 16n, 8n, 0n].map(shift => Number((value >> shift) & 255n)).join(".");
}

export function parseIpv4Integer(input) {
  const value = String(input ?? "").trim();
  if (!/^(0|[1-9]\d*)$/.test(value)) return fail("format");
  const numeric = BigInt(value);
  if (numeric > IPV4_MAX) return fail("range");
  return ok({ numeric });
}

export function parseIpv4Binary(input) {
  const raw = String(input ?? "").trim().replace(/\s+/g, "");
  if (!/^[01]{32}$/.test(raw)) return fail("format");
  return ok({ numeric: BigInt(`0b${raw}`), binary: raw });
}

export function parseIpv4Hex(input) {
  const raw = String(input ?? "").trim().replace(/^0x/i, "");
  if (!/^[0-9a-fA-F]{8}$/.test(raw)) return fail("format");
  return ok({ numeric: BigInt(`0x${raw}`) });
}

export function formatIpv4Binary(numeric, grouped = false) {
  const binary = BigInt(numeric).toString(2).padStart(32, "0");
  return grouped ? binary.match(/.{1,8}/g).join(" ") : binary;
}

export function formatIpv4Hex(numeric) {
  return BigInt(numeric).toString(16).toUpperCase().padStart(8, "0");
}

export function prefixToMask(prefix) {
  const numericPrefix = Number(prefix);
  if (!Number.isInteger(numericPrefix) || numericPrefix < 0 || numericPrefix > 32) return fail("prefix");
  const mask = numericPrefix === 0 ? 0n : (IPV4_MAX << BigInt(32 - numericPrefix)) & IPV4_MAX;
  return ok({ prefix: numericPrefix, mask });
}

export function parseSubnetMask(input) {
  const parsed = parseIpv4(input);
  if (!parsed.ok) return parsed;
  const mask = parsed.data.numeric;
  let seenZero = false;
  let prefix = 0;
  for (let bit = 31n; bit >= 0n; bit -= 1n) {
    const one = ((mask >> bit) & 1n) === 1n;
    if (one && seenZero) return fail("non-contiguous");
    if (one) prefix += 1;
    else seenZero = true;
  }
  return ok({ prefix, mask });
}

export function parseIpv4Cidr(input) {
  const raw = String(input ?? "").trim();
  const [ipPart, prefixPart] = raw.split("/");
  if (!ipPart || prefixPart === undefined || raw.split("/").length !== 2) return fail("format");
  const ip = parseIpv4(ipPart);
  const prefix = prefixToMask(prefixPart);
  if (!ip.ok) return ip;
  if (!prefix.ok) return prefix;
  return ok({ ip: ip.data.numeric, prefix: prefix.data.prefix });
}

export function calculateIpv4Subnet({ ip, prefix }) {
  const ipParsed = typeof ip === "bigint" ? ok({ numeric: ip }) : parseIpv4(ip);
  const maskParsed = prefixToMask(prefix);
  if (!ipParsed.ok) return ipParsed;
  if (!maskParsed.ok) return maskParsed;
  const ipValue = ipParsed.data.numeric;
  const { mask, prefix: normalizedPrefix } = maskParsed.data;
  const network = ipValue & mask;
  const wildcard = IPV4_MAX ^ mask;
  const broadcast = network | wildcard;
  const total = 1n << BigInt(32 - normalizedPrefix);
  const usable = normalizedPrefix <= 30 ? total - 2n : normalizedPrefix === 31 ? 2n : 1n;
  const firstUsable = normalizedPrefix <= 30 ? network + 1n : network;
  const lastUsable = normalizedPrefix <= 30 ? broadcast - 1n : broadcast;
  const semantics = normalizedPrefix === 31
    ? "point-to-point"
    : normalizedPrefix === 32
      ? "single-host"
      : "standard";
  return ok({
    input: ipv4ToString(ipValue),
    cidr: `${ipv4ToString(network)}/${normalizedPrefix}`,
    prefix: normalizedPrefix,
    mask: ipv4ToString(mask),
    maskBinary: formatIpv4Binary(mask, true),
    wildcard: ipv4ToString(wildcard),
    network: ipv4ToString(network),
    broadcast: semantics === "standard" ? ipv4ToString(broadcast) : null,
    firstUsable: ipv4ToString(firstUsable),
    lastUsable: ipv4ToString(lastUsable),
    total,
    usable,
    semantics,
    addressClass: classifyIpv4(ipValue).label,
    binaryAddress: formatIpv4Binary(ipValue, true),
    numericNetwork: network,
    numericBroadcast: broadcast,
  });
}

export function requiredHostsToPrefix(hosts) {
  const raw = String(hosts ?? "").trim();
  if (!/^(0|[1-9]\d*)$/.test(raw)) return fail("format");
  const wanted = BigInt(raw);
  if (wanted < 1n) return fail("range");
  for (let prefix = 32; prefix >= 0; prefix -= 1) {
    const total = 1n << BigInt(32 - prefix);
    const usable = prefix <= 30 ? total - 2n : prefix === 31 ? 2n : 1n;
    if (usable >= wanted) return ok({ prefix, total, usable });
  }
  return fail("too-large");
}

export function sameIpv4Subnet(ipA, ipB, prefix) {
  const a = parseIpv4(ipA);
  const b = parseIpv4(ipB);
  const mask = prefixToMask(prefix);
  if (!a.ok) return a;
  if (!b.ok) return b;
  if (!mask.ok) return mask;
  return ok({ same: (a.data.numeric & mask.data.mask) === (b.data.numeric & mask.data.mask) });
}

export function cidrToIpv4Range(cidr) {
  const parsed = parseIpv4Cidr(cidr);
  if (!parsed.ok) return parsed;
  const subnet = calculateIpv4Subnet({ ip: parsed.data.ip, prefix: parsed.data.prefix });
  if (!subnet.ok) return subnet;
  return ok({
    start: subnet.data.network,
    end: subnet.data.semantics === "standard" ? subnet.data.broadcast : ipv4ToString(subnet.data.numericBroadcast),
    total: subnet.data.total,
    cidr: subnet.data.cidr,
  });
}

function trailingZeroBits32(value) {
  if (value === 0n) return 32;
  let count = 0;
  let candidate = value;
  while ((candidate & 1n) === 0n && count < 32) {
    count += 1;
    candidate >>= 1n;
  }
  return count;
}

function floorLog2(value) {
  let count = -1;
  let candidate = BigInt(value);
  while (candidate > 0n) {
    candidate >>= 1n;
    count += 1;
  }
  return count;
}

export function ipv4RangeToCidrs(startInput, endInput) {
  const start = parseIpv4(startInput);
  const end = parseIpv4(endInput);
  if (!start.ok) return start;
  if (!end.ok) return end;
  if (start.data.numeric > end.data.numeric) return fail("reversed");
  let current = start.data.numeric;
  const last = end.data.numeric;
  const cidrs = [];
  while (current <= last) {
    const remaining = last - current + 1n;
    const maxAlignment = trailingZeroBits32(current);
    const maxByRemaining = floorLog2(remaining);
    const hostBits = Math.min(maxAlignment, maxByRemaining);
    const prefix = 32 - hostBits;
    cidrs.push(`${ipv4ToString(current)}/${prefix}`);
    current += 1n << BigInt(hostBits);
  }
  return ok({ cidrs });
}

const ipv4Range = (cidr, type, label, publicQuery = false) => {
  const parsed = parseIpv4Cidr(cidr);
  const mask = parsed.ok ? prefixToMask(parsed.data.prefix).data.mask : 0n;
  const start = parsed.ok ? parsed.data.ip & mask : 0n;
  const wildcard = IPV4_MAX ^ mask;
  return {
    cidr,
    start,
    end: start | wildcard,
    type,
    label,
    publicQuery,
    prefix: parsed.ok ? parsed.data.prefix : 0,
  };
};

export const IPV4_SPECIAL_RANGES_REVIEWED_AT = "2026-07-30";
export const IPV4_SPECIAL_RANGES = [
  ipv4Range("0.0.0.0/32", "unspecified", "Unspecified"),
  ipv4Range("255.255.255.255/32", "limited-broadcast", "Limited broadcast"),
  ipv4Range("127.0.0.0/8", "loopback", "Loopback"),
  ipv4Range("10.0.0.0/8", "private", "Private"),
  ipv4Range("172.16.0.0/12", "private", "Private"),
  ipv4Range("192.168.0.0/16", "private", "Private"),
  ipv4Range("169.254.0.0/16", "link-local", "Link-local"),
  ipv4Range("100.64.0.0/10", "shared", "Shared address space"),
  ipv4Range("192.0.2.0/24", "documentation", "Documentation"),
  ipv4Range("198.51.100.0/24", "documentation", "Documentation"),
  ipv4Range("203.0.113.0/24", "documentation", "Documentation"),
  ipv4Range("198.18.0.0/15", "benchmarking", "Benchmarking"),
  ipv4Range("224.0.0.0/4", "multicast", "Multicast"),
  ipv4Range("240.0.0.0/4", "reserved", "Reserved"),
  ipv4Range("0.0.0.0/8", "special", "This network"),
].sort((a, b) => b.prefix - a.prefix);

export function classifyIpv4(input) {
  const numeric = typeof input === "bigint" ? input : parseIpv4(input).data?.numeric;
  for (const range of IPV4_SPECIAL_RANGES) {
    if (numeric >= range.start && numeric <= range.end) return range;
  }
  return { type: "public", label: "Public", publicQuery: true, cidr: "0.0.0.0/0" };
}

export function convertIpv4(input, source) {
  const parsed = source === "decimal"
    ? parseIpv4Integer(input)
    : source === "binary"
      ? parseIpv4Binary(input)
      : source === "hex"
        ? parseIpv4Hex(input)
        : parseIpv4(input);
  if (!parsed.ok) return parsed;
  const numeric = parsed.data.numeric;
  return ok({
    dotted: ipv4ToString(numeric),
    decimal: numeric.toString(),
    binary: formatIpv4Binary(numeric),
    groupedBinary: formatIpv4Binary(numeric, true),
    hex: formatIpv4Hex(numeric),
    classification: classifyIpv4(numeric),
  });
}

export function parseIpv6(input) {
  const raw = String(input ?? "").trim();
  if (!raw) return fail("empty");
  if (raw.includes("%")) return fail("zone-id");
  if ((raw.match(/::/g) || []).length > 1) return fail("format");
  const [leftRaw, rightRaw] = raw.split("::");
  const left = leftRaw ? leftRaw.split(":") : [];
  const right = rightRaw ? rightRaw.split(":") : [];
  const expandPart = part => {
    const groups = [];
    for (const item of part) {
      if (!item) return null;
      if (item.includes(".")) {
        const v4 = parseIpv4(item);
        if (!v4.ok) return null;
        groups.push(Number((v4.data.numeric >> 16n) & 0xffffn).toString(16));
        groups.push(Number(v4.data.numeric & 0xffffn).toString(16));
      } else {
        if (!/^[0-9a-fA-F]{1,4}$/.test(item)) return null;
        groups.push(item);
      }
    }
    return groups;
  };
  const leftGroups = expandPart(left);
  const rightGroups = expandPart(right);
  if (!leftGroups || !rightGroups) return fail("format");
  let groups;
  if (raw.includes("::")) {
    const zeros = 8 - leftGroups.length - rightGroups.length;
    if (zeros < 1) return fail("format");
    groups = [...leftGroups, ...Array(zeros).fill("0"), ...rightGroups];
  } else {
    groups = leftGroups;
  }
  if (groups.length !== 8) return fail("format");
  const words = groups.map(group => Number.parseInt(group, 16));
  let numeric = 0n;
  for (const word of words) numeric = (numeric << 16n) + BigInt(word);
  return ok({ numeric, words });
}

export function ipv6ToExpanded(input) {
  const parsed = typeof input === "bigint" ? { ok: true, data: { numeric: input } } : parseIpv6(input);
  if (!parsed.ok) return parsed;
  let numeric = parsed.data.numeric;
  if (numeric < 0n || numeric > IPV6_MAX) return fail("range");
  const words = [];
  for (let i = 0; i < 8; i += 1) {
    words.unshift(Number(numeric & 0xffffn).toString(16).padStart(4, "0"));
    numeric >>= 16n;
  }
  return ok({ expanded: words.join(":"), words });
}

export function ipv6ToCompressed(input) {
  const expanded = ipv6ToExpanded(input);
  if (!expanded.ok) return expanded;
  const words = expanded.data.words.map(word => word.replace(/^0+/, "") || "0");
  let bestStart = -1;
  let bestLength = 0;
  for (let i = 0; i < words.length; i += 1) {
    if (words[i] !== "0") continue;
    let j = i;
    while (j < words.length && words[j] === "0") j += 1;
    const length = j - i;
    if (length > bestLength && length > 1) {
      bestStart = i;
      bestLength = length;
    }
    i = j - 1;
  }
  if (bestStart === -1) return ok({ compressed: words.join(":") });
  const before = words.slice(0, bestStart).join(":");
  const after = words.slice(bestStart + bestLength).join(":");
  if (!before && !after) return ok({ compressed: "::" });
  if (!before) return ok({ compressed: `::${after}` });
  if (!after) return ok({ compressed: `${before}::` });
  return ok({ compressed: `${before}::${after}` });
}

export function ipv6PrefixRange(input, prefix) {
  const parsed = parseIpv6(input);
  const prefixNumber = Number(prefix);
  if (!parsed.ok) return parsed;
  if (!Number.isInteger(prefixNumber) || prefixNumber < 0 || prefixNumber > 128) return fail("prefix");
  const hostBits = BigInt(128 - prefixNumber);
  const mask = prefixNumber === 0 ? 0n : (IPV6_MAX << hostBits) & IPV6_MAX;
  const start = parsed.data.numeric & mask;
  const end = start | (IPV6_MAX ^ mask);
  const total = 1n << hostBits;
  return ok({
    prefix: prefixNumber,
    start: ipv6ToCompressed(start).data.compressed,
    end: ipv6ToCompressed(end).data.compressed,
    total,
  });
}

export function classifyIpv6(input) {
  const parsed = typeof input === "bigint" ? ok({ numeric: input }) : parseIpv6(input);
  if (!parsed.ok) return { type: "invalid", label: "Invalid", publicQuery: false };
  const n = parsed.data.numeric;
  if (n === 0n) return { type: "unspecified", label: "Unspecified", publicQuery: false };
  if (n === 1n) return { type: "loopback", label: "Loopback", publicQuery: false };
  if ((n >> 32n) === BigInt("0xffff")) return { type: "ipv4-mapped", label: "IPv4-mapped IPv6", publicQuery: false };
  if ((n >> 121n) === 0x7en) return { type: "unique-local", label: "Unique local", publicQuery: false };
  if ((n >> 118n) === 0x3fan) return { type: "link-local", label: "Link-local", publicQuery: false };
  if ((n >> 120n) === 0xffn) return { type: "multicast", label: "Multicast", publicQuery: false };
  if ((n >> 112n) === 0x2001n && ((n >> 96n) & 0xffffn) === 0xdb8n) return { type: "documentation", label: "Documentation", publicQuery: false };
  if ((n >> 125n) === 0x1n) return { type: "global-unicast", label: "Global Unicast", publicQuery: true };
  return { type: "reserved", label: "Reserved or special", publicQuery: false };
}

export function normalizeIp(input) {
  const ipv4 = parseIpv4(input);
  if (ipv4.ok) return ok({ version: 4, ip: ipv4ToString(ipv4.data.numeric), numeric: ipv4.data.numeric, classification: classifyIpv4(ipv4.data.numeric) });
  const ipv6 = parseIpv6(input);
  if (ipv6.ok) return ok({ version: 6, ip: ipv6ToCompressed(ipv6.data.numeric).data.compressed, numeric: ipv6.data.numeric, classification: classifyIpv6(ipv6.data.numeric) });
  return fail("invalid");
}

export function isPublicQueryableIp(input) {
  const normalized = normalizeIp(input);
  if (!normalized.ok) return normalized;
  if (!normalized.data.classification.publicQuery) return fail("unsupported-address-type");
  return normalized;
}

export function createApiResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function readStrictJsonRequest(request, { maxBytes = 2048, allowedFields = ["ip", "mode"] } = {}) {
  if (request.method !== "POST") return failApi("INVALID_REQUEST", false);
  const contentType = request.headers.get("Content-Type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) return failApi("INVALID_CONTENT_TYPE", false);
  const text = await request.text();
  if (new TextEncoder().encode(text).length > maxBytes) return failApi("REQUEST_TOO_LARGE", false);
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    return failApi("INVALID_REQUEST", false);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return failApi("INVALID_REQUEST", false);
  if (Object.keys(body).some(key => !allowedFields.includes(key))) return failApi("INVALID_REQUEST", false);
  if (body.mode !== undefined) {
    if (body.mode !== "current") return failApi("INVALID_REQUEST", false);
    if (body.ip !== undefined) return failApi("INVALID_REQUEST", false);
    return ok({ mode: "current" });
  }
  if (typeof body.ip !== "string") return failApi("INVALID_IP", false);
  return ok({ mode: "ip", ip: body.ip });
}

export function failApi(code, retryable = false) {
  return { ok: false, error: { code, message: code, retryable } };
}

export async function handleIpLookupRequest(request, { provider, currentProvider, now = () => new Date() } = {}) {
  const parsed = await readStrictJsonRequest(request);
  if (!parsed.ok) return createApiResponse(parsed, parsed.error.code === "INVALID_CONTENT_TYPE" ? 415 : 400);
  if (parsed.data.mode === "current") {
    if (!currentProvider) return createApiResponse(failApi("CONFIGURATION_ERROR"), 503);
    const result = await currentProvider.lookup();
    if (!result.ok) return createApiResponse(failApi(result.code, result.retryable ?? false), result.status ?? 502);
    return createApiResponse({
      ok: true,
      data: result.data,
      meta: { source: result.source, retrievedAt: now().toISOString(), ...(result.meta ?? {}) },
    });
  }
  const normalized = isPublicQueryableIp(parsed.data.ip);
  if (!normalized.ok) {
    return createApiResponse(failApi(normalized.reason === "unsupported-address-type" ? "UNSUPPORTED_ADDRESS_TYPE" : "INVALID_IP"), 400);
  }
  if (!provider) return createApiResponse(failApi("CONFIGURATION_ERROR"), 503);
  const result = await provider.lookup(normalized.data);
  if (!result.ok) return createApiResponse(failApi(result.code, result.retryable ?? false), result.status ?? 502);
  return createApiResponse({
    ok: true,
    data: result.data,
    meta: { source: result.source, retrievedAt: now().toISOString(), ...(result.meta ?? {}) },
  });
}

export async function handleRdapRequest(request, { provider, now = () => new Date() } = {}) {
  const parsed = await readStrictJsonRequest(request);
  if (!parsed.ok) return createApiResponse(parsed, parsed.error.code === "INVALID_CONTENT_TYPE" ? 415 : 400);
  const normalized = isPublicQueryableIp(parsed.data.ip);
  if (!normalized.ok) {
    return createApiResponse(failApi(normalized.reason === "unsupported-address-type" ? "UNSUPPORTED_ADDRESS_TYPE" : "INVALID_IP"), 400);
  }
  if (!provider) return createApiResponse(failApi("CONFIGURATION_ERROR"), 503);
  const result = await provider.lookup(normalized.data);
  if (!result.ok) return createApiResponse(failApi(result.code, result.retryable ?? false), result.status ?? 502);
  return createApiResponse({
    ok: true,
    data: result.data,
    meta: { source: result.source, retrievedAt: now().toISOString(), ...(result.meta ?? {}) },
  });
}
