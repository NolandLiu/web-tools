import { resolve } from "node:path";
import { inspect } from "node:util";

import { loadCatalog } from "./loader.js";
import { validateCatalogGraph } from "./graph.js";

interface PrintableDiagnostic {
  code: string;
  sourcePath: string;
  path: string;
  message: string;
}

interface CliOptions {
  rootDir: string;
  toolBindings: Set<string>;
}

function printUsage(): void {
  console.error("Usage: catalog:validate [--root <catalog-directory>] [--tool-binding <tool-binding-id>]");
}

function parseArgs(args: string[]): CliOptions | null {
  let rootDir = "catalog";
  const toolBindings = new Set<string>();

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

    if (arg === "--tool-binding") {
      const value = args[index + 1];
      if (!value) {
        return null;
      }
      toolBindings.add(value);
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
    toolBindings,
  };
}

function sortedDiagnostics<T extends PrintableDiagnostic>(diagnostics: T[]): T[] {
  return [...diagnostics].sort((left, right) => {
    const sourceOrder = left.sourcePath.localeCompare(right.sourcePath, "en");
    if (sourceOrder !== 0) return sourceOrder;
    const pathOrder = left.path.localeCompare(right.path, "en");
    if (pathOrder !== 0) return pathOrder;
    return left.code.localeCompare(right.code, "en");
  });
}

function diagnosticLine(diagnostic: PrintableDiagnostic): string {
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
    const graphDiagnostics = catalog.ok
      ? validateCatalogGraph(catalog, {
        toolBindingResolver: {
          hasToolBinding: (toolBindingId) => options.toolBindings.has(toolBindingId),
        },
      })
      : [];
    const diagnostics = [...catalog.diagnostics, ...graphDiagnostics];
    if (diagnostics.length === 0) {
      console.log("Catalog validation passed");
      return 0;
    }

    for (const diagnostic of sortedDiagnostics(diagnostics)) {
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
