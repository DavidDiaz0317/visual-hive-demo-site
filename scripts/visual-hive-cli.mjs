#!/usr/bin/env node
import { access } from "node:fs/promises";
import path from "node:path";
import { execFile, spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const execFileAsync = promisify(execFile);

const resolution = await resolveVisualHiveCli();

if (args.includes("--print-path")) {
  console.log(resolution.displayPath);
  process.exit(0);
}

if (args.includes("--print-resolution")) {
  console.log(JSON.stringify(resolution, null, 2));
  process.exit(0);
}

const child = spawn(resolution.command, [...resolution.prefixArgs, ...args], {
  cwd: repoRoot,
  stdio: "inherit",
  shell: resolution.shell,
  windowsHide: true,
  env: process.env
});

child.on("error", (error) => {
  console.error(`Failed to start Visual Hive CLI: ${error.message}`);
  process.exit(1);
});

child.on("close", (code) => {
  process.exit(code ?? 1);
});

async function resolveVisualHiveCli() {
  const override = process.env.VISUAL_HIVE_CLI?.trim();
  if (override) {
    return buildInvocation(path.resolve(repoRoot, override), "VISUAL_HIVE_CLI");
  }

  const siblingCandidates = [
    {
      source: "sibling visual-hive checkout",
      checkoutRoot: path.resolve(repoRoot, "..", "visual-hive"),
      file: path.resolve(repoRoot, "..", "visual-hive", "packages", "cli", "dist", "index.js")
    },
    {
      source: "sibling vis-hive checkout",
      checkoutRoot: path.resolve(repoRoot, "..", "vis-hive"),
      file: path.resolve(repoRoot, "..", "vis-hive", "packages", "cli", "dist", "index.js")
    }
  ];
  const installedCandidates = [
    {
      source: "workspace package install",
      file: path.resolve(repoRoot, "node_modules", "@visual-hive", "cli", "dist", "index.js")
    },
    {
      source: "local package binary",
      file: path.resolve(repoRoot, "node_modules", ".bin", process.platform === "win32" ? "visual-hive.cmd" : "visual-hive")
    }
  ];

  const siblingMatches = [];
  for (const candidate of siblingCandidates) {
    if (await exists(candidate.file)) {
      siblingMatches.push({ ...candidate, gitCommitTime: await gitCommitTime(candidate.checkoutRoot) });
    }
  }
  siblingMatches.sort((a, b) => b.gitCommitTime - a.gitCommitTime);
  if (siblingMatches[0]) {
    const selected = siblingMatches[0];
    return buildInvocation(selected.file, `${selected.source} (${selected.gitCommitTime ? "newest checkout" : "built checkout"})`);
  }

  for (const candidate of installedCandidates) {
    if (await exists(candidate.file)) return buildInvocation(candidate.file, candidate.source);
  }

  console.error(
    [
      "Visual Hive CLI could not be resolved.",
      "",
      "Set VISUAL_HIVE_CLI to a built CLI entrypoint, for example:",
      "  VISUAL_HIVE_CLI=C:\\\\path\\\\to\\\\visual-hive\\\\packages\\\\cli\\\\dist\\\\index.js",
      "",
      "Or place a built Visual Hive checkout next to this repo as either:",
      "  ../visual-hive",
      "  ../vis-hive",
      "",
      "Later, an installed @visual-hive/cli package or visual-hive binary in node_modules will also be used."
    ].join("\n")
  );
  process.exit(2);
}

function buildInvocation(file, source) {
  const isJavaScript = file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".cjs");
  return {
    source,
    displayPath: file,
    command: isJavaScript ? process.execPath : file,
    prefixArgs: isJavaScript ? [file] : [],
    shell: process.platform === "win32" && !isJavaScript
  };
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function gitCommitTime(checkoutRoot) {
  try {
    const { stdout } = await execFileAsync("git", ["-C", checkoutRoot, "log", "-1", "--format=%ct"], { timeout: 5_000 });
    return Number.parseInt(stdout.trim(), 10) || 0;
  } catch {
    return 0;
  }
}
