#!/usr/bin/env node
import { spawn } from "node:child_process";

const separatorIndex = process.argv.indexOf("--");
if (separatorIndex < 0) {
  console.error("Usage: node scripts/run-with-env.mjs KEY=value [KEY=value ...] -- command [args...]");
  process.exit(2);
}

const envPairs = process.argv.slice(2, separatorIndex);
const command = process.argv[separatorIndex + 1];
const args = process.argv.slice(separatorIndex + 2);

if (!command) {
  console.error("Missing command after --.");
  process.exit(2);
}

const env = { ...process.env };
for (const pair of envPairs) {
  const equalsIndex = pair.indexOf("=");
  if (equalsIndex <= 0) {
    console.error(`Invalid env assignment "${pair}". Expected KEY=value.`);
    process.exit(2);
  }
  env[pair.slice(0, equalsIndex)] = pair.slice(equalsIndex + 1);
}

const child = spawn(command, args, {
  cwd: process.cwd(),
  stdio: "inherit",
  shell: process.platform === "win32",
  windowsHide: true,
  env
});

child.on("error", (error) => {
  console.error(`Failed to start command: ${error.message}`);
  process.exit(1);
});

child.on("close", (code) => {
  process.exit(code ?? 1);
});
