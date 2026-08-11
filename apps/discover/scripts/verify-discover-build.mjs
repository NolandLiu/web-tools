import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const html = await readFile(resolve("dist-discover/index.html"), "utf8");

for (const expected of ["GoDeskHub Discover", "godeskhub.com", "Shared Catalog artifact"]) {
  if (!html.includes(expected)) {
    console.error(`dist-discover/index.html is missing ${expected}`);
    process.exit(1);
  }
}

if (html.includes("tools.godeskhub.com")) {
  console.error("Discover bootstrap should not use the Tools origin as its page identity.");
  process.exit(1);
}

console.log("Verified Discover bootstrap build.");
