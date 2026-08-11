import { TOOLS } from "./registry.js";

const COMPONENT_BY_KIND = {
  unit: "UnitTool",
  json: "JsonTool",
  base64: "Base64Tool",
  url: "UrlTool",
  uuid: "UuidTool",
  timestamp: "TimestampTool",
  case: "CaseTool",
  text: "TextTool",
  color: "ColorTool",
  calculator: "CalculatorTool",
  qr: "QrTool",
  irr: "IrrTool",
  cheque: "ChequeTool",
  password: "PasswordTool",
  "ipv4-network": "Ipv4NetworkToolbox",
  "ipv6-toolbox": "Ipv6Toolbox",
  "ip-info": "IpInfoTool",
};

const publishedToolBindings = TOOLS.map(tool => ({
  toolBindingId: tool.slug,
  registryToolId: tool.id,
  canonicalSlug: tool.slug,
  kind: tool.kind,
  categoryId: tool.category,
  icon: tool.icon,
  publicationState: "published",
  componentKey: COMPONENT_BY_KIND[tool.kind] ?? tool.kind,
}));

const hiddenToolBindings = [
  {
    toolBindingId: "ip-info",
    registryToolId: "ip-info",
    canonicalSlug: "ip-info-lookup",
    kind: "ip-info",
    categoryId: "network-ip",
    icon: "hash",
    publicationState: "hidden",
    componentKey: "IpInfoTool",
  },
  {
    toolBindingId: "ip-rdap",
    registryToolId: "ip-rdap",
    canonicalSlug: "ip-whois-rdap",
    kind: "ip-info",
    categoryId: "network-ip",
    icon: "hash",
    publicationState: "hidden",
    componentKey: "IpInfoTool",
  },
];

export const TOOL_CODE_BINDINGS = Object.freeze([
  ...publishedToolBindings,
  ...hiddenToolBindings,
]);

function sortBindings(bindings) {
  return [...bindings].sort((left, right) => left.toolBindingId.localeCompare(right.toolBindingId, "en"));
}

export function listToolCodeBindings() {
  return sortBindings(TOOL_CODE_BINDINGS);
}

export function listPublishedToolCodeBindings() {
  return sortBindings(TOOL_CODE_BINDINGS.filter(binding => binding.publicationState === "published"));
}

export function createToolBindingResolver(bindings = TOOL_CODE_BINDINGS) {
  const byBindingId = new Map();
  for (const binding of bindings) {
    const existing = byBindingId.get(binding.toolBindingId);
    if (existing) {
      throw new Error(`duplicate tool binding: ${binding.toolBindingId}`);
    }
    byBindingId.set(binding.toolBindingId, binding);
  }

  return {
    hasToolBinding(toolBindingId) {
      return byBindingId.has(toolBindingId);
    },
    resolveToolBinding(toolBindingId) {
      return byBindingId.get(toolBindingId) ?? null;
    },
    listToolBindings() {
      return sortBindings(byBindingId.values());
    },
  };
}

const defaultResolver = createToolBindingResolver(TOOL_CODE_BINDINGS);

export function resolveToolBinding(toolBindingId) {
  return defaultResolver.resolveToolBinding(toolBindingId);
}
