import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("discover app has an independent Vite boundary and build output", async () => {
  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  assert.equal(packageJson.scripts["discover:build"], "vite build --config apps/discover/vite.config.ts");
  assert.equal(packageJson.scripts["discover:verify"], "node apps/discover/scripts/verify-discover-build.mjs");

  const viteConfig = await readFile(new URL("../apps/discover/vite.config.ts", import.meta.url), "utf8");
  assert.match(viteConfig, /outDir:\s*["']\.\.\/\.\.\/dist-discover["']/);
  assert.doesNotMatch(viteConfig, /outDir:\s*["']dist["']/);

  const index = await readFile(new URL("../apps/discover/index.html", import.meta.url), "utf8");
  assert.match(index, /id="discover-root"/);
  assert.match(index, /src="\/src\/main\.tsx"/);
});

test("discover bootstrap consumes the shared Catalog with a token-driven UI system", async () => {
  const app = await readFile(new URL("../apps/discover/src/App.tsx", import.meta.url), "utf8");
  assert.match(app, /catalog\.normalized\.v1\.mjs/);
  assert.match(app, /godeskhub\.com/);
  assert.doesNotMatch(app, /tools\.godeskhub\.com/);

  const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
  for (const dependency of [
    "@tailwindcss/vite",
    "@radix-ui/react-slot",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "tailwindcss",
  ]) {
    assert.ok(
      packageJson.dependencies[dependency] || packageJson.devDependencies[dependency],
      `expected ${dependency} to be installed for the Discover UI system`,
    );
  }

  const viteConfig = await readFile(new URL("../apps/discover/vite.config.ts", import.meta.url), "utf8");
  assert.match(viteConfig, /@tailwindcss\/vite/);
  assert.match(viteConfig, /tailwindcss\(\)/);

  const styles = await readFile(new URL("../apps/discover/src/styles.css", import.meta.url), "utf8");
  assert.match(styles, /@import\s+["']tailwindcss["']/);
  assert.match(styles, /@theme/);
  for (const token of [
    "--color-discover-background",
    "--color-discover-surface",
    "--color-discover-forest",
    "--color-discover-mint",
    "--color-discover-cta",
    "--color-discover-footer",
    "--shadow-discover-card",
  ]) {
    assert.match(styles, new RegExp(token), `expected semantic theme token ${token}`);
  }

  for (const component of [
    "lib/utils.ts",
    "components/ui/button.tsx",
    "components/ui/card.tsx",
    "components/ui/badge.tsx",
    "components/ui/input.tsx",
  ]) {
    await readFile(new URL(`../apps/discover/src/${component}`, import.meta.url), "utf8");
  }
});
