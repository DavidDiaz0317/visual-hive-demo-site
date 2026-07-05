#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hiveDir = path.join(repoRoot, ".visual-hive");

const artifactIndex = await readJson("artifacts-index.json");
const mcp = await readJson("mcp-manifest.json");
const context = await readJson("context-ledger.json");

assert(Array.isArray(artifactIndex.artifacts) && artifactIndex.artifacts.length > 0, "Artifact index must list artifacts.");
assert(Array.isArray(mcp.resources) && mcp.resources.length > 0, "MCP manifest must list resources.");
assert(Array.isArray(mcp.tools) && mcp.tools.length > 0, "MCP manifest must list read tools.");
assert(JSON.stringify(context).includes("evidenceResources"), "Context Ledger must include evidenceResources links.");

const toolNames = new Set(mcp.tools.map((tool) => tool.name ?? tool.id));
const mismatches = mcp.resources.filter((resource) => resource.readToolName && !toolNames.has(resource.readToolName));
assert(mismatches.length === 0, `MCP resource read tools must align with tool catalog: ${mismatches.map((item) => item.id ?? item.uri).join(", ")}`);

const requiredArtifacts = [
  ".visual-hive/report.json",
  ".visual-hive/mutation-report.json",
  ".visual-hive/evidence-packet.json",
  ".visual-hive/verdict.json",
  ".visual-hive/handoff.json",
  ".visual-hive/hive/hive-export.json",
  ".visual-hive/test-creation-plan.json",
  ".visual-hive/control-plane-snapshot.json"
];
const artifactPaths = new Set(artifactIndex.artifacts.map((artifact) => normalizePath(artifact.path ?? artifact.artifactPath)));
const missing = requiredArtifacts.filter((artifact) => !artifactPaths.has(normalizePath(artifact)));
assert(missing.length === 0, `Artifact index is missing required evidence artifacts: ${missing.join(", ")}`);

console.log(`Visual Hive evidence-resource consistency passed for visual-hive-demo-site (${mcp.resources.length} resources).`);

async function readJson(relativePath) {
  return JSON.parse(await readFile(path.join(hiveDir, relativePath), "utf8"));
}

function normalizePath(value) {
  return String(value ?? "").replaceAll("\\", "/");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}
