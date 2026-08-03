# Hive + Visual Hive

This repository is managed by Hive with `comprehensive` coverage and `repair-pr` automation authority. Visual Hive runs deterministic checks; Hive alone owns issues, repair branches, pull requests, merges, and closure. Hive keeps at most 5 managed findings active as GitHub issues at once and permits at most 4 bounded repair attempts per finding; every additional finding remains durable as a bead until capacity is available.

## Operator commands

The existing ordinary Hive/dashboard process owns this local Visual Hive repair runtime. Configure that same process with the exact `HIVE_STATE_DIR=/home/dev/.hive/repos/visual-hive-demo-sit-9dc5cb0fd012a413`, ensure its normal project scope includes `DavidDiaz0317/visual-hive-demo-site`, and confirm its existing dashboard listener is HTTP-ready. After setup succeeds, that running dashboard automatically reconciles and activates the installed contract without a restart. Do not use `hive run` or `hive start` for normal operation. Use `hive stop` only when `hive status` or `hive doctor` directs cleanup of a stale legacy scheduler; it does not stop ordinary Hive/dashboard. Run:

```sh
hive doctor --state-dir /home/dev/.hive/repos/visual-hive-demo-sit-9dc5cb0fd012a413 --json
hive status --state-dir /home/dev/.hive/repos/visual-hive-demo-sit-9dc5cb0fd012a413 --json
hive pause --state-dir /home/dev/.hive/repos/visual-hive-demo-sit-9dc5cb0fd012a413 --json
hive resume --state-dir /home/dev/.hive/repos/visual-hive-demo-sit-9dc5cb0fd012a413 --json
hive approve-merge --state-dir /home/dev/.hive/repos/visual-hive-demo-sit-9dc5cb0fd012a413 --pr NUMBER --head EXACT_HEAD_SHA --plan --json
hive approve-merge --state-dir /home/dev/.hive/repos/visual-hive-demo-sit-9dc5cb0fd012a413 --pr NUMBER --head EXACT_HEAD_SHA --base EXACT_BASE_SHA --diff-digest EXACT_DIFF_SHA256 --reason "reviewed exact path-held repair" --json
hive revoke-merge-approval --state-dir /home/dev/.hive/repos/visual-hive-demo-sit-9dc5cb0fd012a413 --reason "review withdrawn" --json
hive retry-repair --state-dir /home/dev/.hive/repos/visual-hive-demo-sit-9dc5cb0fd012a413 --finding FINGERPRINT --recurrence N --attempt N --failure-class infrastructure --failure-id FAILURE_ID --reason "dependency restored" --json
```

If status reports `workflow_dispatch_recovery`, use its exact `revoke_plan_command` (preferred for uncertain transport) or `retry_plan_command`; never delete the dispatch state manually.

Default branch: `main`. Detected languages: TypeScript/JavaScript.
