import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";
import * as core from "../src/lib/core.js";

test("timestamp conversion uses an explicit integer unit and supports epoch boundaries", () => {
  assert.equal(core.timestampToDate("0", "seconds"), "1970-01-01T00:00:00.000Z");
  assert.equal(core.timestampToDate("0", "milliseconds"), "1970-01-01T00:00:00.000Z");
  assert.equal(core.timestampToDate("-1", "seconds"), "1969-12-31T23:59:59.000Z");
  assert.equal(core.timestampToDate("-1", "milliseconds"), "1969-12-31T23:59:59.999Z");
  assert.equal(core.timestampToDate("100000000000", "seconds"), "5138-11-16T09:46:40.000Z");
  assert.equal(core.timestampToDate("100000000000", "milliseconds"), "1973-03-03T09:46:40.000Z");
  assert.equal(core.timestampToDate("1.5", "seconds"), null);
  assert.equal(core.timestampToDate("NaN", "seconds"), null);
  assert.equal(core.timestampToDate("8640000000000000", "milliseconds"), "+275760-09-13T00:00:00.000Z");
  assert.equal(core.timestampToDate("8640000000000001", "milliseconds"), null);
  assert.equal(core.timestampToDate("1", "minutes"), null);
});

test("date-time conversion labels UTC and local interpretation explicitly", () => {
  assert.equal(
    core.dateToTimestamp("2024-01-01T00:00", "seconds", "utc"),
    1704067200,
  );
  assert.equal(
    core.dateToTimestamp("2024-01-01T00:00", "milliseconds", "utc"),
    1704067200000,
  );
  assert.equal(core.dateToTimestamp("2024-02-30T00:00", "seconds", "utc"), null);
  assert.equal(core.dateToTimestamp("", "seconds", "utc"), null);
  assert.equal(core.dateToTimestamp("2024-01-01", "seconds", "other"), null);
});

test("calendar date parsing rejects rollover and interval semantics cover leap years", () => {
  assert.equal(typeof core.parseCalendarDate, "function");
  assert.deepEqual(core.parseCalendarDate("2024-02-29"), {
    year: 2024,
    month: 2,
    day: 29,
    utcMs: 1709164800000,
  });
  for (const invalid of ["", "2024-2-01", "2023-02-29", "2024-02-30", "2024-13-01", "text"]) {
    assert.equal(core.parseCalendarDate(invalid), null, invalid);
  }
  assert.equal(core.dateInterval("2024-02-28", "2024-02-29"), 1);
  assert.equal(core.dateInterval("2024-02-29", "2024-03-01"), 1);
  assert.equal(core.dateInterval("2023-02-28", "2023-03-01"), 1);
  assert.equal(core.dateInterval("2023-12-31", "2024-01-01"), 1);
  assert.equal(core.dateInterval("2024-01-01", "2024-01-01"), 0);
  assert.equal(core.dateInterval("2024-03-01", "2024-02-28"), 2);
  assert.equal(core.dateInterval("2024-02-30", "2024-03-01"), null);
});

test("calendar day intervals are independent of DST and process timezone", () => {
  const moduleUrl = new URL("../src/lib/core.js", import.meta.url).href;
  const script = `import { dateInterval } from ${JSON.stringify(moduleUrl)}; process.stdout.write(String(dateInterval("2024-03-09", "2024-03-11")));`;
  const values = ["UTC", "America/New_York", "Asia/Hong_Kong"].map(TZ => (
    execFileSync(process.execPath, ["--input-type=module", "-e", script], {
      encoding: "utf8",
      env: { ...process.env, TZ },
    })
  ));
  assert.deepEqual(values, ["2", "2", "2"]);
});
