import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import {
  buildNormalizedCatalogArtifact,
  loadCatalog,
  serializeCatalogArtifact,
  validateCatalogGraph,
} from "../packages/catalog-schema/dist/index.js";
import { createToolBindingResolver, listToolCodeBindings } from "../src/tool-bindings.js";

const catalogRoot = resolve("catalog");
const outputPath = resolve("catalog/artifacts/catalog.normalized.v1.json");
const toolBindingResolver = createToolBindingResolver(listToolCodeBindings());

const catalog = await loadCatalog({ rootDir: catalogRoot });
const graphDiagnostics = catalog.ok
  ? validateCatalogGraph(catalog, { toolBindingResolver })
  : [];
const diagnostics = [...catalog.diagnostics, ...graphDiagnostics];

if (diagnostics.length > 0) {
  for (const diagnostic of diagnostics) {
    console.error(`${diagnostic.code}\t${diagnostic.sourcePath}\t${diagnostic.path}\t${diagnostic.message}`);
  }
  process.exit(1);
}

const artifact = buildNormalizedCatalogArtifact(catalog);
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, serializeCatalogArtifact(artifact), "utf8");
console.log(`Wrote ${outputPath}`);
