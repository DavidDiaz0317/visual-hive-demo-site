#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hiveDir = path.join(repoRoot, ".visual-hive");

const report = await readJson("mutation-report.json");
assert(report.schemaVersion === 2, `mutation-report.json schemaVersion must be 2, got ${report.schemaVersion}.`);

const results = Array.isArray(report.results) ? report.results : [];
assert(results.length > 0, "mutation-report.json must include at least one result.");

let killed = 0;
let survived = 0;
let notApplicable = 0;

for (const result of results) {
  const operator = typeof result.operator === "string" ? result.operator : result.operator?.id;
  assert(operator, "Each mutation result must include an operator.");
  assert(["killed", "survived", "not_applicable", "error"].includes(result.status), `Mutation ${operator} has invalid status ${result.status}.`);
  assert(Array.isArray(result.contractIds) || Array.isArray(result.selectedContracts), `Mutation ${operator} must include selected contract IDs.`);
  assert(Array.isArray(result.affectedSurfaces), `Mutation ${operator} must include affected surfaces.`);
  assert(typeof result.validationCommand === "string" && result.validationCommand.length > 0, `Mutation ${operator} must include validationCommand.`);
  assert(["runtime", "fixture"].includes(result.mutationMode), `Mutation ${operator} must use runtime or fixture mutation mode.`);
  assert(result.sourceMutation === false, `Mutation ${operator} must not mutate source files.`);
  if (result.status === "killed") killed += 1;
  if (result.status === "survived") survived += 1;
  if (result.status === "not_applicable") notApplicable += 1;
}

assert(counter(report, "killed") === killed, "Killed mutation count must match result statuses.");
assert(counter(report, "survived") === survived, "Survived mutation count must match result statuses.");
assert(counter(report, "notApplicable") === notApplicable, "Not-applicable mutation count must match result statuses.");

if (survived > 0) {
  const context = `${await readOptional("issue.md")}\n${await readOptional("test-creation-plan.md")}\n${JSON.stringify(await readOptionalJson("test-creation-plan.json"))}`;
  assert(/surviv|missing test|mutation/i.test(context), "Survived mutations must appear in issue or test-creation context.");
}

console.log(`Visual Hive mutation proof passed: ${killed} killed, ${survived} survived, ${notApplicable} not applicable.`);

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(hiveDir, relativePath), "utf8"));
}

async function readOptional(relativePath) {
  try {
    return await readFile(path.join(hiveDir, relativePath), "utf8");
  } catch {
    return "";
  }
}

async function readOptionalJson(relativePath) {
  try {
    return JSON.parse(await readFile(path.join(hiveDir, relativePath), "utf8"));
  } catch {
    return {};
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function counter(report, key) {
  const value = report.summary?.[key] ?? report[key];
  return typeof value === "number" ? value : 0;
}
