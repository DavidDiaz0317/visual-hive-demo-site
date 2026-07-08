# Visual Hive Repair Work Order live-seeded-force-login-on-demo

- Source issue: #9
- Dedupe fingerprint: visual-hive:contract_result:live-seeded-force-login-on-demo
- Seeded finding: force-login-on-demo
- Repair mode: holdgated deterministic work-order PR
- Validation command: `npm run vh:plan && npm run vh:run:ci`

## Guardrails

- Do not approve baselines blindly.
- Do not weaken screenshot thresholds, selector contracts, mutation thresholds, or workflow safety gates.
- Visual Hive remains the deterministic validation layer.
- This PR is a repair work-order handoff and must be reviewed before merge.

## Next Human/Hive Action

Inspect the linked issue evidence, implement the UI/config repair if appropriate, and rerun Visual Hive validation before removing the hold label.
