import { resolve } from "node:path";
import { inspect } from "node:util";

import {
  loadCatalog,
  validateCatalogGraph,
} from "../packages/catalog-schema/dist/index.js";
import { createToolBindingResolver, listToolCodeBindings } from "../src/tool-bindings.js";

function printUsage() {
  console.error("Usage: npm run catalog:validate -- [--root <catalog-directory>]");
}

function parseArgs(args) {
  let rootDir = "catalog";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--root") {
      const value = args[index + 1];
      if (!value) return null;
      rootDir = value;
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    return null;
  }

  return { rootDir: resolve(rootDir) };
}

function sortDiagnostics(diagnostics) {
  return [...diagnostics].sort((left, right) => {
    const sourceOrder = left.sourcePath.localeCompare(right.sourcePath, "en");
    if (sourceOrder !== 0) return sourceOrder;
    const pathOrder = left.path.localeCompare(right.path, "en");
    if (pathOrder !== 0) return pathOrder;
    return left.code.localeCompare(right.code, "en");
  });
}

function diagnosticLine(diagnostic) {
  return `${diagnostic.code}\t${diagnostic.sourcePath}\t${diagnostic.path}\t${diagnostic.message}`;
}

const options = parseArgs(process.argv.slice(2));
if (!options) {
  printUsage();
  process.exit(2);
}

try {
  const resolver = createToolBindingResolver(listToolCodeBindings());
  const catalog = await loadCatalog({ rootDir: options.rootDir });
  const graphDiagnostics = catalog.ok
    ? validateCatalogGraph(catalog, { toolBindingResolver: resolver })
    : [];
  const diagnostics = [...catalog.diagnostics, ...graphDiagnostics];

  if (diagnostics.length === 0) {
    console.log("Catalog validation passed");
    process.exit(0);
  }

  for (const diagnostic of sortDiagnostics(diagnostics)) {
    console.error(diagnosticLine(diagnostic));
  }
  process.exit(1);
} catch (error) {
  console.error(`catalog-validation-error\t.\t$\t${error instanceof Error ? error.message : inspect(error)}`);
  process.exit(1);
}
