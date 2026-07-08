#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hiveDir = path.join(repoRoot, ".visual-hive");
const summaryPath = path.join(hiveDir, "live-issue-loop-smoke.json");

if (!process.argv.includes("--verify-only")) {
  await runNpm("vh:live-detect", 1_500_000);
  await runNpm("vh:live-seeded-issues", 540_000);
  await runNpm("vh:hive-export", 120_000);
  await runNpm("vh:hive-beads", 120_000);
  await runNpm("vh:hive-validate", 120_000);
  await runNpm("vh:mcp", 120_000);
  await runNpm("vh:mcp:smoke", 180_000);
  await runNpm("vh:artifacts", 120_000);
  await runNpm("vh:path-scan", 120_000);
  await runNode(["scripts/visual-hive-live-seeded-issues.mjs", "--skip-defect-run"], 120_000);
}

const issues = await readJson("issues.json");
const live = await readJson("live-seeded-issues.json");
const pathScan = await readJson("path-leak-scan.json");
const workOrders = await readJson("hive/hive-agent-work-orders.json");
const mcp = await readJson("mcp-manifest.json");

const candidates = (issues.issues ?? []).filter((issue) => issue.status === "open_candidate" || issue.status === "update_candidate");
assert(candidates.length >= 3, `expected at least 3 active candidates, found ${candidates.length}`);
assert(live.seededFindings?.length >= 3, "live-seeded-issues.json must list at least 3 seeded findings.");
assert(pathScan.status === "passed", `path scan must pass, got ${pathScan.status}`);
assert(Array.isArray(workOrders.workOrders) && workOrders.workOrders.length >= 3, "Hive work orders must include live seeded repairs.");
assert(Array.isArray(mcp.resources) && Array.isArray(mcp.tools), "MCP manifest must expose resources and tools.");

const fingerprints = new Set();
const requiredBodyTokens = ["Dedupe fingerprint", "Affected Surface", "Linked Artifacts", "Validation command", "Guardrails"];
const forbiddenPathPatterns = [/C:\\Users/i, /C:\/Users/i, /OneDrive/i, /\/Users\//i, /\/home\//i, /(^|[^A-Za-z])[A-Z]:(\\|\/)/];
for (const issue of candidates) {
  assert(String(issue.dedupeFingerprint ?? "").startsWith("visual-hive:"), "candidate must include a Visual Hive dedupe fingerprint.");
  assert(!fingerprints.has(issue.dedupeFingerprint), `duplicate fingerprint ${issue.dedupeFingerprint}`);
  fingerprints.add(issue.dedupeFingerprint);
  const body = String(issue.body ?? "");
  for (const token of requiredBodyTokens) {
    assert(body.includes(token), `issue body for ${issue.dedupeFingerprint} must include ${token}`);
  }
  for (const pattern of forbiddenPathPatterns) {
    assert(!pattern.test(body), `issue body for ${issue.dedupeFingerprint} leaks local path matching ${pattern}`);
  }
  assert(Array.isArray(issue.affected) && issue.affected.length > 0, `issue ${issue.dedupeFingerprint} must include affected surface data.`);
  assert(issue.validationCommand, `issue ${issue.dedupeFingerprint} must include validationCommand.`);
}

const summary = {
  schemaVersion: "visual-hive.live-issue-loop-smoke.v1",
  generatedAt: new Date().toISOString(),
  project: "visual-hive-demo-site",
  status: "passed",
  activeCandidates: candidates.length,
  seededFindings: live.seededFindings.length,
  uniqueFingerprints: fingerprints.size,
  pathScanStatus: pathScan.status,
  mcpResources: mcp.resources.length,
  hiveWorkOrders: workOrders.workOrders.length,
  externalCallsMade: 0,
  networkCallsMade: 0,
  realGithubIssuesCreated: 0
};
await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(`Visual Hive live issue loop smoke passed with ${candidates.length} candidates.`);

function runNpm(script, timeoutMs) {
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  return runCommand(command, ["run", script], timeoutMs);
}

function runNode(args, timeoutMs) {
  return runCommand(process.execPath, args, timeoutMs);
}

function runCommand(command, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: "inherit",
      windowsHide: true,
      shell: process.platform === "win32" && command.endsWith(".cmd")
    });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      killProcessTree(child.pid);
    }, timeoutMs);
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      const status = timedOut ? 124 : code ?? 1;
      if (status !== 0) {
        reject(new Error(`${command} ${args.join(" ")} failed with exit code ${status}.`));
        return;
      }
      resolve();
    });
  });
}

async function readJson(relativePath) {
  const file = path.join(hiveDir, relativePath);
  assert(existsSync(file), `${relativePath} must exist.`);
  return JSON.parse(await readFile(file, "utf8"));
}

function killProcessTree(pid) {
  if (!pid) return;
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(pid), "/T", "/F"], { stdio: "ignore", windowsHide: true });
    return;
  }
  try {
    process.kill(-pid, "SIGTERM");
  } catch {
    try {
      process.kill(pid, "SIGTERM");
    } catch {
      // Already exited.
    }
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
