# Visual Hive Live Loop Current State

The demo site now has three distinct Visual Hive lanes:

- `vh:full-run` is the full local proof harness. It proves clean deterministic checks, seeded defect handling, mutation adequacy, evidence, handoff, agent packets, MCP, and Control Plane artifacts without creating real issues or PRs.
- `vh:live-detect` is the real persistent live lane. It runs `visual-hive loop run`, derives issue candidates from actual artifacts, and writes lifecycle evidence.
- `Visual Hive Seeded Smoke` is a manual-only workflow for synthetic issue plumbing. It is not the default live detection path.

The live lane creates issue candidates only from real artifacts:

- failed deterministic contracts
- visual diffs or missing baselines
- mutation survivors
- coverage and maintenance findings
- workflow safety findings
- target/readiness blockers
- provider blocks when a provider is explicitly enabled

The trusted publisher publishes from `workflow_run` artifacts only. It does not execute PR code and it does not publish from untrusted PR runs.

## Safety Boundaries

- PR workflow: read-only, no secrets, no issue creation.
- Live detection workflow: main/schedule/manual, uploads artifacts, does not create issues directly.
- Trusted publisher: downloads sanitized artifacts and creates/updates issues by dedupe fingerprint.
- Hive handoff workflow: exports the issue/bead/work-order packet for Hive and opens no branches or PRs.
- Visual Hive validates; Hive repairs.
