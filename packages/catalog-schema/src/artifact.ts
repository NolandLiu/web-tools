import { createHash } from "node:crypto";

import { CATALOG_SCHEMA_VERSION } from "./version.js";
import type { LoadedCatalog, LoadedCatalogRecords } from "./loader.js";

export const CATALOG_ARTIFACT_VERSION = "catalog.normalized.v1" as const;

export interface NormalizedCatalogArtifactPayload {
  artifactVersion: typeof CATALOG_ARTIFACT_VERSION;
  catalogSchemaVersion: typeof CATALOG_SCHEMA_VERSION;
  records: LoadedCatalogRecords;
}

export interface NormalizedCatalogArtifact extends NormalizedCatalogArtifactPayload {
  checksum: string;
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right, "en"));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`).join(",")}}`;
  }

  return JSON.stringify(value);
}

function checksumPayload(payload: NormalizedCatalogArtifactPayload): string {
  return `sha256-${createHash("sha256").update(stableStringify(payload)).digest("hex")}`;
}

export function buildNormalizedCatalogArtifact(catalog: LoadedCatalog): NormalizedCatalogArtifact {
  if (!catalog.ok) {
    throw new Error("cannot build Catalog artifact from invalid loaded Catalog");
  }

  const payload: NormalizedCatalogArtifactPayload = {
    artifactVersion: CATALOG_ARTIFACT_VERSION,
    catalogSchemaVersion: CATALOG_SCHEMA_VERSION,
    records: catalog.records,
  };

  return {
    ...payload,
    checksum: checksumPayload(payload),
  };
}

export function serializeCatalogArtifact(artifact: NormalizedCatalogArtifact): string {
  return `${JSON.stringify(artifact, null, 2)}\n`;
}

export function parseCatalogArtifact(value: unknown): NormalizedCatalogArtifact {
  if (!value || typeof value !== "object") {
    throw new Error("Catalog artifact must be an object");
  }

  const artifact = value as Partial<NormalizedCatalogArtifact>;
  if (artifact.artifactVersion !== CATALOG_ARTIFACT_VERSION) {
    throw new Error(`unsupported Catalog artifact version: ${String(artifact.artifactVersion)}`);
  }

  if (artifact.catalogSchemaVersion !== CATALOG_SCHEMA_VERSION) {
    throw new Error(`unsupported Catalog schema version: ${String(artifact.catalogSchemaVersion)}`);
  }

  if (!artifact.records || typeof artifact.records !== "object") {
    throw new Error("Catalog artifact records are required");
  }

  const { checksum: _checksum, ...payload } = artifact as NormalizedCatalogArtifact;
  const expectedChecksum = checksumPayload(payload);
  if (artifact.checksum !== expectedChecksum) {
    throw new Error("Catalog artifact checksum mismatch");
  }

  return artifact as NormalizedCatalogArtifact;
}
