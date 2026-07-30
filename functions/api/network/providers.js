/* global AbortSignal, Request, Response, caches, fetch */

const TIMEOUT_MS = 5000;
const RDAP_CACHE_TTL_SECONDS = 86400;

function requestOptions(accept) {
  const options = { headers: { Accept: accept } };
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    options.signal = AbortSignal.timeout(TIMEOUT_MS);
  }
  return options;
}

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function mapUpstreamStatus(status) {
  if (status === 429) return { code: "RATE_LIMITED", retryable: true, status: 429 };
  if (status === 408 || status === 504) return { code: "UPSTREAM_TIMEOUT", retryable: true, status: 504 };
  if (status >= 500) return { code: "UPSTREAM_UNAVAILABLE", retryable: true, status: 502 };
  return { code: "UPSTREAM_UNAVAILABLE", retryable: false, status: 502 };
}

const valueOrNull = value => value === undefined || value === "" ? null : value;
const numberOrNull = value => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function firstNumber(...values) {
  for (const value of values) {
    const parsed = numberOrNull(value);
    if (parsed !== null) return parsed;
  }
  return null;
}

function versionFromIp(ip) {
  return typeof ip === "string" && ip.includes(":") ? "IPv6" : "IPv4";
}

export function createCloudflareCurrentIpProvider(request) {
  return {
    async lookup() {
      const ip = request.headers.get("CF-Connecting-IP");
      if (!ip) return { ok: false, code: "UPSTREAM_UNAVAILABLE", retryable: true, status: 502 };
      const cf = request.cf && typeof request.cf === "object" ? request.cf : {};
      return {
        ok: true,
        source: "cloudflare-request-cf",
        data: {
          ip,
          version: versionFromIp(ip),
          country: valueOrNull(cf.country),
          countryCode: valueOrNull(cf.country),
          region: valueOrNull(cf.region),
          city: valueOrNull(cf.city),
          latitude: numberOrNull(cf.latitude),
          longitude: numberOrNull(cf.longitude),
          asn: numberOrNull(cf.asn),
          organization: valueOrNull(cf.asOrganization),
          isp: valueOrNull(cf.asOrganization),
          domain: null,
        },
      };
    },
  };
}

export function createIpWhoIsProvider() {
  return {
    async lookup(input) {
      const url = `https://ipwho.is/${encodeURIComponent(input.ip)}`;
      let response;
      try {
        response = await fetch(url, requestOptions("application/json"));
      } catch {
        return { ok: false, code: "UPSTREAM_UNAVAILABLE", retryable: true, status: 502 };
      }
      if (!response.ok) return { ok: false, ...mapUpstreamStatus(response.status) };

      const data = await readJsonResponse(response);
      if (!data || typeof data !== "object") {
        return { ok: false, code: "UPSTREAM_INVALID_RESPONSE", retryable: false, status: 502 };
      }
      if (data.success === false) {
        const message = typeof data.message === "string" ? data.message.toLowerCase() : "";
        if (message.includes("rate limit")) return { ok: false, code: "RATE_LIMITED", retryable: true, status: 429 };
        return { ok: false, code: "UPSTREAM_UNAVAILABLE", retryable: false, status: 502 };
      }

      const connection = data.connection && typeof data.connection === "object" ? data.connection : {};
      return {
        ok: true,
        source: "ipwho.is",
        data: {
          ip: data.ip,
          version: data.type,
          country: data.country ?? null,
          countryCode: data.country_code ?? null,
          region: data.region ?? null,
          city: data.city ?? null,
          latitude: typeof data.latitude === "number" ? data.latitude : null,
          longitude: typeof data.longitude === "number" ? data.longitude : null,
          asn: typeof connection.asn === "number" ? connection.asn : null,
          organization: connection.org ?? null,
          isp: connection.isp ?? null,
          domain: connection.domain ?? null,
        },
      };
    },
  };
}

export function createFreeIpApiProvider() {
  return {
    async lookup(input) {
      const url = `https://free.freeipapi.com/api/json/${encodeURIComponent(input.ip)}`;
      let response;
      try {
        response = await fetch(url, requestOptions("application/json"));
      } catch {
        return { ok: false, code: "UPSTREAM_UNAVAILABLE", retryable: true, status: 502 };
      }
      if (!response.ok) return { ok: false, ...mapUpstreamStatus(response.status) };

      const data = await readJsonResponse(response);
      if (!data || typeof data !== "object") {
        return { ok: false, code: "UPSTREAM_INVALID_RESPONSE", retryable: false, status: 502 };
      }
      const ip = firstString(data.ipAddress, data.ip, data.query);
      if (!ip) return { ok: false, code: "UPSTREAM_INVALID_RESPONSE", retryable: false, status: 502 };
      return {
        ok: true,
        source: "freeipapi.com",
        data: {
          ip,
          version: data.ipVersion === 6 ? "IPv6" : "IPv4",
          country: firstString(data.countryName, data.country),
          countryCode: firstString(data.countryCode, data.country_code),
          region: firstString(data.regionName, data.region),
          city: firstString(data.cityName, data.city),
          latitude: firstNumber(data.latitude),
          longitude: firstNumber(data.longitude),
          asn: firstNumber(data.asn),
          organization: firstString(data.asnOrganization, data.organization, data.isp),
          isp: firstString(data.asnOrganization, data.organization, data.isp),
          domain: null,
        },
      };
    },
  };
}

export function createFallbackIpLookupProvider(providers = [createIpWhoIsProvider(), createFreeIpApiProvider()]) {
  return {
    async lookup(input) {
      const failures = [];
      for (const provider of providers) {
        const result = await provider.lookup(input);
        if (result.ok) return result;
        failures.push(result);
      }
      const nonRateLimited = failures.find(item => item.code !== "RATE_LIMITED");
      if (!nonRateLimited && failures.length > 0) return { ok: false, code: "RATE_LIMITED", retryable: true, status: 429 };
      const retryable = failures.some(item => item.retryable);
      return {
        ok: false,
        code: nonRateLimited?.code ?? "ALL_PROVIDERS_FAILED",
        retryable,
        status: nonRateLimited?.status ?? 502,
      };
    },
  };
}

export function createRdapOrgProvider() {
  return {
    async lookup(input) {
      const url = `https://rdap.org/ip/${encodeURIComponent(input.ip)}`;
      let response;
      try {
        response = await fetch(url, requestOptions("application/rdap+json, application/json"));
      } catch {
        return { ok: false, code: "UPSTREAM_UNAVAILABLE", retryable: true, status: 502 };
      }
      if (!response.ok) return { ok: false, ...mapUpstreamStatus(response.status) };

      const data = await readJsonResponse(response);
      if (!data || typeof data !== "object") {
        return { ok: false, code: "UPSTREAM_INVALID_RESPONSE", retryable: false, status: 502 };
      }
      return { ok: true, source: "rdap.org", data };
    },
  };
}

function rdapCacheRequest(input) {
  return new Request(`https://tools.godeskhub.com/__cache/rdap/ip/${encodeURIComponent(input.ip)}`, { method: "GET" });
}

async function readCachedRdap(cache, request) {
  try {
    const response = await cache.match(request);
    if (!response) return null;
    const body = await readJsonResponse(response);
    if (!body || typeof body !== "object" || !body.data || typeof body.data !== "object") return null;
    return {
      ok: true,
      source: body.source || "rdap.org",
      data: body.data,
      meta: { cache: "hit" },
    };
  } catch {
    return null;
  }
}

async function writeCachedRdap(cache, request, result) {
  try {
    const response = new Response(JSON.stringify({ source: result.source, data: result.data }), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": `public, max-age=${RDAP_CACHE_TTL_SECONDS}`,
      },
    });
    await cache.put(request, response);
  } catch {
    // Cache availability must not decide whether the user receives a successful RDAP response.
  }
}

export function createCachedRdapProvider(provider = createRdapOrgProvider(), cache = typeof caches !== "undefined" ? caches.default : null) {
  return {
    async lookup(input) {
      const request = rdapCacheRequest(input);
      if (cache) {
        const cached = await readCachedRdap(cache, request);
        if (cached) return cached;
      }
      const result = await provider.lookup(input);
      if (!result.ok) return result;
      if (cache) await writeCachedRdap(cache, request, result);
      return { ...result, meta: { ...(result.meta ?? {}), cache: cache ? "miss" : "unavailable" } };
    },
  };
}
