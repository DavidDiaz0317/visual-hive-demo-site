#!/usr/bin/env node
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const DEFAULT_TIMEOUT_MS = 120_000;

const suites = {
  fast: [
    step("vh:doctor"),
    step("vh:plan"),
    step("vh:run", 180_000),
    step("vh:mutate", 300_000),
    step("vh:triage"),
    step("vh:report")
  ],
  governance: [
    step("vh:analyze"),
    step("vh:recommend"),
    step("vh:plan:docs"),
    step("vh:plan:auth"),
    step("vh:plan:component"),
    step("vh:plan:canary"),
    step("vh:plans"),
    step("vh:baselines"),
    step("vh:coverage"),
    step("vh:contracts"),
    step("vh:flows"),
    step("vh:targets"),
    step("vh:schedules"),
    step("vh:workflows"),
    step("vh:providers"),
    step("vh:provider-plan"),
    step("vh:provider-handoff"),
    step("vh:provider-upload"),
    step("vh:llm"),
    step("vh:llm-decision"),
    step("vh:security"),
    step("vh:costs"),
    step("vh:readiness", DEFAULT_TIMEOUT_MS, true),
    step("vh:setup-status"),
    step("vh:runbook"),
    step("vh:risk", DEFAULT_TIMEOUT_MS, true),
    step("vh:history"),
    step("vh:artifacts")
  ],
  hive: [
    step("vh:evidence"),
    step("vh:layers"),
    step("vh:verdict"),
    step("vh:handoff"),
    step("vh:handoff-validate"),
    step("vh:hive-export"),
    step("vh:hive-modes"),
    step("vh:hive-guarded-preview"),
    step("vh:hive-repair-envelope"),
    step("vh:hive-repair-consumer"),
    step("vh:hive-repair-workflow"),
    step("vh:test-creation"),
    step("vh:agent-packet"),
    step("vh:agent-packet:handoff"),
    step("vh:agent-packet:provider"),
    step("vh:tools"),
    step("vh:context"),
    step("vh:mcp"),
    step("vh:snapshot"),
    step("vh:connections"),
    step("vh:pipeline", 360_000, true)
  ]
};

suites.all = [...suites.fast, ...suites.governance, ...suites.hive];

const suiteName = process.argv.find((arg, index) => index > 1 && !arg.startsWith("--")) ?? "all";
const dryRun = process.argv.includes("--dry-run");
const list = process.argv.includes("--list");

if (list) {
  for (const [name, steps] of Object.entries(suites)) {
    console.log(`${name}: ${steps.length} steps`);
  }
  process.exit(0);
}

const selected = suites[suiteName];
if (!selected) {
  console.error(`Unknown suite "${suiteName}". Available suites: ${Object.keys(suites).join(", ")}`);
  process.exit(2);
}

if (dryRun) {
  console.log(`[vh:${suiteName}] dry run (${selected.length} steps)`);
  selected.forEach((item, index) => {
    console.log(`${index + 1}. npm run ${item.script} (${Math.round(item.timeoutMs / 1000)}s${item.allowFailure ? ", advisory" : ""})`);
  });
  process.exit(0);
}

console.log(`[vh:${suiteName}] starting ${selected.length} timeout-bounded steps`);
for (const [index, item] of selected.entries()) {
  console.log(`\n[vh:${suiteName}] ${index + 1}/${selected.length} npm run ${item.script}`);
  const result = await runNpmScript(item);
  if (result !== 0 && !item.allowFailure) {
    console.error(`[vh:${suiteName}] failed at ${item.script} with exit code ${result}`);
    process.exit(result);
  }
  if (result !== 0) {
    console.warn(`[vh:${suiteName}] advisory step ${item.script} exited ${result}; continuing`);
  }
  await delay(100);
}
console.log(`\n[vh:${suiteName}] completed`);

function step(script, timeoutMs = DEFAULT_TIMEOUT_MS, allowFailure = false) {
  return { script, timeoutMs, allowFailure };
}

function runNpmScript(item) {
  return new Promise((resolve) => {
    const child = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", item.script], {
      cwd: process.cwd(),
      stdio: "inherit",
      shell: process.platform === "win32",
      windowsHide: true
    });

    const timer = setTimeout(() => {
      if (child.pid) {
        killProcessTree(child.pid);
      }
      resolve(124);
    }, item.timeoutMs);

    child.on("error", (error) => {
      clearTimeout(timer);
      console.error(`[${item.script}] failed to start: ${error.message}`);
      resolve(1);
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      resolve(code ?? 1);
    });
  });
}

function killProcessTree(pid) {
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
      // The process already exited.
    }
  }
}
