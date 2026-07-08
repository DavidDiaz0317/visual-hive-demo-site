# Visual Hive Live Loop Runbook

## Local Real Loop

```bash
npm ci
npm run build
npm run typecheck
npm run vh:live-detect
```

`vh:live-detect` now runs the product loop:

1. analyze the repo
2. plan checks
3. seed and verify deterministic baselines
4. run mutation adequacy
5. generate evidence, verdict, Hive export, MCP, artifact index, and issue candidates
6. derive lifecycle evidence

It does not call seeded findings by default.

## Seeded Smoke

Seeded findings remain available only as a manual plumbing check:

```bash
npm run vh:live-seeded-issues
```

The `Visual Hive Seeded Smoke` workflow is manual only and labels its findings with `visual-hive/smoke`. Seeded smoke issues are not the normal live detection lane.

## GitHub Live Detection

Use the `Visual Hive Live Detection` workflow. It runs on `main`, on a six-hour schedule, and by manual dispatch. It uploads `.visual-hive` as `visual-hive-live-detection`.

## Trusted Issue Publication

`Visual Hive Trusted Publisher` is triggered by trusted Visual Hive workflow completion. It consumes sanitized `issues.json`, publishes all eligible active candidates, dedupes by fingerprint, and records created/updated/skipped counts.

The publisher remains dry-run for PR-origin runs. Active findings get `visual-hive/still-active` and `visual-hive/ready-for-hive`.

## Hive Handoff

`Visual Hive Hive Handoff` runs after trusted publishing and summarizes the bead/work-order packet that Hive should consume. It does not checkout code, call Hive APIs, create branches, or open PRs.

Expected Hive queue:

```text
GitHub issues labeled visual-hive/ready-for-hive and hive/quality
```

## Lifecycle Update

`visual-hive loop lifecycle` refreshes local lifecycle evidence. Active findings remain open with `visual-hive/still-active`; resolved candidates are labeled `visual-hive/resolved-candidate` and are not auto-closed unless trusted policy explicitly sets `VISUAL_HIVE_CLOSE_RESOLVED=true`.

Visual Hive validates; Hive repairs.
