# Agent Instructions

This repo is the live demo target for Visual Hive. Keep it small, deterministic, and useful for showing Visual Hive finding and routing real issues.

Use Node 22 and npm.

- The app is a React/Vite demo site.
- Visual Hive is invoked through `scripts/visual-hive-cli.mjs`, which supports `VISUAL_HIVE_CLI`, sibling `../visual-hive`, sibling `../vis-hive`, and an installed package binary. Do not reintroduce a single hardcoded sibling path.
- Visual Hive owns the final deterministic verdict. Playwright is the default local browser runner and primary local evidence source.
- Seeded issue routes should be opt-in through query params or Visual Hive mutation operators.
- The default route should stay healthy; intentional failures belong in scenario routes, localStorage mutation hooks, or dedicated Visual Hive mutation runs.
- Provider and Hive integrations should stay dry-run/no-network unless a demo explicitly enables trusted secrets.
- Do not commit generated `.visual-hive` artifacts unless explicitly asked to produce baseline artifacts for a demo.
- Keep changes focused and easy to explain live.

Before handoff, run:

```bash
npm run build
npm run typecheck
npm run vh:doctor
npm run vh:plan
npm run vh:run:seed
npm run vh:run:ci
npm run vh:mutate
npm run vh:triage
npm run vh:report
```

For full external-repo acceptance, run `npm run vh:full-run` with a sensible timeout.
