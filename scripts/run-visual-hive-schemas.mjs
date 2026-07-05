#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resolution = await resolveVisualHiveCli();
const productRoot = path.resolve(resolution.displayPath, "..", "..", "..", "..");
const schemasDir = path.join(productRoot, "schemas");

const args = [
  "scripts/visual-hive-cli.mjs",
  "schemas",
  "verify",
  "--schemas-dir",
  schemasDir,
  "--output",
  ".visual-hive/schema-catalog.json"
];

const child = spawn(process.execPath, args, {
  cwd: repoRoot,
  stdio: "inherit",
  windowsHide: true
});

child.on("exit", (code) => {
  process.exit(code ?? 1);
});

async function resolveVisualHiveCli() {
  const result = await capture(process.execPath, ["scripts/visual-hive-cli.mjs", "--print-resolution"]);
  if (result.status !== 0) {
    throw new Error(`Unable to resolve Visual Hive CLI: ${result.stderr || result.stdout}`);
  }
  return JSON.parse(result.stdout);
}

function capture(command, args) {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      windowsHide: true
    });
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("close", (code) => resolve({ status: code ?? 1, stdout, stderr }));
  });
}
