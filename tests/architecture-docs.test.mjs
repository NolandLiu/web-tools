import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function readRepositoryText(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("migration strategy defines concrete batch gates and rollback evidence", async () => {
  const markdown = await readRepositoryText("docs/architecture/migration-strategy.md");

  for (const heading of [
    "## Source Of Truth By Stage",
    "## Migration Batch Contract",
    "## Entry Gates",
    "## Exit Gates",
    "## Rollback Gates",
    "## Snapshot And Retention Policy",
    "## Output Comparison Gates",
    "## Tabletop Rollback Exercise",
  ]) {
    assert.match(markdown, new RegExp(`^${heading}$`, "m"), `missing heading: ${heading}`);
  }

  for (const requiredText of [
    "Existing registries remain authoritative",
    "Git/YAML Catalog is authoritative",
    "CMS becomes authoritative",
    "repository-migration-inventory.json",
    "canonical routes",
    "hreflang",
    "Sitemap",
    "JSON-LD",
    "search documents",
    "behavior regression",
    "last stable Catalog artifact",
    "snapshot pointer",
    "restoration command",
    "no secrets",
    "no user tool input",
  ]) {
    assert.match(markdown, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `missing text: ${requiredText}`);
  }
});

test("Phase 0 planning marks ARCH-P0-008 complete with evidence", async () => {
  const backlog = await readRepositoryText("docs/planning/godeskhub-task-backlog.md");
  const roadmap = await readRepositoryText("docs/planning/godeskhub-platform-roadmap.md");

  assert.match(
    backlog,
    /## ARCH-P0-008[\s\S]*?### Status\nCompleted — Migration And Rollback Baseline Approved/,
  );
  assert.match(backlog, /## ARCH-P0-008[\s\S]*?docs\/architecture\/migration-strategy\.md/);
  assert.match(backlog, /## ARCH-P0-008[\s\S]*?- \[x\] Every migration batch has entry, exit, and rollback gates\./);
  assert.match(backlog, /## ARCH-P0-008[\s\S]*?- \[x\] One authoritative source is defined at each stage\./);

  assert.match(
    roadmap,
    /`ARCH-P0-008` — Approve the migration and rollback baseline\. \*\*Completed: migration batch, source-of-truth, snapshot, comparison, and rollback gates are defined\.\*\*/,
  );
});

test("Phase 2 pilot report documents compare-only ownership and rollback boundaries", async () => {
  const markdown = await readRepositoryText("docs/architecture/catalog-pilot-migration-report.md");

  for (const requiredText of [
    "TOOLS-P2-001",
    "TOOLS-P2-002",
    "TOOLS-P2-003",
    "compare-only",
    "existing registries remain production-authoritative",
    "ipv4-network-toolbox",
    "irr-calculator",
    "password-generator",
    "ip-info",
    "ip-rdap",
    "No user tool input",
    "rollback",
  ]) {
    assert.match(markdown, new RegExp(requiredText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `missing text: ${requiredText}`);
  }
});
