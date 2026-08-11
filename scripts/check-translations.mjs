import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import catalogArtifact from "../catalog/artifacts/catalog.normalized.v1.mjs";
import { validateTranslationCompleteness } from "../src/lib/catalog-localization.js";

function printUsage() {
  console.error("Usage: node scripts/check-translations.mjs [--artifact <catalog-artifact-json>]");
}

function parseArgs(args) {
  let artifact = null;
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--artifact") {
      const value = args[index + 1];
      if (!value) return null;
      artifact = value;
      index += 1;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }
    return null;
  }
  return { artifact };
}

const options = parseArgs(process.argv.slice(2));
if (!options) {
  printUsage();
  process.exit(2);
}

const artifact = options.artifact
  ? JSON.parse(await readFile(resolve(options.artifact), "utf8"))
  : catalogArtifact;
const result = validateTranslationCompleteness(artifact);

if (result.ok) {
  console.log("Translation completeness passed");
  process.exit(0);
}

for (const diagnostic of result.diagnostics) {
  console.error([
    diagnostic.code,
    diagnostic.resourceId,
    diagnostic.locale,
    diagnostic.field,
    diagnostic.severity,
  ].join("\t"));
}
process.exit(1);
