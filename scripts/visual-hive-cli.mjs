#!/usr/bin/env node
import { access } from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

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

  const candidates = [
    {
      source: "sibling visual-hive checkout",
      file: path.resolve(repoRoot, "..", "visual-hive", "packages", "cli", "dist", "index.js")
    },
    {
      source: "sibling vis-hive checkout",
      file: path.resolve(repoRoot, "..", "vis-hive", "packages", "cli", "dist", "index.js")
    },
    {
      source: "workspace package install",
      file: path.resolve(repoRoot, "node_modules", "@visual-hive", "cli", "dist", "index.js")
    },
    {
      source: "local package binary",
      file: path.resolve(repoRoot, "node_modules", ".bin", process.platform === "win32" ? "visual-hive.cmd" : "visual-hive")
    }
  ];

  for (const candidate of candidates) {
    if (await exists(candidate.file)) {
      return buildInvocation(candidate.file, candidate.source);
    }
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
