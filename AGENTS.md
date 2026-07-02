# Agent Instructions

This repo is the live demo target for Visual Hive. Keep it small, deterministic, and useful for showing Visual Hive finding and routing real issues.

Use Node 22 and npm.

- The app is a React/Vite demo site.
- Visual Hive is invoked from the sibling `../vis-hive` checkout through the `vh:*` npm scripts.
- Playwright contracts remain the pass/fail oracle.
- Seeded issue routes should be opt-in through query params or Visual Hive mutation operators.
- Do not commit generated `.visual-hive` artifacts unless explicitly asked to produce baseline artifacts for a demo.
- Keep changes focused and easy to explain live.

Before handoff, run:

```bash
npm run build
npm run typecheck
npm run vh:doctor
npm run vh:plan
npm run vh:run
```
