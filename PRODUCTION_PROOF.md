# Hive + Visual Hive Production Proof

This document records the July 10, 2026 production acceptance run against `DavidDiaz0317/visual-hive-demo-site`. The proof used real GitHub Actions, issues, branches, pull requests, required checks, merges, target-branch verification, issue reopening, and Hive-owned issue closure. No mock GitHub server satisfied any lifecycle acceptance step.

## Immutable versions

- Demo target after lifecycle hardening: `3f8b3864d103b6fd3615dce26346195abcabe7cf`.
- Visual Hive runtime: `59ca827ea5955bcd4459eb9ae203e9703533226a`, published as [`v0.2.0`](https://github.com/DavidDiaz0317/visual-hive/releases/tag/v0.2.0). Release workflow [`29105468583`](https://github.com/DavidDiaz0317/visual-hive/actions/runs/29105468583) built, smoke-tested, checksummed, and attested the bundle.
- Hive integrated release: `d14b31266475c093d45631ac60c0676d68a0bbd7`, published only from the fork as [`v0.3.0-integrated.3`](https://github.com/DavidDiaz0317/hive/releases/tag/v0.3.0-integrated.3). Release workflow [`29106186941`](https://github.com/DavidDiaz0317/hive/actions/runs/29106186941) built and attested Linux and Windows distributions.
- Final Hive fork branch, including release-smoke documentation: `5c026896a1fae5c5dfca1eefccc9ce7a8f7f525d`.
- Post-release Visual Hive branch test isolation fix: `62afb06f0e9c7f53f3e0cba1f9c7caa22f0c92b7`; push and PR-context CI are green.
- Bundled runtimes: Visual Hive `0.2.0`, Node `v22.23.1`, Windows x64 and glibc Linux x64.

Hive changes were pushed only to `DavidDiaz0317/hive`. No upstream `kubestellar/hive` pull request remains open.

## Clean installation transcript

Windows used the public release, with no local release directory and no attestation bypass:

```text
gh attestation verify hive-integrated-v0.3.0-integrated.3-windows-amd64.zip --repo DavidDiaz0317/hive
Hive v0.3.0-integrated.3 installed at <clean-windows-directory>
visual-hive --version => 0.2.0
distribution hive_commit => d14b31266475c093d45631ac60c0676d68a0bbd7
distribution visual_hive_commit => 59ca827ea5955bcd4459eb9ae203e9703533226a
hive setup ... => idempotent: true, setup PR: #131
hive doctor --json => production_ready: true
```

Pristine Ubuntu 24.04 used the public Linux release with Git and GitHub CLI installed, but without Go, Node, npm, Docker-in-container, or a Visual Hive checkout:

```text
hive-integrated-v0.3.0-integrated.3-linux-amd64.tar.gz: OK
Hive v0.3.0-integrated.3 installed at /proof/installed
visual-hive --version => 0.2.0
hive setup --plan --json => schema hive.setup-plan.v1, read_only: true
Signed Linux integrated installer smoke passed: /proof
```

Both installers verified GitHub build provenance, archive checksums, platform identity, safe paths, file sizes, and every per-file SHA-256 entry before activation. The packaged release also installs the Codex `/hive` skill. Git and a current `gh` are prerequisites; Alpine/musl is not supported by the official bundled Node runtime.

## One-command setup and continuous operation

The installed command inspected React, TypeScript, Playwright, Storybook, npm scripts, existing workflows, branch protection, permissions, high-risk paths, and reviewed baselines. It generated the comprehensive 13-layer repository plan and created setup PR [`#128`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/128). Re-running setup reused the merged PR and produced no duplicate setup PR. Later generator hardening used reviewed setup PRs [`#130`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/130) and [`#131`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/131).

The released scheduler is running from the installed distribution. `hive status --json` reports the process identity, `production_ready: true`, last successful run [`29106405829`](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/29106405829), and the next scheduled run. Setup and production workflows are read-only, secret-free for target code, SHA-pin every third-party Action, and pin Visual Hive to its exact commit.

## Real issue, agent, PR, merge, and closure lifecycle

The repository-specific Unit test adequacy finding used stable fingerprint `937f51e850c541495ecbf64b738f0720ee6cee100a339453168574e2735db9ea` and GitHub issue [`#121`](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/121).

1. Issues-only authority opened the real issue and did not create a branch or PR.
2. Repair-PR authority dispatched the real Codex worker, created an isolated worktree/branch, added `test/run-with-env.test.mjs`, committed it, and opened [`PR #123`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/123). Hive could not merge while configured below L6.
3. After explicit L6 authority, exact head `f6e260991316d1c4053000c381f109f2796e542a` passed required check [`29094397183`](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/29094397183); Hive merged it as `da1b6aecc57ddcc9e157c0b8720ccb2512a31239`.
4. Hive refused premature resolution until an authoritative complete target-branch run evaluated `testing-layer:2`. A verified non-conflicting descendant was accepted only after ancestry and changed-file checks, then Hive closed the issue and durable bead.
5. The same bounded finding recurred. Hive reopened issue #121 instead of creating a duplicate, retained the same bead/fingerprint, and created a new repair attempt in [`PR #127`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/127).
6. Exact head `bb33f8aa7a2575a4674b5cd486e4b57c36ae2add` passed required check [`29098101275`](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/29098101275). Hive merged it as `03f7c12b180df7a50e1a6c9ffcaa75240a84ad35`.
7. Complete target verification [`29098791412`](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/29098791412) proved the finding absent; Hive updated and closed issue #121. A duplicate-free rerun produced no second issue, bead, branch, or PR.

Hive was restarted during an active repair and recovered the persisted attempt without duplicating the issue, bead, or PR. Retry-budget denial was recorded before the bounded replacement attempt was authorized; no threshold, baseline, assertion, workflow protection, or security gate was weakened.

## Workflow-safety closure proof

Authoritative scans identified a genuine low-risk workflow evidence gap as issue [`#85`](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/85). Verified evidence did not authorize a safe model patch, so Hive held it for human workflow review while keeping the scheduler healthy and creating no repair branch or PR. The reviewed fixes were delivered through demo PR [`#129`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/129) and Hive setup PRs #130/#131.

The first clean scan correctly refused closure because the bundle had not declared the repository-level workflow audit as an evaluated resolution scope. After the protocol was corrected, authoritative run [`29106405829`](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/29106405829) declared `workflow-safety`, contained no workflow finding, and evaluated exact demo commit `3f8b3864d103b6fd3615dce26346195abcabe7cf`. Hive then updated issue #85 with bundle `b2716dca-8b98-4072-b62a-5ca30de8b77f`, digest `de4c932d045b3a624b8f773a39b0d825ab09e25eedae1a7db1674309713b6dee`, the verification URL, and closed both the issue and bead `a0b8e8b3-4a3`. No demo PR remains open.

## Persistence, deduplication, and hostile evidence

Lifecycle state, outbox state, daemon state, issue/PR links, attempts, merge SHAs, and verification runs survived process restarts. Exact replay produced no duplicate mutation. Tests and production import rejected partial, changed-files-only, failed, cancelled, stale-run, expired, tampered, cross-repository, symlinked, oversized, traversal, secret-containing, and replay-collision evidence. Missing affected-contract execution could not close an issue.

Redacted append-only audit excerpts:

```jsonl
{"action":"authorize_merge_pr","allowed":true,"repository":"DavidDiaz0317/visual-hive-demo-site","repository_fingerprint":"937f..."}
{"action":"pr_merged","allowed":true,"repository":"DavidDiaz0317/visual-hive-demo-site","repository_fingerprint":"937f..."}
{"action":"reopen_issue","allowed":true,"repository":"DavidDiaz0317/visual-hive-demo-site","repository_fingerprint":"937f..."}
{"action":"infer_absent_finding","allowed":false,"repository_fingerprint":"e6bc...","detail":"finding has no affected contract that can be proven evaluated"}
{"action":"infer_absent_finding","allowed":true,"repository_fingerprint":"e6bc...","detail":"omitted from exhaustive evaluated-contract inventory"}
{"action":"authorize_close_issue","allowed":true,"repository_fingerprint":"e6bc..."}
{"action":"issue_closed","allowed":true,"repository_fingerprint":"e6bc..."}
```

No credential values are stored in repository configuration, proof text, lifecycle records, daemon status, or audit excerpts.

## Verification results

- Visual Hive: Node 22; build passed; typecheck passed; 400/400 tests passed; lint passed; all 48 `demo:all` steps passed; schema catalog passed 84 schemas and 219 checks.
- Hive fork: `go build ./...`, `go test ./...`, and `go vet ./...` passed after the final lifecycle change.
- Demo: build and typecheck passed locally; hosted PR checks passed for all reviewed workflow changes; complete deterministic runs, strict baselines, mutation proof, test-creation planning, evidence bundling, provenance verification, lifecycle import, recurrence, restart recovery, and closure passed.
- Installers: signed public Windows install passed; signed public Ubuntu install and read-only setup plan passed; local clean Windows/Linux distribution smokes also passed.
- Release Actions: all production Actions and third-party checkouts use immutable commit SHAs.

## Operational boundaries

- Visual Hive owns deterministic analysis, test planning, browser and mutation evidence, adapters, and verdicts. Hive is the only GitHub lifecycle writer in integrated mode.
- Playwright is the default local evidence source. ODiff and self-hosted Visual Regression Tracker are optional versioned supplemental adapters and cannot override the deterministic verdict. No paid provider is required.
- Models may propose tests and repairs from the versioned repository evidence and test-creation plan, but deterministic schemas, policy, exact-head checks, branch protection, risk/file allowlists, and target-branch verification remain authoritative.
- Workflow, baseline, authentication, security, deployment, secret, and dependency-major changes remain review-gated unless separately and explicitly authorized.
- Comprehensive analysis also retains non-gating test-plan and visual-coverage recommendations as internal `detected` backlog. With the proof's deliberate WIP limit of one, these are not temporary proof defects or duplicate GitHub issues; Hive can promote them incrementally when the operator raises capacity or selects a narrower plan.
