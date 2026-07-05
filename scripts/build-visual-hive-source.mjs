#!/usr/bin/env node
import { access } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const candidates = [
  process.env.VISUAL_HIVE_REPO ? path.resolve(repoRoot, process.env.VISUAL_HIVE_REPO) : undefined,
  path.resolve(repoRoot, "..", "visual-hive"),
  path.resolve(repoRoot, "..", "vis-hive")
].filter(Boolean);

for (const candidate of candidates) {
  if (await exists(path.join(candidate, "package.json"))) {
    const command = process.platform === "win32" ? "npm.cmd" : "npm";
    const child = spawn(command, ["run", "build"], {
      cwd: candidate,
      stdio: "inherit",
      windowsHide: true,
      shell: process.platform === "win32"
    });
    child.on("close", (code) => process.exit(code ?? 1));
    child.on("error", (error) => {
      console.error(`Failed to build Visual Hive at ${candidate}: ${error.message}`);
      process.exit(1);
    });
    break;
  }
}

if (!candidates.length || !(await Promise.any(candidates.map((candidate) => exists(path.join(candidate, "package.json")))).catch(() => false))) {
  console.error("Could not find a Visual Hive checkout. Set VISUAL_HIVE_REPO or use ../visual-hive / ../vis-hive.");
  process.exit(2);
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}
