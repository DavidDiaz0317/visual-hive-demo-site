# Visual Hive Live Loop Validation

This file tracks the current real-loop validation target. Rows should only be marked passing after the corresponding evidence exists for the current workflow generation.

| Capability | Evidence | Expected | Status |
| --- | --- | --- | --- |
| Real live detection workflow exists | `.github/workflows/visual-hive-live-detection.yml` | Runs `vh:live-detect`, not seeded issue generation | Pending current run |
| Seeded smoke is separate | `.github/workflows/visual-hive-seeded-smoke.yml` | Manual-only synthetic plumbing lane labeled `visual-hive/smoke` | Pending current run |
| Trusted publisher exists | `.github/workflows/visual-hive-trusted-publisher.yml` | Consumes sanitized artifacts, publishes all eligible candidates by dedupe | Pending current run |
| Hive handoff exists | `.github/workflows/visual-hive-hive-handoff.yml` | Exports issue/bead/work-order context, opens no PRs | Pending current run |
| Repair PR workflow removed | `.github/workflows/visual-hive-repair-agent.yml` | Visual Hive does not create repair branches or PRs | Pending current run |
| Path scan passes | `.visual-hive/path-leak-scan.json` | No local absolute paths in issue-facing artifacts | Pending current run |
| Issue candidates are real | `.visual-hive/issues.json` | Candidates come from report/mutation/coverage/workflow/readiness/provider evidence, not seeded smoke | Pending current run |
| Lifecycle policy recorded | `.visual-hive/loop-lifecycle.json` | Active, resolved-candidate, suppressed counts and no default auto-close | Pending current run |

## Safety Summary

- Default/local Visual Hive runs create zero real GitHub issues.
- Live issue creation is isolated to trusted publishing workflows that consume sanitized artifacts.
- PR workflow uses `pull_request`, read-only permissions, and no secrets.
- No workflow uses `pull_request_target`.
- Visual Hive no longer owns a repair PR workflow in this repo.
- Hive should consume issues labeled `visual-hive/ready-for-hive` and `hive/quality`.
- Visual Hive validates; Hive repairs.
