#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hiveDir = path.join(repoRoot, ".visual-hive");

const handoff = await readJson("handoff.json");
const issue = await readText("hive-issue.md");
const evidence = await readJson("evidence-packet.json");
const testCreation = await readJson("test-creation-plan.json");

assert(handoff.externalCallsMade === 0, "Handoff packet must remain no-network.");
assert(issue.includes("<!-- visual-hive-handoff") || issue.includes("<!-- visual-hive-hive-handoff") || /Dedupe fingerprint:/i.test(issue), "Hive issue body must include a dedupe marker/fingerprint.");
assert(issue.includes("Evidence Packet") || issue.includes("evidence-packet.json"), "Issue body must reference Evidence Packet path.");
assert(issue.includes("repo-map.json") || issue.includes("Repo context"), "Issue body must include repo map or repo context evidence.");
assert(issue.includes("test-creation-plan") || JSON.stringify(testCreation).includes("recommendations"), "Issue body or test plan must include test creation context.");
assert(/screenshot|diff|artifact/i.test(issue), "Issue body must include screenshot/diff/artifact evidence.");
assert(/mutation/i.test(issue) || JSON.stringify(evidence).includes("mutation"), "Issue body or Evidence Packet must include mutation evidence.");
assert(/do not|never|guardrail|threshold|baseline/i.test(issue), "Issue body must include guardrail language.");

const scenarios = [
  simulateIssueDecision({ name: "no_existing_issue", existingIssues: [] }),
  simulateIssueDecision({
    name: "existing_issue_found",
    existingIssues: [{ number: 42, body: issue }]
  }),
  simulateIssueDecision({
    name: "blocked_artifacts",
    existingIssues: [],
    forcedBlockingReasons: ["Synthetic blocked-artifact proof: trusted workflow must not create or update issues from blocked evidence."]
  })
];

const report = {
  schemaVersion: "visual-hive.external-hive-issue-dry-run.v1",
  generatedAt: new Date().toISOString(),
  project: "visual-hive-demo-site",
  networkCallsMade: 0,
  realGithubIssuesCreated: 0,
  scenarios,
  blocked: scenarios.some((scenario) => scenario.blocked)
};

const blockedScenario = scenarios.find((scenario) => scenario.name === "blocked_artifacts");
assert(blockedScenario?.decision === "blocked", "Blocked artifact scenario must be blocked.");
assert(blockedScenario?.wouldCreateOrUpdate === false, "Blocked artifact scenario must not create or update.");
assert(scenarios.find((scenario) => scenario.name === "no_existing_issue")?.decision === "create", "No-existing issue scenario must simulate create.");
assert(scenarios.find((scenario) => scenario.name === "existing_issue_found")?.decision === "update", "Existing issue scenario must simulate update.");

await writeFile(path.join(hiveDir, "hive-issue-dry-run.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log("Visual Hive issue handoff dry-run passed: .visual-hive/hive-issue-dry-run.json");

function simulateIssueDecision({ name, existingIssues, forcedBlockingReasons = [] }) {
  const marker = issue.includes("<!-- visual-hive-hive-handoff") ? "<!-- visual-hive-hive-handoff" : "<!-- visual-hive-handoff";
  const fingerprintMatch = issue.match(/visual-hive[- ](?:dedupe|fingerprint)[^\n<]*/i);
  const fingerprint = fingerprintMatch?.[0] ?? marker;
  const existing = existingIssues.find((item) => String(item.body ?? "").includes(marker) || String(item.body ?? "").includes(fingerprint));
  const blockingReasons = forcedBlockingReasons;
  const decision = blockingReasons.length ? "blocked" : existing ? "update" : "create";
  return {
    name,
    decision,
    wouldCreateOrUpdate: decision === "create" || decision === "update",
    existingIssueNumber: existing?.number,
    blocked: decision === "blocked",
    blockingReasons
  };
}

async function readJson(relativePath) {
  return JSON.parse(await readText(relativePath));
}

async function readText(relativePath) {
  return readFile(path.join(hiveDir, relativePath), "utf8");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
