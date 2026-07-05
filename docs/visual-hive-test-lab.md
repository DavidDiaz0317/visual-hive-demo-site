# Visual Hive Test Lab Notes

This demo repo is intentionally issue-rich while keeping the default route stable. The goal is to let Visual Hive show its full loop: select contracts, run Playwright evidence, inject mutations, create triage prompts, stage provider handoff, export Hive artifacts, and keep deterministic verdict authority inside Visual Hive.

## Covered Surfaces

| Surface | Demo route or command | Visual Hive feature |
| --- | --- | --- |
| App shell | `/` | selector contracts, screenshots, masked dynamic text |
| Seeded issues | `/scenarios?issue=<id>` | mutation adequacy and reproducible failures |
| API error | `/scenarios?issue=api-500` | error-state contracts and hidden-alert mutation |
| Empty data | `/?issue=empty-data` | data-state assertions |
| Mobile layout | mobile viewport screenshots | responsive visual drift and overflow mutation |
| Evidence | `/evidence` | report, mutation, verdict, and handoff artifacts |
| Integrations | `/integrations` | Hive, provider, GitHub, commandGroup explanations |
| Commands | `/commands` | operator-facing runbook surface |
| Guarded repair | `/guarded` | Hive repair policy without execution |
| Storybook | `/iframe.html?id=visual-hive-test-lab-fixtures--scenario-mutation-card&viewMode=story` | component target coverage |
| Mock API | `npm run mock-api -- --port 4274` | commandGroup service lifecycle |

## Built-In Mutation Operators

All current Visual Hive mutation operators have a visible target:

- `hide-critical-button`
- `force-login-on-demo`
- `remove-demo-badge`
- `api-500`
- `empty-data`
- `mobile-overflow`
- `route-guard-bypass`
- `hidden-error-banner`
- `broken-image`
- `removed-accessible-name`
- `theme-token-drift`
- `stale-loading-state`

Use query parameters for manual demos, for example:

```text
http://127.0.0.1:4173/scenarios?issue=api-500
http://127.0.0.1:4173/?issue=mobile-overflow
```

Visual Hive mutation runs use the same surfaces through the `visual-hive-mutation` localStorage hook injected by the Playwright adapter.

## Not Enabled By Default

- No paid visual provider upload is required.
- No real Hive Bead API call is made.
- No protected cluster or secret-backed environment is accessed.
- No trusted repair workflow executes code or opens repair branches.
- Generated `.visual-hive` artifacts stay ignored unless a demo explicitly commits reviewed baselines.
