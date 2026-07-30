import assert from "node:assert/strict";
import test from "node:test";
import {
  NETWORK_API_PATHS,
  calculateIpv4Subnet,
  cidrToIpv4Range,
  classifyIpv4,
  classifyIpv6,
  convertIpv4,
  handleIpLookupRequest,
  handleRdapRequest,
  ipv4RangeToCidrs,
  ipv6PrefixRange,
  ipv6ToCompressed,
  ipv6ToExpanded,
  parseIpv4,
  parseSubnetMask,
  parseIpv6,
  requiredHostsToPrefix,
  sameIpv4Subnet,
} from "../src/lib/network-ip.js";

test("IPv4 parser rejects ambiguous and malformed address forms", () => {
  assert.equal(parseIpv4("192.168.1.1").data.numeric, 3232235777n);
  assert.equal(parseIpv4("192.168.001.1").reason, "ambiguous-leading-zero");
  assert.equal(parseIpv4("192.168.1").reason, "format");
  assert.equal(parseIpv4("192.168.1.256").reason, "range");
  assert.equal(parseIpv4("-1.0.0.0").reason, "format");
});

test("IPv4 subnet calculator handles boundary prefixes and RFC 3021 semantics", () => {
  assert.deepEqual(calculateIpv4Subnet({ ip: "192.168.1.10", prefix: 24 }).data, {
    input: "192.168.1.10",
    cidr: "192.168.1.0/24",
    prefix: 24,
    mask: "255.255.255.0",
    maskBinary: "11111111 11111111 11111111 00000000",
    wildcard: "0.0.0.255",
    network: "192.168.1.0",
    broadcast: "192.168.1.255",
    firstUsable: "192.168.1.1",
    lastUsable: "192.168.1.254",
    total: 256n,
    usable: 254n,
    semantics: "standard",
    addressClass: "Private",
    binaryAddress: "11000000 10101000 00000001 00001010",
    numericNetwork: 3232235776n,
    numericBroadcast: 3232236031n,
  });
  assert.equal(calculateIpv4Subnet({ ip: "10.0.0.0", prefix: 0 }).data.total, 4294967296n);
  assert.equal(calculateIpv4Subnet({ ip: "10.0.0.1", prefix: 1 }).data.mask, "128.0.0.0");
  assert.equal(calculateIpv4Subnet({ ip: "10.0.0.1", prefix: 8 }).data.network, "10.0.0.0");
  assert.equal(calculateIpv4Subnet({ ip: "192.0.2.1", prefix: 30 }).data.usable, 2n);
  assert.equal(calculateIpv4Subnet({ ip: "192.0.2.0", prefix: 31 }).data.semantics, "point-to-point");
  assert.equal(calculateIpv4Subnet({ ip: "192.0.2.0", prefix: 31 }).data.broadcast, null);
  assert.equal(calculateIpv4Subnet({ ip: "192.0.2.1", prefix: 32 }).data.semantics, "single-host");
});

test("IPv4 mask, host planning, and same-subnet checks are exact", () => {
  assert.equal(parseSubnetMask("255.255.255.0").data.prefix, 24);
  assert.equal(parseSubnetMask("255.0.255.0").reason, "non-contiguous");
  assert.deepEqual(requiredHostsToPrefix("254").data, { prefix: 24, total: 256n, usable: 254n });
  assert.equal(requiredHostsToPrefix("0").reason, "range");
  assert.equal(sameIpv4Subnet("192.168.1.1", "192.168.1.200", 24).data.same, true);
  assert.equal(sameIpv4Subnet("192.168.1.1", "192.168.2.1", 24).data.same, false);
});

test("IPv4 range and CIDR conversion is exact without enumeration", () => {
  assert.deepEqual(cidrToIpv4Range("192.168.1.0/24").data, {
    start: "192.168.1.0",
    end: "192.168.1.255",
    total: 256n,
    cidr: "192.168.1.0/24",
  });
  assert.deepEqual(ipv4RangeToCidrs("192.168.1.1", "192.168.1.1").data.cidrs, ["192.168.1.1/32"]);
  assert.deepEqual(ipv4RangeToCidrs("0.0.0.0", "255.255.255.255").data.cidrs, ["0.0.0.0/0"]);
  assert.deepEqual(ipv4RangeToCidrs("192.168.1.1", "192.168.1.6").data.cidrs, [
    "192.168.1.1/32",
    "192.168.1.2/31",
    "192.168.1.4/31",
    "192.168.1.6/32",
  ]);
  assert.equal(ipv4RangeToCidrs("192.168.1.9", "192.168.1.1").reason, "reversed");
});

test("IPv4 conversion uses unsigned 32-bit representation and local special ranges", () => {
  assert.deepEqual(convertIpv4("255.255.255.255", "dotted").data, {
    dotted: "255.255.255.255",
    decimal: "4294967295",
    binary: "11111111111111111111111111111111",
    groupedBinary: "11111111 11111111 11111111 11111111",
    hex: "FFFFFFFF",
    classification: classifyIpv4("255.255.255.255"),
  });
  assert.equal(convertIpv4("FFFFFFFF", "hex").data.dotted, "255.255.255.255");
  assert.equal(convertIpv4("11000000101010000000000100000001", "binary").data.dotted, "192.168.1.1");
  assert.equal(convertIpv4("4294967295", "decimal").data.dotted, "255.255.255.255");
  assert.equal(classifyIpv4("10.0.0.1").type, "private");
  assert.equal(classifyIpv4("127.0.0.1").type, "loopback");
  assert.equal(classifyIpv4("169.254.1.1").type, "link-local");
  assert.equal(classifyIpv4("100.64.0.1").type, "shared");
  assert.equal(classifyIpv4("192.0.2.1").type, "documentation");
  assert.equal(classifyIpv4("224.0.0.1").type, "multicast");
  assert.equal(classifyIpv4("8.8.8.8").type, "public");
});

test("IPv6 parser, RFC 5952 compression, prefix ranges, and classification are precise", () => {
  assert.equal(ipv6ToExpanded("::").data.expanded, "0000:0000:0000:0000:0000:0000:0000:0000");
  assert.equal(ipv6ToExpanded("::1").data.expanded, "0000:0000:0000:0000:0000:0000:0000:0001");
  assert.equal(ipv6ToCompressed("2001:0db8:0000:0000:0000:ff00:0042:8329").data.compressed, "2001:db8::ff00:42:8329");
  assert.equal(ipv6ToCompressed("2001:db8:0:1:0:1:1:1").data.compressed, "2001:db8:0:1:0:1:1:1");
  assert.equal(ipv6ToCompressed("2001:0:0:1:0:0:1:1").data.compressed, "2001::1:0:0:1:1");
  assert.equal(parseIpv6("2001::1::1").reason, "format");
  assert.equal(parseIpv6("fe80::1%en0").reason, "zone-id");
  assert.equal(parseIpv6("2001:db8::zz").reason, "format");
  assert.deepEqual(ipv6PrefixRange("2001:db8::1", 64).data, {
    prefix: 64,
    start: "2001:db8::",
    end: "2001:db8::ffff:ffff:ffff:ffff",
    total: 18446744073709551616n,
  });
  assert.equal(ipv6PrefixRange("::", 0).data.total, 1n << 128n);
  assert.equal(ipv6PrefixRange("::1", 128).data.start, "::1");
  assert.equal(classifyIpv6("::").type, "unspecified");
  assert.equal(classifyIpv6("::1").type, "loopback");
  assert.equal(classifyIpv6("fd00::1").type, "unique-local");
  assert.equal(classifyIpv6("fe80::1").type, "link-local");
  assert.equal(classifyIpv6("ff02::1").type, "multicast");
  assert.equal(classifyIpv6("2001:db8::1").type, "documentation");
  assert.equal(classifyIpv6("::ffff:192.0.2.128").type, "ipv4-mapped");
});

test("network API contract validates request shape and blocks unsupported addresses before providers", async () => {
  assert.equal(NETWORK_API_PATHS.lookup, "/api/network/ip-lookup");
  let called = false;
  const provider = { lookup: async () => { called = true; return { ok: true, data: { ip: "8.8.8.8" }, source: "mock" }; } };
  const privateResponse = await handleIpLookupRequest(new Request("https://tools.godeskhub.com/api/network/ip-lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip: "192.168.1.1" }),
  }), { provider });
  assert.equal(privateResponse.status, 400);
  assert.equal((await privateResponse.json()).error.code, "UNSUPPORTED_ADDRESS_TYPE");
  assert.equal(called, false);

  const success = await handleIpLookupRequest(new Request("https://tools.godeskhub.com/api/network/ip-lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip: "8.8.8.8" }),
  }), { provider, now: () => new Date("2026-07-30T00:00:00.000Z") });
  assert.equal(success.status, 200);
  assert.deepEqual(await success.json(), {
    ok: true,
    data: { ip: "8.8.8.8" },
    meta: { source: "mock", retrievedAt: "2026-07-30T00:00:00.000Z" },
  });
  assert.equal(success.headers.get("Cache-Control"), "no-store");
  assert.equal(success.headers.get("X-Content-Type-Options"), "nosniff");
});

test("network API maps invalid methods, content types, fields, and upstream failures safely", async () => {
  const noProvider = await handleRdapRequest(new Request("https://tools.godeskhub.com/api/network/ip-rdap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip: "8.8.8.8" }),
  }));
  assert.equal(noProvider.status, 503);
  assert.equal((await noProvider.json()).error.code, "CONFIGURATION_ERROR");

  const extra = await handleRdapRequest(new Request("https://tools.godeskhub.com/api/network/ip-rdap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip: "8.8.8.8", url: "https://example.com" }),
  }), { provider: { lookup: async () => ({ ok: true, data: {}, source: "mock" }) } });
  assert.equal(extra.status, 400);
  assert.equal((await extra.json()).error.code, "INVALID_REQUEST");

  const contentType = await handleRdapRequest(new Request("https://tools.godeskhub.com/api/network/ip-rdap", {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: "8.8.8.8",
  }), { provider: { lookup: async () => ({ ok: true, data: {}, source: "mock" }) } });
  assert.equal(contentType.status, 415);
  assert.equal((await contentType.json()).error.code, "INVALID_CONTENT_TYPE");

  const upstream = await handleRdapRequest(new Request("https://tools.godeskhub.com/api/network/ip-rdap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ip: "8.8.8.8" }),
  }), { provider: { lookup: async () => ({ ok: false, code: "RATE_LIMITED", retryable: true, status: 429 }) } });
  assert.equal(upstream.status, 429);
  assert.deepEqual(await upstream.json(), {
    ok: false,
    error: { code: "RATE_LIMITED", message: "RATE_LIMITED", retryable: true },
  });
});
