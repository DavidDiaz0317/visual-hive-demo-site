#!/usr/bin/env node
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hiveDir = path.join(repoRoot, ".visual-hive");

await runNpm("vh:defect:plan", 120_000);
const defectRun = await runNpm("vh:defect:run", 180_000, { allowFailure: true });
if (defectRun === 0) {
  throw new Error("Seeded defect run unexpectedly passed; deterministic no-login contract did not catch the seeded failure.");
}

const report = await readJson("report.json");
const reportText = JSON.stringify(report);
assert(report.status === "failed", `Seeded defect report status must be failed, got ${report.status}.`);
assert(reportText.includes("seeded-force-login-public-demo"), "Seeded defect report must include seeded-force-login-public-demo.");
assert(!reportText.includes("target_startup_failure"), "Seeded defect must not fail because of target startup.");
assert(!reportText.includes("environment_failure"), "Seeded defect must not fail because of environment setup.");

await runCli(["triage", "--config", "visual-hive.defect.config.yaml"], 120_000);
await runCli(["evidence", "--config", "visual-hive.defect.config.yaml"], 120_000);
await runCli(["handoff", "--config", "visual-hive.defect.config.yaml", "--dry-run", "--agent", "quality"], 120_000);
await runCli(["test-creation-plan", "--config", "visual-hive.defect.config.yaml"], 120_000);
await runCli(["artifacts", "--config", "visual-hive.defect.config.yaml"], 120_000);

const evidence = await readJson("evidence-packet.json");
const handoff = await readJson("handoff.json");
const issue = await readText("hive-issue.md");
const testCreation = await readJson("test-creation-plan.json");

assert(evidence.verdictSummary?.visualHiveVerdict === "failed", "Seeded defect Evidence Packet verdict must be failed.");
assert(handoff.externalCallsMade === 0, "Seeded defect handoff must remain dry-run/no-network.");
assert(issue.includes("Visual Hive") && issue.includes("seeded-force-login-public-demo"), "Seeded defect issue body must include Visual Hive context.");
assert(Array.isArray(testCreation.recommendations), "Seeded defect must generate test-creation recommendations.");

console.log("Visual Hive seeded defect proof passed for visual-hive-demo-site.");

function runCli(args, timeoutMs) {
  return runNode(["scripts/visual-hive-cli.mjs", ...args], timeoutMs);
}

function runNpm(script, timeoutMs, options = {}) {
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  return runCommand(command, ["run", script], timeoutMs, options);
}

function runNode(args, timeoutMs, options = {}) {
  return runCommand(process.execPath, args, timeoutMs, options);
}

function runCommand(command, args, timeoutMs, options = {}) {
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
      if (status !== 0 && !options.allowFailure) {
        reject(new Error(`${command} ${args.join(" ")} failed with exit code ${status}.`));
        return;
      }
      resolve(status);
    });
  });
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
