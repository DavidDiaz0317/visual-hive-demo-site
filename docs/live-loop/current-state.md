# Visual Hive Live Loop Current State

The demo site now has two Visual Hive lanes:

- `vh:full-run` remains the clean local proof harness. It proves a seeded failure and then restores clean artifacts.
- `vh:live-detect` plus `vh:live-seeded-issues` is the persistent live lane. It keeps active seeded/current findings as issue candidates for trusted publishing.

The live lane creates issue candidates for:

- `force-login-on-demo`
- `mobile-overflow`
- `api-500`
- `empty-data`
- `hidden-error-banner`
- `route-guard-bypass`
- `theme-token-drift`

The trusted publisher publishes from `workflow_run` artifacts only. It does not execute PR code and it does not publish from untrusted PR runs.

## Safety boundaries

- PR workflow: read-only, no secrets, no issue creation.
- Live detection workflow: main/schedule/manual, uploads artifacts, does not create issues directly.
- Trusted publisher: downloads sanitized artifacts and creates/updates issues by dedupe fingerprint.
- Repair workflow: guarded, opens holdgated PRs only from Visual Hive issues labeled ready for repair or manual dispatch.
- Visual Hive remains the deterministic validation layer; Hive/agents consume issues and work orders.
