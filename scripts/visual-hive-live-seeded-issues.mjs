#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const hiveDir = path.join(repoRoot, ".visual-hive");
const generatedAt = new Date().toISOString();
const shouldRunDefect = !process.argv.includes("--skip-defect-run") && process.env.VISUAL_HIVE_SKIP_DEFECT_RUN !== "true";

const sourceArtifacts = {
  report: ".visual-hive/report.json",
  mutationReport: ".visual-hive/mutation-report.json",
  triage: ".visual-hive/triage.json",
  evidencePacket: ".visual-hive/evidence-packet.json",
  repoMap: ".visual-hive/repo-map.json",
  visualGraph: ".visual-hive/visual-graph.json",
  visualImpact: ".visual-hive/visual-impact.json",
  handoff: ".visual-hive/handoff.json",
  hiveExport: ".visual-hive/hive/hive-export.json",
  hiveWorkOrders: ".visual-hive/hive/hive-agent-work-orders.json",
  mcpManifest: ".visual-hive/mcp-manifest.json",
  artifactIndex: ".visual-hive/artifacts-index.json",
  liveSeededIssues: ".visual-hive/live-seeded-issues.json"
};

const guardrails = [
  "Visual Hive does not decide repairs by itself; it detects, proves, packages, routes, and validates.",
  "Hive or an agent may act only from this trusted issue or the linked Hive work-order artifacts.",
  "Do not approve baselines blindly.",
  "Do not weaken screenshot thresholds, selector contracts, mutation thresholds, or workflow safety gates to make the issue disappear.",
  "Route this smoke issue to Hive or a human maintainer and rerun the listed Visual Hive validation command before marking this issue resolved."
];

const seededFindings = [
  {
    id: "force-login-on-demo",
    issueKind: "contract_result",
    severity: "critical",
    contractId: "public-auth-boundary",
    route: "/?issue=force-login-on-demo",
    selector: "[data-testid='login-page']",
    affectedSurface: "Public demo auth boundary exposes login UI",
    evidence: "The seeded route forces the login page where the public demo contract forbids login controls.",
    repairHint: "Remove accidental auth gating from public demo routes or restore the public dashboard render path."
  },
  {
    id: "mobile-overflow",
    issueKind: "visual_regression",
    severity: "high",
    contractId: "mobile-layout-stability",
    route: "/?issue=mobile-overflow",
    selector: "[data-testid='mobile-overflow-probe']",
    affectedSurface: "Mobile dashboard layout",
    evidence: "The seeded route adds a mobile overflow probe that the mobile contract forbids.",
    repairHint: "Constrain the overflowing region and add a mobile viewport assertion before approving any baseline."
  },
  {
    id: "api-500",
    issueKind: "contract_result",
    severity: "high",
    contractId: "api-error-state-contract",
    route: "/scenarios?issue=api-500",
    selector: "[data-testid='error-banner']",
    affectedSurface: "API-driven dashboard data state",
    evidence: "The seeded route proves an API failure surface with visible error-state evidence.",
    repairHint: "Preserve explicit error handling and validate the backend/API path before changing UI assertions."
  },
  {
    id: "empty-data",
    issueKind: "contract_result",
    severity: "medium",
    contractId: "data-empty-state-contract",
    route: "/?issue=empty-data",
    selector: "[data-testid='empty-data-state']",
    affectedSurface: "Dashboard empty data state",
    evidence: "The seeded route renders an empty state that must remain intentional and test-covered.",
    repairHint: "Ensure empty data is represented with explicit user-facing copy and selector coverage."
  },
  {
    id: "hidden-error-banner",
    issueKind: "contract_result",
    severity: "high",
    contractId: "api-error-state-contract",
    route: "/scenarios?issue=hidden-error-banner",
    selector: "[data-testid='error-banner']",
    affectedSurface: "API error visibility",
    evidence: "The seeded operator represents a hidden-alert regression in the error-state contract.",
    repairHint: "Restore visible alert semantics for API failure paths and keep role=alert coverage."
  },
  {
    id: "route-guard-bypass",
    issueKind: "contract_result",
    severity: "critical",
    contractId: "public-auth-boundary",
    route: "/?issue=route-guard-bypass",
    selector: "[data-testid='protected-route']",
    affectedSurface: "Protected route boundary",
    evidence: "The seeded route exposes protected-route content that the public contract forbids.",
    repairHint: "Repair route guard conditions and keep public demo checks secret-free."
  },
  {
    id: "theme-token-drift",
    issueKind: "visual_regression",
    severity: "high",
    contractId: "app-shell-stability",
    route: "/?issue=theme-token-drift",
    selector: "[data-testid='dashboard-page']",
    affectedSurface: "App shell theme tokens",
    evidence: "The seeded operator represents visual token drift that should be reviewed through screenshot evidence.",
    repairHint: "Restore stable design tokens and compare visual diff artifacts before accepting a new baseline."
  }
];

await mkdir(hiveDir, { recursive: true });
if (shouldRunDefect) {
  const status = await runNpm("vh:defect", 420_000, { allowFailure: false });
  if (status !== 0) {
    throw new Error(`vh:defect failed with exit code ${status}; live seeded issue generation requires deterministic defect evidence.`);
  }
}

const issues = seededFindings.map(toIssueCandidate);
const summary = {
  total: issues.length,
  openCandidates: issues.length,
  updateCandidates: 0,
  resolvedCandidates: 0,
  suppressed: 0,
  blocked: 0,
  byKind: countBy(issues, "issueKind"),
  bySeverity: countBy(issues, "severity")
};

await writeJson("live-seeded-issues.json", {
  schemaVersion: "visual-hive.live-seeded-issues.v1",
  generatedAt,
  project: "visual-hive-demo-site",
  externalCallsMade: 0,
  networkCallsMade: 0,
  sourceMutation: false,
  seededFindings: issues.map((issue) => ({
    seededDefectId: issue.seededDefectId,
    route: issue.affected[0]?.route,
    contractId: issue.affected[0]?.contractId,
    finding: issue.affected[0]?.affectedSurface,
    issueCandidateFingerprint: issue.dedupeFingerprint,
    expectedIssueTitle: issue.title,
    validationCommand: issue.validationCommand,
    repairHint: issue.repairHint,
    currentLifecycleStatus: "active"
  })),
  issues
});

await writeFile(path.join(hiveDir, "live-seeded-issues.md"), renderLiveSeededMarkdown(issues), "utf8");

await writeJson("issues.json", {
  schemaVersion: "visual-hive.issues.v1",
  generatedAt,
  project: "visual-hive-demo-site",
  externalCallsMade: 0,
  networkCallsMade: 0,
  sourceArtifacts,
  summary,
  issues
});

await writeFile(path.join(hiveDir, "issues.md"), renderIssuesMarkdown(issues), "utf8");
await writeJson("issue-queue.json", {
  schemaVersion: "visual-hive.issue-queue.v1",
  generatedAt,
  project: "visual-hive-demo-site",
  externalCallsMade: 0,
  networkCallsMade: 0,
  summary: {
    total: issues.length,
    readyForHive: issues.length,
    readyForVisualHiveAgent: issues.length,
    blockedPolicy: 0,
    blockedMissingArtifact: 0,
    resolvedCandidates: 0,
    suppressed: 0
  },
  labels: Array.from(new Set(issues.flatMap((issue) => issue.labels))),
  queues: {
    ready_for_hive: issues,
    ready_for_visual_hive_agent: issues,
    blocked_policy: [],
    blocked_missing_artifact: [],
    resolved_candidate: [],
    suppressed: []
  }
});

await mkdir(path.join(hiveDir, "hive"), { recursive: true });
await writeJson("hive/hive-agent-work-orders.json", renderWorkOrders(issues));
await writeJson("hive/repair-work-orders.json", renderWorkOrders(issues));

console.log(`Wrote ${issues.length} live seeded Visual Hive issue candidates.`);

function toIssueCandidate(finding) {
  const dedupeFingerprint = `visual-hive:${finding.issueKind}:live-seeded-${finding.id}`;
  const title = `[Visual Hive] Active seeded finding: ${finding.id}`;
  const labels = [
    "visual-hive",
    "hive/quality",
    "visual-hive/live",
    "visual-hive/seeded",
    `visual-hive/${finding.issueKind.replaceAll("_", "-")}`,
    "visual-hive/ready-for-hive",
    "visual-hive/smoke"
  ];
  const affected = [
    {
      seededDefectId: finding.id,
      contractId: finding.contractId,
      targetId: "localPreview",
      route: finding.route,
      selector: finding.selector,
      affectedSurface: finding.affectedSurface
    }
  ];
  const validationCommand = `npm run vh:live-seeded-issues -- --skip-defect-run && npm run vh:live-issue-loop-smoke`;
  return {
    issueKind: finding.issueKind,
    severity: finding.severity,
    status: "open_candidate",
    currentLifecycleStatus: "active",
    seededDefectId: finding.id,
    dedupeFingerprint,
    title,
    labels,
    body: renderIssueBody({ ...finding, dedupeFingerprint, title, labels, affected, validationCommand }),
    owningAgentHint: "hive/quality",
    sourceArtifacts: Object.values(sourceArtifacts),
    affected,
    validationCommand,
    repairHint: finding.repairHint,
    guardrails,
    linkedEvidencePacket: sourceArtifacts.evidencePacket,
    linkedRepoMap: sourceArtifacts.repoMap,
    linkedVisualGraph: sourceArtifacts.visualGraph,
    linkedVisualImpact: sourceArtifacts.visualImpact,
    linkedHandoff: sourceArtifacts.handoff,
    linkedHiveExport: sourceArtifacts.hiveExport,
    linkedAgentPacket: ".visual-hive/agent-packet.json"
  };
}

function renderIssueBody(issue) {
  return [
    `<!-- visual-hive-issue dedupe:${issue.dedupeFingerprint} -->`,
    `<!-- visual-hive-issue-kind:${issue.issueKind} -->`,
    `<!-- visual-hive-seeded-finding:${issue.id} -->`,
    "",
    `# ${issue.title}`,
    "",
    "## Visual Hive Evidence",
    "",
    `- Issue kind: ${issue.issueKind}`,
    `- Severity: ${issue.severity}`,
    "- Status: open_candidate",
    "- Lifecycle: active",
    "- Owning agent hint: hive/quality",
    `- Dedupe fingerprint: ${issue.dedupeFingerprint}`,
    `- Seeded defect id: ${issue.id}`,
    `- Route: \`${issue.route}\``,
    `- Contract: \`${issue.contractId}\``,
    `- Selector: \`${issue.selector}\``,
    `- Validation command: \`${issue.validationCommand}\``,
    "",
    "## Linked Artifacts",
    "",
    ...Object.values(sourceArtifacts).map((artifact) => `- ${artifact}`),
    "",
    "## Affected Surface",
    "",
    `- ${issue.affectedSurface}`,
    `- Evidence: ${issue.evidence}`,
    "",
    "## Repair Guidance",
    "",
    `- ${issue.repairHint}`,
    "- Use `.visual-hive/hive/hive-agent-work-orders.json` as the Hive-compatible work-order source.",
    "- Visual Hive does not open repair PRs; Hive or a human maintainer should own any repair branch.",
    "",
    "## Guardrails",
    "",
    ...guardrails.map((guardrail) => `- ${guardrail}`),
    "",
    "## Agent Direction",
    "",
    "Hive and agents should use this issue as the queue item. Visual Hive remains the deterministic validation layer and should be rerun after any proposed fix."
  ].join("\n");
}

function renderLiveSeededMarkdown(issues) {
  return [
    "# Visual Hive Live Seeded Issues",
    "",
    "This artifact represents active seeded findings for the persistent live issue loop. It is intentionally separate from `vh:full-run`, which restores clean artifacts after proving a defect.",
    "",
    "| Seeded finding | Issue kind | Severity | Contract | Route | Fingerprint |",
    "| --- | --- | --- | --- | --- | --- |",
    ...issues.map((issue) => {
      const affected = issue.affected[0];
      return `| ${issue.seededDefectId} | ${issue.issueKind} | ${issue.severity} | ${affected.contractId} | \`${affected.route}\` | \`${issue.dedupeFingerprint}\` |`;
    }),
    ""
  ].join("\n");
}

function renderIssuesMarkdown(issues) {
  return [
    "# Visual Hive Live Issue Candidates",
    "",
    ...issues.flatMap((issue) => [
      `## ${issue.title}`,
      "",
      `- Dedupe: \`${issue.dedupeFingerprint}\``,
      `- Kind: ${issue.issueKind}`,
      `- Severity: ${issue.severity}`,
      `- Validation: \`${issue.validationCommand}\``,
      "",
      issue.body,
      ""
    ])
  ].join("\n");
}

function renderWorkOrders(issues) {
  return {
    schemaVersion: "visual-hive.hive-agent-work-orders.v1",
    generatedAt,
    project: "visual-hive-demo-site",
    externalCallsMade: 0,
    acmmLevel: 5,
    sourceArtifacts: {
      liveSeededIssues: sourceArtifacts.liveSeededIssues,
      issues: ".visual-hive/issues.json",
      hiveExport: sourceArtifacts.hiveExport
    },
    policy: {
      verdictAuthority: "visual_hive",
      agentsDecidePassFail: false,
      visualHiveRepairsCode: false,
      requiresVisualHiveValidation: true
    },
    workOrders: issues.map((issue) => ({
      id: issue.dedupeFingerprint.replaceAll(":", "-"),
      actor: "quality",
      title: `Repair ${issue.seededDefectId}`,
      objective: issue.repairHint,
      sourceIssueFingerprint: issue.dedupeFingerprint,
      evidenceKeys: [issue.seededDefectId, issue.issueKind, issue.affected[0].contractId],
      likelyFiles: ["src/App.tsx", "src/styles.css", "visual-hive.config.yaml"],
      artifacts: Object.values(sourceArtifacts),
      reproductionCommands: [issue.validationCommand],
      acceptanceCriteria: [
        "A holdgated PR links the Visual Hive issue.",
        "Visual Hive PR validation should run on any Hive- or human-created repair PR.",
        "No baselines are silently approved.",
        "No thresholds or selector contracts are weakened to hide the finding."
      ],
      allowedActions: ["read_sanitized_evidence", "inspect_repo_files", "create_branch", "open_pull_request", "request_visual_hive_rerun"],
      forbiddenActions: ["push_directly_to_main", "auto_merge_without_visual_hive_pass", "approve_baselines_without_human_review", "weaken_thresholds"],
      maxAttempts: 1,
      branchPrefix: "visual-hive/repair/",
      prOnly: true,
      requireHumanReview: true,
      rerunVisualHive: true,
      finalValidationCommand: "npm run vh:plan && npm run vh:run:ci"
    }))
  };
}

function countBy(items, key) {
  return items.reduce((acc, item) => {
    acc[item[key]] = (acc[item[key]] ?? 0) + 1;
    return acc;
  }, {});
}

async function writeJson(relativePath, value) {
  const file = path.join(hiveDir, relativePath);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function runNpm(script, timeoutMs, options = {}) {
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  return runCommand(command, ["run", script], timeoutMs, options);
}

function runCommand(command, args, timeoutMs, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: repoRoot,
      stdio: "inherit",
      windowsHide: true,
      shell: process.platform === "win32" && command.endsWith(".cmd")
    });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      killProcessTree(child.pid);
    }, timeoutMs);
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      const status = timedOut ? 124 : code ?? 1;
      if (status !== 0 && !options.allowFailure) {
        reject(new Error(`${command} ${args.join(" ")} failed with exit code ${status}.`));
        return;
      }
      resolve(status);
    });
  });
}

function killProcessTree(pid) {
  if (!pid) return;
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
      // Already exited.
    }
  }
}

if (!existsSync(path.join(hiveDir, "issues.json"))) {
  throw new Error("live issue generation failed to write .visual-hive/issues.json");
}
