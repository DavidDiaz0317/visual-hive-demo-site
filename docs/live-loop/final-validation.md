# Visual Hive Live Loop Final Validation

This file is updated during the live-loop hardening pass. Rows must only be marked passing after the corresponding evidence exists.

| Capability | Evidence | Expected | Actual | Status |
| --- | --- | --- | --- | --- |
| Live detection workflow exists | `.github/workflows/visual-hive-live-detection.yml` | Workflow present | Pending validation | Pending |
| Live detection manual dispatch run | GitHub Actions run URL | Completed successfully | Pending validation | Pending |
| Trusted publisher consumed live artifacts | Trusted publisher summary artifact | Created/updated issues from live artifacts | Pending validation | Pending |
| At least 3 seeded/current issues created or updated | GitHub issue URLs | >= 3 live Visual Hive issues | Pending validation | Pending |
| Duplicate prevention verified | Second publisher run issue count | 0 duplicate issues | Pending validation | Pending |
| Issue bodies include required evidence | Issue bodies | Dedupe, affected surface, artifacts, validation command, guardrails | Pending validation | Pending |
| Path scan passed | `.visual-hive/path-leak-scan.json` | `status: passed` | Pending validation | Pending |
| MCP smoke passed | `.visual-hive/mcp-smoke.json` | `status: passed` | Pending validation | Pending |
| Hive export/beads/work-orders generated | `.visual-hive/hive/*` | Export, beads, work orders exist | Pending validation | Pending |
| Repair workflow exists | `.github/workflows/visual-hive-repair-agent.yml` | Workflow present | Pending validation | Pending |
| Repair PR opened | PR URL | At least one holdgated PR or exact blocker | Pending validation | Pending |
| Visual Hive PR workflow validated repair PR | PR checks | Visual Hive PR ran | Pending validation | Pending |
| Lifecycle updater marked issue active/resolved | Lifecycle workflow/comment/label | Still-active or resolved-candidate label/comment | Pending validation | Pending |
