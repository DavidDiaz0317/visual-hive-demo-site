# Visual Hive Demo Site

This repository is a real external consumer for Visual Hive. It proves that Visual Hive can be resolved from outside the product repo, analyze a separate React/Vite app, plan PR-safe visual checks, seed and verify baselines, run mutation adequacy, produce evidence packets, and prepare Hive-ready handoff artifacts without making network calls or repairing code by default.

The app is a Visual Hive test lab with healthy default routes, opt-in seeded defect routes, local preview checks, mutation targets, dry-run provider paths, and Hive handoff resources.

## Requirements

- Node 22
- npm
- A built Visual Hive CLI from one of these sources:
  - `VISUAL_HIVE_CLI=/absolute/path/to/packages/cli/dist/index.js`
  - sibling checkout at `../visual-hive`
  - sibling checkout at `../vis-hive`
  - future installed package binary `visual-hive`

The resolver is `scripts/visual-hive-cli.mjs`. It prints a clear setup error if none of those sources is available.

## Run The Site

```bash
npm install
npm run build
npm run preview -- --port 4173 --strictPort
```

Open `http://127.0.0.1:4173/`.

## One-Command Visual Hive Proof

```bash
npm run vh:full-run
```

This command builds and typechecks the app, runs Visual Hive against this external repo, proves a clean deterministic pass, proves a seeded deterministic failure, runs mutation adequacy, and generates triage, Evidence Packet, verdict, test-creation, Hive handoff, MCP/tool/context, Control Plane snapshot, and artifact index outputs.

Default local runs create:

- zero real GitHub issues
- zero repair branches or PRs
- zero source mutations
- zero Hive API, LLM, or paid-provider calls

Generated `.visual-hive` files are ignored by default. Approved screenshots live in the tracked `visual-hive.baselines/` directory. Run `vh:run:seed` only for explicit local baseline creation/review; CI and live workflows never create their own expected images.

## Common Commands

```bash
npm run vh:doctor
npm run vh:analyze
npm run vh:graph:search
npm run vh:graph:impact
npm run vh:recommend
npm run vh:plan
npm run vh:run:seed
npm run vh:run:ci
npm run vh:mutate
npm run vh:triage
npm run vh:evidence
npm run vh:verdict
npm run vh:loop
npm run vh:loop:derive-issues
npm run vh:loop:lifecycle
npm run vh:handoff
npm run vh:handoff-validate
npm run vh:issues
npm run vh:issues:publish
npm run vh:agent:issue
npm run vh:agent:validate
npm run vh:agent:write-preview
npm run vh:github-app:artifact-smoke
npm run vh:mcp
npm run vh:mcp:smoke
npm run vh:hive-export
npm run vh:hive-beads
npm run vh:hive-validate
npm run vh:hive-setup-pack
npm run vh:hive-integration-smoke
npm run vh:hive-bundle
npm run vh:production-smoke
npm run vh:snapshot
npm run vh:artifacts
```

Use `npm run vh:cli -- --help` to inspect the resolved Visual Hive CLI.

## Visual Graph And Impact Queries

Visual Hive builds a local Visual Graph for this repo during analysis:

- `.visual-hive/visual-graph.json`
- `.visual-hive/visual-graph-summary.md`
- `.visual-hive/visual-graph-vocab.json`
- `.visual-hive/visual-graph-unresolved.json`
- `.visual-hive/visual-impact.json`

The graph connects files, components, routes, selectors, targets, contracts, screenshots, baselines, mutation operators, artifacts, issue candidates, agent profiles, and Hive resources. It is the bridge between deterministic QA evidence and issue-driven agents.

```bash
npm run vh:analyze
npm run vh:graph:search
npm run vh:graph:impact
```

`vh:graph:search` searches the graph vocabulary for terms like `login`. `vh:graph:impact` reads `changed-files.txt` and writes a blast-radius report showing affected routes, contracts, screenshots, mutations, issue candidates, and the validation command to rerun.

## PR-Safe Checks

The PR workflow runs with `contents: read`, no secrets, and no `pull_request_target`. It builds Visual Hive from `DavidDiaz0317/visual-hive@main`, runs local deterministic checks, writes evidence, issue candidates, MCP, and handoff artifacts, and uploads `.visual-hive`.

Workflow actions are pinned to commit SHAs with version comments so the repo does not silently consume a changed action tag. Update those SHAs intentionally when upgrading the workflow toolchain.

Run the PR-safe path locally:

```bash
npm run vh:doctor
npm run vh:plan
npm run vh:run:ci
npm run vh:triage
npm run vh:evidence
npm run vh:issues
npm run vh:handoff
npm run vh:mcp
npm run vh:artifacts
```

## Scheduled And Deep Checks

Scheduled/manual workflows run `npm run vh:full-run` first, then repeat key deep-lane checks for mutation adequacy, provider dry-run planning, handoff validation, GitHub App artifact ingestion, MCP smoke, issue-agent output, guarded write-preview, and Control Plane snapshots. Provider uploads, Hive API calls, and live issue creation remain disabled unless a trusted workflow explicitly enables them.

The production smoke workflow is manual and proves the complete client lane:

```bash
npm run vh:production-smoke
```

It runs build, typecheck, doctor, graph, plan, deterministic checks, mutation adequacy, evidence, issue candidates, issue publish dry-run, handoff validation, GitHub App artifact-ingestion smoke, MCP smoke, agent issue context, guarded write-preview dry-run, artifact indexing, and workflow audit.

## Seeded Failure Demo

```bash
npm run vh:defect
```

The defect config points Visual Hive at an intentional failure route and verifies that the failure is a product regression, not a startup or environment error. It then creates triage, Evidence Packet, handoff, issue body, test-creation, and artifact-index outputs.

Seeded routes include:

```text
/?issue=force-login-on-demo
/?issue=mobile-overflow
/?issue=empty-data
/?issue=broken-image
/scenarios?issue=api-500
/scenarios?issue=hidden-error-banner
/scenarios?issue=route-guard-bypass
/scenarios?issue=theme-token-drift
```

## Mutation Proof

```bash
npm run vh:mutate
npm run vh:mutation-proof
```

The mutation proof verifies that mutation results include operators, selected contracts, affected surfaces, validation commands, runtime/fixture metadata, and `sourceMutation: false`.

## Control Plane

```bash
npm run vh:snapshot
npm run vh:control-plane-smoke
```

The snapshot is a local artifact consumed by the Visual Hive Control Plane. It includes deterministic status, report evidence, mutation evidence, Evidence Packet, handoff readiness, runbook commands, artifact links, and the safety boundary that Visual Hive validates and routes issues but does not repair code.

## MCP

```bash
npm run vh:mcp
npm run vh:mcp:smoke
```

`vh:mcp` writes `.visual-hive/mcp-manifest.json`. `vh:mcp:smoke` calls the product MCP smoke harness through the resolved Visual Hive CLI and verifies real resources/tools over this repo's generated artifacts. MCP is read-only by default and does not run tests, mutate source, publish issues, upload providers, call Hive, or call LLMs.

## Hive Visual QA Import

```bash
npm run vh:hive-export
npm run vh:hive-beads
npm run vh:hive-validate
npm run vh:hive-setup-pack
npm run vh:hive-integration-smoke
```

These commands prove the intended combined product direction:

1. Visual Hive produces deterministic UI evidence and issue candidates.
2. `vh:hive-export` packages that evidence into `.visual-hive/hive/hive-export.json`.
3. `vh:hive-beads` projects issue candidates into Hive-style beads in `.visual-hive/hive/hive-beads.json`.
4. `vh:hive-validate` checks schema shape, required artifacts, dedupe keys, path sanitization, ACMM policy, and zero external calls.
5. `vh:hive-setup-pack` writes a safe setup plan for PR, scheduled, and trusted-import workflows.
6. `vh:hive-integration-smoke` runs the local export/beads/validate/setup-pack chain as one no-network check.

The workflow `.github/workflows/hive-visual-import-smoke.yml` runs this same path on a schedule or manual dispatch. It uploads `.visual-hive` artifacts and intentionally performs no live Hive API calls and no live issue creation.

## Issue Handoff

```bash
npm run vh:issues
npm run vh:issues:publish
npm run vh:handoff
npm run vh:handoff-dry-run
npm run vh:agent:issue
npm run vh:agent:validate
npm run vh:agent:write-preview
npm run vh:path-scan
npm run vh:github-app:artifact-smoke
```

Visual Hive's production route is issue-centric:

1. `vh:issues` turns deterministic findings into stable, deduplicated issue candidates in `.visual-hive/issues.json`, `.visual-hive/issues.md`, and `.visual-hive/issue-queue.json`.
2. Issue candidates are refreshed into the Visual Graph so Hive and agents can trace each issue back to affected routes, contracts, screenshots, mutations, and artifacts.
3. `vh:issues:publish` writes a no-network publish plan and dry-run result. It simulates create/update/block behavior with `networkCallsMade: 0`.
4. `vh:agent:issue` builds a bounded no-write agent request/output bundle from the first issue candidate. The agent receives evidence, graph refs, impact analysis, guardrails, and a validation command, but Visual Hive does not repair code.
5. `vh:agent:validate` verifies request/output/run artifacts, budgets, validation commands, and no-write safety counters.
6. `vh:agent:write-preview` proves the guarded branch flow in dry-run mode. By default it plans a deterministic branch name and records zero branches, commits, pushes, PRs, and real issues.
7. `vh:path-scan` writes `.visual-hive/path-leak-scan.json` and fails if issue-facing artifacts expose local absolute paths.
8. Trusted workflows may run live issue publishing only after sanitized artifacts and handoff validation pass.

Real issue creation is only for trusted workflows or explicit guarded live smoke commands that consume sanitized artifacts and do not execute untrusted PR code. The local/default path creates zero real issues.

The dedicated trusted publisher workflow is `.github/workflows/visual-hive-trusted-publisher.yml`. It runs from `workflow_run`, downloads uploaded artifacts, scans issue-facing artifacts for local path leaks, and publishes eligible real candidates by dedupe fingerprint only from trusted repository contexts.

The default live lane is:

```bash
npm run vh:live-detect
```

It runs `visual-hive loop run`, `visual-hive loop derive-issues`, and `visual-hive loop lifecycle`. Issue candidates come from real reports, mutation survivors, coverage gaps, workflow findings, readiness blockers, and provider governance evidence. Synthetic seeded issues are isolated to the manual `Visual Hive Seeded Smoke` workflow and labeled `visual-hive/smoke`.

`vh:github-app:artifact-smoke` proves the same artifact handoff path locally. It derives the built Visual Hive product checkout from `VISUAL_HIVE_CLI`, runs the GitHub App workflow-run mock against this repo's `.visual-hive` directory, writes `.visual-hive/github-app-artifact-smoke/**`, and verifies `externalCallsMade: 0`, `networkCallsMade: 0`, `checkoutPerformed: false`, and `repoCodeExecuted: false`.

Guarded live issue publishing for first-class issue candidates is available, but blocked unless explicitly enabled:

```bash
VISUAL_HIVE_LIVE_GITHUB_ISSUE=true GH_TOKEN=... npm run vh:issues:publish:live
```

Rerunning the live publisher uses the issue dedupe fingerprint to update the same issue instead of creating duplicates. Active issues are labeled `visual-hive/still-active` and `visual-hive/ready-for-hive`; resolved candidates are labeled `visual-hive/resolved-candidate`. Visual Hive does not open repair PRs. Hive should consume the GitHub issues and `.visual-hive/hive/*` bead/work-order artifacts, then create repair PRs under Hive governance.

Optional live issue smoke is disabled by default:

```bash
npm run vh:live-issue-smoke
```

Without `VISUAL_HIVE_LIVE_GITHUB_ISSUE=true`, this writes `.visual-hive/live-issue-smoke.json` with `status: blocked` and makes zero network calls. To run a real smoke from a trusted non-PR context, set `VISUAL_HIVE_LIVE_GITHUB_ISSUE=true`, provide `GH_TOKEN` or `GITHUB_TOKEN`, and ensure `npm run vh:handoff-validate` passes first. The smoke creates or updates an issue labeled `visual-hive`, `hive/quality`, and `e2e-smoke` with title prefix `[Visual Hive smoke]`.

## Using Visual Hive On Another Real Repo

1. Build or install Visual Hive and point `VISUAL_HIVE_CLI` at the CLI if needed.
2. Add `visual-hive.config.yaml` with stable targets and contracts.
3. Add stable `data-testid` selectors for route shells, cards, forms, and critical actions.
4. Add a `localPreview` command target with install/build/serve/url.
5. Run `doctor`, `analyze`, and `recommend`.
6. Inspect `visual-graph-summary.md` and `visual-impact.json` to confirm Visual Hive understands the repo surfaces.
7. Seed baselines locally with non-CI mode.
8. Run strict CI mode to verify baselines.
9. Add mutation operators mapped to important contracts.
10. Add PR, scheduled, handoff, and full-run workflows with least-privilege permissions.
11. Enable trusted issue handoff only after artifacts are sanitized and validated.

## Demo Routes

```text
/
/scenarios
/contracts
/evidence
/integrations
/commands
/guarded
/component-lab
```

## Notes

The default route should stay healthy. Intentional failures belong in seeded routes, localStorage mutation hooks, Visual Hive mutation mode, or dedicated defect configs.
