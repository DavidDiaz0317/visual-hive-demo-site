# Visual Hive Live Loop Final Validation

This file is updated during the live-loop hardening pass. Rows must only be marked passing after the corresponding evidence exists.

| Capability | Evidence | Expected | Actual | Status |
| --- | --- | --- | --- | --- |
| Live detection workflow exists | `.github/workflows/visual-hive-live-detection.yml` | Workflow present | Present on `main` with read-only permissions and no issue creation | Pass |
| Live detection manual dispatch run | [Run 28922681444](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/28922681444) | Completed successfully | Completed successfully | Pass |
| Trusted publisher consumed live artifacts | [Run 28922845997](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/28922845997) | Created/updated issues from live artifacts | Completed successfully after live detection artifact upload | Pass |
| At least 3 seeded/current issues created or updated | [#9](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/9), [#10](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/10), [#11](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/11), [#12](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/12), [#13](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/13), [#14](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/14), [#15](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/15) | >= 3 live Visual Hive issues | 7 live Visual Hive issues | Pass |
| Duplicate prevention verified | Publisher rerun after [Run 28922681444](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/28922681444) | 0 duplicate issues | Issue count stayed at 7 and existing issues #9-#15 were updated | Pass |
| Issue bodies include required evidence | Issue #9-#15 bodies | Dedupe, affected surface, artifacts, validation command, guardrails | Present in generated live seeded issue bodies | Pass |
| Path scan passed | `.visual-hive/path-leak-scan.json` and live detection logs | `status: passed` | Path scan passed with 0 findings | Pass |
| MCP smoke passed | `.visual-hive/mcp-smoke.json` and live detection logs | `status: passed` | MCP smoke passed with 78 resources, 87 read tools, and 9 disabled execution tools | Pass |
| Hive export/beads/work-orders generated | `.visual-hive/hive/*` and live detection artifact | Export, beads, work orders exist | Hive export, beads, knowledge facts, knowledge graph, wiki index, issue context, repair work orders, and agent policy generated | Pass |
| Repair workflow exists | `.github/workflows/visual-hive-repair-agent.yml` | Workflow present | Present; trusted write workflow only, no untrusted PR execution | Pass |
| Repair PR opened | [PR #16](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/16) | At least one holdgated PR or exact blocker | Holdgated repair work-order PR opened for issue #9 | Pass |
| Visual Hive PR workflow validated repair PR | [Run 28923133590](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/28923133590) | Visual Hive PR ran | Manual read-only Visual Hive PR validation passed on repair branch | Pass |
| Lifecycle updater marked issue active/resolved | [Run 28923226592](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/28923226592), [Issue #9](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/9) | Still-active or resolved-candidate label/comment | Issue #9 has `visual-hive/still-active` and lifecycle status comment | Pass |

## Safety Summary

- Default/local Visual Hive runs create zero real GitHub issues.
- Live issue creation is isolated to trusted publishing workflows that consume sanitized artifacts.
- PR workflow uses `pull_request` plus manual dispatch, read-only permissions, and no secrets.
- No workflow uses `pull_request_target`.
- Repair workflow creates a holdgated work-order branch/PR only from explicit trusted execution; it does not auto-merge.
- GitHub Actions repository setting `can_approve_pull_request_reviews=true` was enabled so the trusted repair workflow can create PRs; default workflow permissions remain `read`.
