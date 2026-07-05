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

Generated `.visual-hive` files are ignored by default. Baselines are seeded locally, then verified in CI mode.

## Common Commands

```bash
npm run vh:doctor
npm run vh:analyze
npm run vh:recommend
npm run vh:plan
npm run vh:run:seed
npm run vh:run:ci
npm run vh:mutate
npm run vh:triage
npm run vh:evidence
npm run vh:verdict
npm run vh:handoff
npm run vh:handoff-validate
npm run vh:snapshot
npm run vh:artifacts
```

Use `npm run vh:cli -- --help` to inspect the resolved Visual Hive CLI.

## PR-Safe Checks

The PR workflow runs with `contents: read`, no secrets, and no `pull_request_target`. It builds Visual Hive from `DavidDiaz0317/visual-hive`, runs local deterministic checks, writes evidence artifacts, and uploads `.visual-hive`.

Run the PR-safe path locally:

```bash
npm run vh:doctor
npm run vh:plan
npm run vh:run:seed
npm run vh:run:ci
npm run vh:triage
npm run vh:evidence
npm run vh:handoff
npm run vh:artifacts
```

## Scheduled And Deep Checks

Scheduled/manual workflows add mutation adequacy, provider dry-run planning, handoff validation, test-creation planning, and Control Plane snapshots. Provider uploads, Hive API calls, and live issue creation remain disabled unless a trusted workflow explicitly enables them.

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

## Issue Handoff

```bash
npm run vh:handoff
npm run vh:handoff-dry-run
```

The dry run simulates create/update/block behavior with `networkCallsMade: 0`. Real issue creation is only for trusted workflows that consume sanitized artifacts and do not execute untrusted PR code.

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
6. Seed baselines locally with non-CI mode.
7. Run strict CI mode to verify baselines.
8. Add mutation operators mapped to important contracts.
9. Add PR, scheduled, handoff, and full-run workflows with least-privilege permissions.
10. Enable trusted issue handoff only after artifacts are sanitized and validated.

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
