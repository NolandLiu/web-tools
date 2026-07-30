/* global AbortSignal, fetch */

const TIMEOUT_MS = 5000;

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
