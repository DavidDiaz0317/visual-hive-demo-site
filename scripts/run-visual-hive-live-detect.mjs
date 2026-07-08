#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const steps = [
  ["doctor", "vh:doctor", 120_000],
  ["analyze", "vh:analyze", 120_000],
  ["graph-search", "vh:graph:search", 120_000],
  ["graph-impact", "vh:graph:impact", 120_000],
  ["recommend", "vh:recommend", 120_000],
  ["plan", "vh:plan", 120_000],
  ["run-seed", "vh:run:seed", 240_000],
  ["run-ci", "vh:run:ci", 240_000],
  ["mutate", "vh:mutate", 420_000],
  ["triage", "vh:triage", 120_000],
  ["evidence", "vh:evidence", 120_000],
  ["issues", "vh:issues", 120_000],
  ["handoff", "vh:handoff", 120_000],
  ["hive-export", "vh:hive-export", 120_000],
  ["hive-beads", "vh:hive-beads", 120_000],
  ["hive-validate", "vh:hive-validate", 120_000],
  ["mcp", "vh:mcp", 120_000],
  ["mcp-smoke", "vh:mcp:smoke", 180_000],
  ["artifacts", "vh:artifacts", 120_000],
  ["path-scan", "vh:path-scan", 120_000]
];

for (const [name, script, timeoutMs] of steps) {
  console.log(`[vh:live-detect] ${name}`);
  await runNpm(script, timeoutMs);
}

console.log("[vh:live-detect] complete");

function runNpm(script, timeoutMs) {
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  return new Promise((resolve, reject) => {
    const child = spawn(command, ["run", script], {
      cwd: repoRoot,
      stdio: "inherit",
      windowsHide: true,
      shell: process.platform === "win32"
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
        reject(new Error(`${script} failed with exit code ${status}.`));
        return;
      }
      resolve();
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
