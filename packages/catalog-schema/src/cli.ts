import { resolve } from "node:path";
import { inspect } from "node:util";

import { loadCatalog } from "./loader.js";
import type { CatalogDiagnostic } from "./loader.js";

interface CliOptions {
  rootDir: string;
}

function printUsage(): void {
  console.error("Usage: catalog:validate [--root <catalog-directory>]");
}

function parseArgs(args: string[]): CliOptions | null {
  let rootDir = "catalog";

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--root") {
      const value = args[index + 1];
      if (!value) {
        return null;
      }
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

  return {
    rootDir: resolve(rootDir),
  };
}

function sortedDiagnostics(diagnostics: CatalogDiagnostic[]): CatalogDiagnostic[] {
  return [...diagnostics].sort((left, right) => {
    const sourceOrder = left.sourcePath.localeCompare(right.sourcePath, "en");
    if (sourceOrder !== 0) return sourceOrder;
    const pathOrder = left.path.localeCompare(right.path, "en");
    if (pathOrder !== 0) return pathOrder;
    return left.code.localeCompare(right.code, "en");
  });
}

function diagnosticLine(diagnostic: CatalogDiagnostic): string {
  return `${diagnostic.code}\t${diagnostic.sourcePath}\t${diagnostic.path}\t${diagnostic.message}`;
}

export async function runCatalogValidateCli(args = process.argv.slice(2)): Promise<number> {
  const options = parseArgs(args);
  if (!options) {
    printUsage();
    return 2;
  }

  try {
    const catalog = await loadCatalog({ rootDir: options.rootDir });
    if (catalog.ok) {
      console.log("Catalog validation passed");
      return 0;
    }

    for (const diagnostic of sortedDiagnostics(catalog.diagnostics)) {
      console.error(diagnosticLine(diagnostic));
    }
    return 1;
  } catch (error) {
    console.error(`catalog-validation-error\t.\t$\t${error instanceof Error ? error.message : inspect(error)}`);
    return 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const exitCode = await runCatalogValidateCli();
  process.exit(exitCode);
}
