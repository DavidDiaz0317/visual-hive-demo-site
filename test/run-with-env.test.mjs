import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(
  new URL("../scripts/run-with-env.mjs", import.meta.url),
);

function run(args) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd: fileURLToPath(new URL("..", import.meta.url)),
    encoding: "utf8",
  });
}

test("forwards environment assignments to the command", () => {
  const result = run([
    "VH_UNIT_VALUE=unit-evidence",
    "--",
    "node",
    "-p",
    "process.env.VH_UNIT_VALUE",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "unit-evidence");
});

test("preserves equals signs in environment values", () => {
  const result = run([
    "VH_UNIT_VALUE=left=right",
    "--",
    "node",
    "-p",
    "process.env.VH_UNIT_VALUE",
  ]);

  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), "left=right");
});

test("rejects malformed environment assignments", () => {
  const result = run(["INVALID", "--", "node", "--version"]);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /Invalid env assignment/);
});

test("requires a command after the separator", () => {
  const result = run(["VH_UNIT_VALUE=value", "--"]);

  assert.equal(result.status, 2);
  assert.match(result.stderr, /Missing command after --/);
});
