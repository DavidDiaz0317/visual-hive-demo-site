#!/usr/bin/env node
import { access } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { clearTimeout, setTimeout } from "node:timers";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cliPath = await resolveCliPath();
const productRoot = productRootFromCli(cliPath);
const smokeScript = path.join(productRoot, "scripts", "smoke-mcp.mjs");

await exists(smokeScript);
await run(process.execPath, [smokeScript, "--config", path.join(repoRoot, "visual-hive.config.yaml"), "--root", repoRoot], 180_000);

async function resolveCliPath() {
  const override = process.env.VISUAL_HIVE_CLI?.trim();
  if (override) return path.resolve(repoRoot, override);
  const candidates = [
    path.resolve(repoRoot, "..", "visual-hive", "packages", "cli", "dist", "index.js"),
    path.resolve(repoRoot, "..", "vis-hive", "packages", "cli", "dist", "index.js"),
    path.resolve(repoRoot, "node_modules", "@visual-hive", "cli", "dist", "index.js")
  ];
  for (const candidate of candidates) {
    if (!(await fileExists(candidate))) continue;
    const productRoot = productRootFromCli(candidate);
    if (await fileExists(path.join(productRoot, "scripts", "smoke-mcp.mjs"))) return candidate;
  }
  throw new Error("Could not resolve Visual Hive CLI. Set VISUAL_HIVE_CLI to a built packages/cli/dist/index.js path.");
}

function productRootFromCli(file) {
  const normalized = path.normalize(file);
  if (!normalized.endsWith(path.join("packages", "cli", "dist", "index.js"))) {
    throw new Error(`VISUAL_HIVE_CLI must point at packages/cli/dist/index.js for MCP smoke, got ${file}`);
  }
  return path.resolve(path.dirname(file), "..", "..", "..");
}

async function exists(file) {
  if (!(await fileExists(file))) throw new Error(`Required Visual Hive MCP smoke script not found: ${file}`);
}

async function fileExists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function run(command, args, timeoutMs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: repoRoot, stdio: "inherit", env: process.env });
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`${command} ${args.join(" ")} timed out after ${timeoutMs}ms`));
    }, timeoutMs);
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`));
    });
  });
}
