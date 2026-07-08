# Visual Hive Live Loop Runbook

## Local proof

```bash
npm ci
npm run build
npm run typecheck
npm run vh:live-detect
npm run vh:live-seeded-issues
npm run vh:live-issue-loop-smoke -- --verify-only
```

`vh:live-issue-loop-smoke` without `--verify-only` runs the whole live chain locally with bounded timeouts.

## GitHub live detection

Use the `Visual Hive Live Detection` workflow. It runs on `main`, on a six-hour schedule, and by manual dispatch. It uploads the `.visual-hive` artifact as `visual-hive-live-detection`.

## Trusted issue publication

`Visual Hive Trusted Publisher` is triggered by trusted Visual Hive workflow completion. It publishes multiple allowed active candidates from `Visual Hive Live Detection`, dedupes by fingerprint, and records created/updated/skipped counts.

The publisher remains dry-run for PR-origin runs.

## Repair PR path

Run `Visual Hive Repair Agent` manually with an issue number, or label a Visual Hive issue with `visual-hive/ready-for-repair`. The workflow creates a holdgated branch and PR, links the issue, and records the Visual Hive validation command. It does not auto-merge.

## Lifecycle update

`Visual Hive Issue Lifecycle` refreshes issue labels/comments from live artifacts. Active findings remain open with `visual-hive/still-active`; resolved candidates are labeled `visual-hive/resolved-candidate` and are not auto-closed.
