# Visual Hive Demo Site

This repository is the live demo target for Visual Hive. It is intentionally separate from the Visual Hive product repo so demos can create real app changes, Visual Hive artifacts, issues, and follow-up actions without touching the tool implementation.

The site exposes deterministic surfaces for Visual Hive to inspect:

- Dashboard, critical action, login guard, and demo badge selectors.
- API-backed fixture data and an explicit API error state.
- Preview image, target lanes, run timeline, coverage matrix, and artifact cards.
- Opt-in seeded issue routes for live failure demos.

## Requirements

- Node 22
- npm
- A sibling local checkout of Visual Hive at `../vis-hive`

Build Visual Hive first when its CLI changed:

```bash
npm run vh:build-source
```

## Run The Site

```bash
npm install
npm run build
npm run preview -- --port 4173 --strictPort
```

Open:

```text
http://127.0.0.1:4173/
```

## Seeded Issue Routes

These routes are opt-in and keep the default `/` route stable:

```text
http://127.0.0.1:4173/?issue=api-500
http://127.0.0.1:4173/?issue=empty-data
http://127.0.0.1:4173/?issue=mobile-overflow
http://127.0.0.1:4173/?issue=broken-image
http://127.0.0.1:4173/?issue=route-guard-bypass
```

## Visual Hive Commands

The `vh:*` scripts call the local Visual Hive CLI from `../vis-hive/packages/cli/dist/index.js`.

```bash
npm run vh:doctor
npm run vh:plan
npm run vh:run
npm run vh:mutate
npm run vh:triage
npm run vh:report
npm run vh:ui
```

Use the shorter live-demo path:

```bash
npm run vh:all
```

Generated `.visual-hive` files are ignored by default. Commit baseline artifacts only when the demo specifically needs reviewed baselines in git.
