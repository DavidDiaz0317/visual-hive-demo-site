#!/usr/bin/env node
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { clearTimeout, setTimeout } from "node:timers";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hiveRoot = path.join(repoRoot, ".visual-hive");
const summaryPath = path.join(hiveRoot, "production-smoke-summary.json");

const steps = [
  ["build", ["npm", ["run", "build"], 180_000]],
  ["typecheck", ["npm", ["run", "typecheck"], 120_000]],
  ["doctor", ["npm", ["run", "vh:doctor"], 120_000]],
  ["analyze", ["npm", ["run", "vh:analyze"], 120_000]],
  ["graph-search", ["npm", ["run", "vh:graph:search"], 120_000]],
  ["graph-impact", ["npm", ["run", "vh:graph:impact"], 120_000]],
  ["plan", ["npm", ["run", "vh:plan"], 120_000]],
  ["run-seed", ["npm", ["run", "vh:run:seed"], 240_000]],
  ["run-ci", ["npm", ["run", "vh:run:ci"], 240_000]],
  ["mutate", ["npm", ["run", "vh:mutate"], 360_000]],
  ["mutation-proof", ["npm", ["run", "vh:mutation-proof"], 120_000]],
  ["triage", ["npm", ["run", "vh:triage"], 120_000]],
  ["evidence", ["npm", ["run", "vh:evidence"], 120_000]],
  ["issues", ["npm", ["run", "vh:issues"], 120_000]],
  ["issue-publish-dry-run", ["npm", ["run", "vh:issues:publish"], 120_000]],
  ["handoff", ["npm", ["run", "vh:handoff"], 120_000]],
  ["handoff-validate", ["npm", ["run", "vh:handoff-validate"], 120_000]],
  ["hive-export", ["npm", ["run", "vh:hive-export"], 120_000]],
  ["test-creation", ["npm", ["run", "vh:test-creation"], 120_000]],
  ["agent-packet", ["npm", ["run", "vh:agent-packet"], 120_000]],
  ["agent-issue", ["npm", ["run", "vh:agent:issue"], 180_000]],
  ["agent-write-preview", ["npm", ["run", "vh:agent:write-preview"], 120_000]],
  ["snapshot", ["npm", ["run", "vh:snapshot"], 120_000]],
  ["artifacts", ["npm", ["run", "vh:artifacts"], 120_000]],
  ["github-app-artifact-smoke", ["npm", ["run", "vh:github-app:artifact-smoke"], 180_000]],
  ["mcp", ["npm", ["run", "vh:mcp"], 120_000]],
  ["mcp-smoke", ["npm", ["run", "vh:mcp:smoke"], 180_000]],
  ["workflows", ["npm", ["run", "vh:workflows"], 120_000]]
];

await mkdir(hiveRoot, { recursive: true });
const results = [];
const startedAt = Date.now();
for (const [name, [command, args, timeoutMs]] of steps) {
  const stepStartedAt = Date.now();
  console.log(`[production-smoke] ${name}`);
  const result = await run(command, args, timeoutMs);
  results.push({ name, command: [command, ...args].join(" "), status: result.code === 0 ? "passed" : "failed", durationMs: Date.now() - stepStartedAt });
  if (result.code !== 0) {
    await writeSummary("FAIL", results, `${name} failed with exit code ${result.code}`);
    process.exit(result.code);
  }
}

const safety = await readSafetyCounters();
await writeSummary("PASS", results, undefined, safety);
console.log("[production-smoke] PASS");

function run(command, args, timeoutMs) {
  return new Promise((resolve) => {
    const executable = process.platform === "win32" && command === "npm" ? "cmd.exe" : command;
    const finalArgs = process.platform === "win32" && command === "npm" ? ["/d", "/s", "/c", command, ...args] : args;
    const child = spawn(executable, finalArgs, { cwd: repoRoot, stdio: "inherit", env: process.env });
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      resolve({ code: 124 });
    }, timeoutMs);
    child.on("error", () => {
      clearTimeout(timer);
      resolve({ code: 1 });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? 1 });
    });
  });
}

async function readSafetyCounters() {
  const summary = {
    externalCallsMade: 0,
    networkCallsMade: 0,
    realGithubIssuesCreated: 0,
    sourceMutations: 0,
    repairBranchesOrPrsCreated: 0
  };
  for (const file of [
    "external-full-run-summary.json",
    "issue-publish-dry-run.json",
    "hive-handoff-result.json",
    "github-app-artifact-smoke-summary.json",
    "mcp-smoke.json"
  ]) {
    try {
      const data = JSON.parse(await readFile(path.join(hiveRoot, file), "utf8"));
      summary.externalCallsMade += Number(data.externalCallsMade ?? data.metrics?.externalCallsMade ?? data.safety?.externalCallsMade ?? 0);
      summary.networkCallsMade += Number(data.networkCallsMade ?? data.metrics?.networkCallsMade ?? data.safety?.networkCallsMade ?? 0);
      summary.realGithubIssuesCreated += Number(data.realGithubIssuesCreated ?? data.metrics?.realGithubIssuesCreated ?? 0);
      summary.sourceMutations += Number(data.sourceMutations ?? data.metrics?.sourceMutations ?? 0);
      summary.repairBranchesOrPrsCreated += Number(data.repairBranchesOrPrsCreated ?? data.metrics?.repairBranchesOrPrsCreated ?? 0);
    } catch {
      // Artifact is optional for this aggregate.
    }
  }
  return summary;
}

async function writeSummary(status, sections, failureMessage, safety = undefined) {
  const summary = {
    schemaVersion: "visual-hive.production-smoke.v1",
    project: "visual-hive-demo-site",
    generatedAt: new Date().toISOString(),
    status,
    durationMs: Date.now() - startedAt,
    sections,
    ...(failureMessage ? { failureMessage } : {}),
    safety: safety ?? {
      externalCallsMade: 0,
      networkCallsMade: 0,
      realGithubIssuesCreated: 0,
      sourceMutations: 0,
      repairBranchesOrPrsCreated: 0
    }
  };
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
}
