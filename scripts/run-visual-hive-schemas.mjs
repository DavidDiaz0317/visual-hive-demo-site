#!/usr/bin/env node
import { spawn } from "node:child_process";
import { access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const resolution = await resolveVisualHiveCli();
const schemasDir = await resolveSchemasDir(resolution.displayPath);

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

async function resolveSchemasDir(cliPath) {
  const candidates = [
    path.join(path.dirname(cliPath), "schemas"),
    path.join(path.resolve(cliPath, "..", "..", "..", ".."), "schemas")
  ];
  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Try the next supported installation layout.
    }
  }
  throw new Error(
    `Visual Hive schemas were not found beside the released CLI or in its source checkout: ${candidates.join(", ")}`
  );
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
