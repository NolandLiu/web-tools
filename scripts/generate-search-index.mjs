import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import catalogArtifact from "../catalog/artifacts/catalog.normalized.v1.mjs";
import {
  assertSearchIndexSizeBudget,
  buildLocalizedSearchIndex,
  buildSearchDocuments,
} from "../src/lib/search-index-core.js";
import { TOOLS_FRONTEND_POLICY } from "../src/lib/catalog-seo.js";

const outputPath = resolve("catalog/artifacts/search-index.v1.json");
const moduleOutputPath = resolve("catalog/artifacts/search-index.v1.mjs");

const documents = buildSearchDocuments(catalogArtifact, {
  frontendPolicy: TOOLS_FRONTEND_POLICY,
});
const index = buildLocalizedSearchIndex(documents);
const size = assertSearchIndexSizeBudget(index);

if (!size.ok) {
  console.error(`Search index gzip size ${size.gzipBytes} exceeds budget ${size.budget}`);
  process.exit(1);
}

const serialized = `${JSON.stringify(index, null, 2)}\n`;
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, serialized, "utf8");
await writeFile(moduleOutputPath, `export default ${serialized};\n`, "utf8");
console.log(`Wrote ${outputPath}`);
console.log(`Wrote ${moduleOutputPath}`);
