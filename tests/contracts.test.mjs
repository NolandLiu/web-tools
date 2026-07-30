import assert from "node:assert/strict";
import test from "node:test";
import { TOOLS } from "../src/registry.js";

let contractsModule;
try {
  contractsModule = await import("../src/lib/tool-contracts.js");
} catch {
  contractsModule = null;
}

test("every registered tool has one enforceable behavior contract", () => {
  assert.ok(contractsModule, "tool contract module must exist");

  const { TOOL_CONTRACTS, validateToolContracts } = contractsModule;
  const registeredIds = TOOLS.map(tool => tool.id).sort();
  const contractIds = Object.keys(TOOL_CONTRACTS).sort();

  assert.deepEqual(contractIds, registeredIds);
  assert.deepEqual(validateToolContracts(), {
    toolCount: TOOLS.length,
    normalCases: TOOLS.length,
    boundaryCases: TOOLS.length,
    invalidCases: TOOLS.length,
  });
});

test("phase four contracts cover the approved financial and generator tools", () => {
  assert.ok(contractsModule, "tool contract module must exist");
  for (const id of ["irr", "cheque", "password", "qr"]) {
    assert.ok(contractsModule.TOOL_CONTRACTS[id], `missing Phase 4 contract for ${id}`);
  }
  assert.equal(contractsModule.TOOL_CONTRACTS.irr.operation, "solveFixedPeriodIrr");
  assert.equal(contractsModule.TOOL_CONTRACTS.cheque.operation, "formatChequeAmount");
  assert.equal(contractsModule.TOOL_CONTRACTS.password.operation, "generatePasswords");
  assert.deepEqual(contractsModule.TOOL_CONTRACTS.password.privacy.persistentFields, []);
});

test("contracts define executable behavior, privacy, and accessibility boundaries", () => {
  assert.ok(contractsModule, "tool contract module must exist");

  for (const tool of TOOLS) {
    const contract = contractsModule.TOOL_CONTRACTS[tool.id];
    assert.equal(contract.id, tool.id);
    assert.equal(contract.slug, tool.slug);
    assert.equal(contract.category, tool.category);
    assert.ok(contract.operation);
    assert.ok(contract.inputs.length >= 1);
    assert.ok(contract.inputs.every(input => (
      input.id
      && input.type
      && input.format
      && input.emptyBehavior === "empty"
      && input.editingBehavior === "editing"
      && input.invalidBehavior === "invalid"
    )));
    assert.ok(contract.rule);
    assert.ok(contract.precision.strategy);
    assert.ok(contract.output.format);
    assert.ok(contract.limitations.length >= 1);
    assert.ok(contract.cases.normal.length >= 1);
    assert.ok(contract.cases.boundary.length >= 1);
    assert.ok(contract.cases.invalid.length >= 1);
    assert.ok(contract.invariants.length >= 1);
    assert.equal(contract.privacy.network, ["ip-lookup", "ip-rdap"].includes(tool.id));
    assert.deepEqual(contract.privacy.urlFields, []);
    assert.deepEqual(contract.privacy.persistentFields, []);
    assert.ok(["none", "user-only"].includes(contract.privacy.clipboard));
    assert.ok(["none", "user-only"].includes(contract.privacy.download));
    assert.equal(contract.accessibility.keyboard, true);
    assert.equal(contract.accessibility.labeledInputs, true);
    assert.equal(contract.accessibility.resultStatus, true);
    assert.match(contract.testFile, /^tests\/.+\.test\.mjs$/);
  }
});

test("contract validation rejects missing and mismatched records", () => {
  assert.ok(contractsModule, "tool contract module must exist");

  const { TOOL_CONTRACTS, validateToolContracts } = contractsModule;
  const withoutQr = { ...TOOL_CONTRACTS };
  delete withoutQr.qr;
  assert.throws(
    () => validateToolContracts(TOOLS, withoutQr),
    /missing contract for qr/,
  );
  assert.throws(
    () => validateToolContracts(
      TOOLS,
      { ...TOOL_CONTRACTS, length: { ...TOOL_CONTRACTS.length, slug: "wrong" } },
    ),
    /slug mismatch for length/,
  );
});

test("risk-specific contract boundaries match the enforced implementation", () => {
  assert.deepEqual(contractsModule.TOOL_CONTRACTS.bmi.cases.boundary[0], {
    input: { weightKg: 18.5, heightCm: 100 },
    expectedCategory: "healthy",
  });
  assert.equal(contractsModule.TOOL_CONTRACTS.bmi.inputs[0].range, "greater than zero through 1000 kg");
  assert.equal(contractsModule.TOOL_CONTRACTS.bmi.inputs[1].range, "greater than zero through 300 cm");
  assert.equal(contractsModule.TOOL_CONTRACTS.qr.cases.boundary[0].input, "界".repeat(400));
  assert.match(contractsModule.TOOL_CONTRACTS.qr.limitations.join(" "), /1,200 UTF-8 bytes/);
});
