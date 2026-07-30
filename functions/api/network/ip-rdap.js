/* global Response */

import { handleRdapRequest } from "../../../src/lib/network-ip.js";
import { createRdapOrgProvider } from "./providers.js";

export async function onRequestPost(context) {
  return handleRdapRequest(context.request, { provider: createRdapOrgProvider() });
}

export async function onRequest() {
  return new Response(JSON.stringify({ ok: false, error: { code: "INVALID_REQUEST", message: "INVALID_REQUEST", retryable: false } }), {
    status: 405,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
