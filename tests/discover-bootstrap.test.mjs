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

test("discover bootstrap consumes the shared Catalog without Tailwind or shadcn setup", async () => {
  const app = await readFile(new URL("../apps/discover/src/App.tsx", import.meta.url), "utf8");
  assert.match(app, /catalog\.normalized\.v1\.mjs/);
  assert.match(app, /godeskhub\.com/);
  assert.doesNotMatch(app, /tools\.godeskhub\.com/);

  const packageJson = await readFile(new URL("../package.json", import.meta.url), "utf8");
  assert.doesNotMatch(packageJson, /tailwindcss|@tailwindcss|shadcn|class-variance-authority|tailwind-merge/);
});
