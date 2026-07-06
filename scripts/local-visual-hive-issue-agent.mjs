#!/usr/bin/env node

let input = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  const profile = process.env.VISUAL_HIVE_AGENT_PROFILE ?? "unknown";
  const dedupe = process.env.VISUAL_HIVE_AGENT_ISSUE_DEDUPE ?? "unknown";
  const validation = process.env.VISUAL_HIVE_AGENT_VALIDATION_COMMAND ?? "not recorded";
  const allowWrite = process.env.VISUAL_HIVE_AGENT_ALLOW_WRITE === "true";
  const allowNetwork = process.env.VISUAL_HIVE_AGENT_ALLOW_EXTERNAL_NETWORK === "true";

  if (allowWrite || allowNetwork) {
    console.error("local demo issue agent refuses write or network-enabled runs");
    process.exit(2);
  }

  const title = input.match(/^Issue:\s*(.+)$/m)?.[1] ?? "Visual Hive issue";
  console.log(`# Local Visual Hive issue agent`);
  console.log(`Profile: ${profile}`);
  console.log(`Dedupe: ${dedupe}`);
  console.log(`Issue: ${title}`);
  console.log(`Validation: ${validation}`);
  console.log("");
  console.log("Recommendation: add or strengthen the smallest deterministic Visual Hive contract that covers the affected route, selector, or mutation survivor before changing baselines.");
  console.log("Safety: no files changed, no network calls made, no GitHub issues created.");
});
