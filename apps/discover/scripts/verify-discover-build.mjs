import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const requiredPages = [
  "dist-discover/index.html",
  "dist-discover/en/index.html",
  "dist-discover/zh-cn/index.html",
  "dist-discover/zh-tw/index.html",
  "dist-discover/en/tools/index.html",
  "dist-discover/en/categories/network-ip/index.html",
  "dist-discover/en/resources/tool/ipv4-network-toolbox/index.html",
];

for (const page of requiredPages) {
  const html = await readFile(resolve(page), "utf8");
  for (const expected of ["godeskhub.com", "GoDeskHub", "canonical", "hreflang", "application/ld+json"]) {
    if (!html.includes(expected)) {
      console.error(`${page} is missing ${expected}`);
      process.exit(1);
    }
  }
  if (html.includes("noindex")) {
    console.error(`${page} should not contain noindex after Discover static generation.`);
    process.exit(1);
  }
  if (/raw query|search query|工具输入|tool input value/i.test(html)) {
    console.error(`${page} contains raw query or user-input wording in static metadata.`);
    process.exit(1);
  }
}

const home = await readFile(resolve("dist-discover/en/index.html"), "utf8");
for (const expected of ["Find the right tool", "Featured picks", "Browse by category", "Recently added"]) {
  if (!home.includes(expected)) {
    console.error(`Discover homepage raw HTML is missing ${expected}`);
    process.exit(1);
  }
}

console.log("Verified Discover static HTML, SEO metadata, and privacy boundaries.");
