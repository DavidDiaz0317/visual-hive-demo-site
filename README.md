# Visual Hive Demo Site

This repository is the live demo target for Visual Hive. It is intentionally separate from the Visual Hive product repo so demos can create real app changes, Visual Hive artifacts, issues, and follow-up actions without touching the tool implementation.

The app is now a Visual Hive Test Lab: a deterministic developer-tooling dashboard with opt-in seeded issues, local service targets, Storybook fixtures, GitHub workflow templates, provider dry-run paths, and Hive export/guarded repair surfaces.

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

## Demo Routes

```text
/
/scenarios
/contracts
/evidence
/integrations
/commands
/guarded
/component-lab
```

## Seeded Issue Routes

The default route is healthy. These routes are opt-in and intentionally demonstrate failures:

```text
http://127.0.0.1:4173/scenarios?issue=hide-critical-button
http://127.0.0.1:4173/scenarios?issue=force-login-on-demo
http://127.0.0.1:4173/scenarios?issue=remove-demo-badge
http://127.0.0.1:4173/scenarios?issue=api-500
http://127.0.0.1:4173/?issue=empty-data
http://127.0.0.1:4173/?issue=mobile-overflow
http://127.0.0.1:4173/scenarios?issue=route-guard-bypass
http://127.0.0.1:4173/scenarios?issue=hidden-error-banner
http://127.0.0.1:4173/?issue=broken-image
http://127.0.0.1:4173/scenarios?issue=removed-accessible-name
http://127.0.0.1:4173/scenarios?issue=theme-token-drift
http://127.0.0.1:4173/scenarios?issue=stale-loading-state
```

## Visual Hive Commands

Fast live-demo path:

```bash
npm run vh:doctor
npm run vh:plan
npm run vh:run
npm run vh:mutate
npm run vh:triage
npm run vh:report
```

Safe acceptance suite:

```bash
npm run vh:all
```

Broader feature commands include:

```bash
npm run vh:analyze
npm run vh:recommend
npm run vh:coverage
npm run vh:contracts
npm run vh:flows
npm run vh:targets
npm run vh:workflows
npm run vh:providers
npm run vh:evidence
npm run vh:verdict
npm run vh:handoff
npm run vh:hive-export
npm run vh:hive-modes
npm run vh:tools
npm run vh:mcp
```

## Extra Targets

Command group target:

```bash
npm run vh:run:fullstack
```

Storybook target:

```bash
npm run storybook
npm run vh:run:storybook
```

## Coverage Notes

See [docs/visual-hive-test-lab.md](docs/visual-hive-test-lab.md) for the feature coverage matrix, seeded issue catalog, and not-enabled-by-default list.

Generated `.visual-hive` files are ignored by default. Commit baseline artifacts only when the demo specifically needs reviewed baselines in git.
