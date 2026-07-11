# Hive + Visual Hive Production Proof

This document records the July 10-11, 2026 production acceptance run against `DavidDiaz0317/visual-hive-demo-site`. The proof used real GitHub Actions, issues, branches, pull requests, required checks, merges, target-branch verification, issue reopening, and Hive-owned issue closure. No mock GitHub server satisfied any lifecycle acceptance step.

## Immutable versions

- Demo target after the released setup upgrade: `43c93df84221a1881eb6e56239d82e52b851b922` (setup PR [`#141`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/141)); the external acceptance suite evaluated repaired application commit `7e0550f8a20ccb77b1b36aed6cd55fb810686ce6`.
- Visual Hive runtime: `f67f936fe9a75c250a908e16806ef3b714a1478a`, published as [`v0.2.2`](https://github.com/DavidDiaz0317/visual-hive/releases/tag/v0.2.2). Release workflow [`29136097825`](https://github.com/DavidDiaz0317/visual-hive/actions/runs/29136097825) built, smoke-tested, checksummed, and attested the bundle.
- Hive integrated release: `eb9f83dd3e034c896d0a1792e5a2013ce640d45f`, published only from the fork as [`v0.3.1-integrated.8`](https://github.com/DavidDiaz0317/hive/releases/tag/v0.3.1-integrated.8). Release workflow [`29136343157`](https://github.com/DavidDiaz0317/hive/actions/runs/29136343157) built, checksummed, and attested Linux and Windows distributions.
- Bundled runtimes: Visual Hive `0.2.2`, Node `v22.23.1`, Windows x64 and glibc Linux x64.

Hive changes were pushed only to `DavidDiaz0317/hive`. No upstream `kubestellar/hive` pull request remains open.

## Clean installation transcript

Windows used the public release, with no local release directory and no attestation bypass:

```text
gh attestation verify hive-integrated-v0.3.1-integrated.8-windows-amd64.zip --repo DavidDiaz0317/hive
Hive v0.3.1-integrated.8 installed at <clean-windows-directory>
visual-hive --version => 0.2.2
distribution hive_commit => eb9f83dd3e034c896d0a1792e5a2013ce640d45f
distribution visual_hive_commit => f67f936fe9a75c250a908e16806ef3b714a1478a
distribution files => 276; Visual Hive files => 270; bundled schemas => 84
hive setup ... => setup PR: #141; exact-head check: 29136605458
hive doctor --json => production_ready: true
```

Pristine Ubuntu 24.04 used the public Linux release with Git and GitHub CLI installed, but without Go, Node, npm, Docker-in-container, or a Visual Hive checkout:

```text
hive-integrated-v0.3.1-integrated.8-linux-amd64.tar.gz: OK
Hive v0.3.1-integrated.8 installed at /opt/hive
visual-hive release manifest => 0.2.2 at f67f936fe9a75c250a908e16806ef3b714a1478a
bundled schemas => 84 schemas, 219 checks, 0 failures
```

Both installers verified GitHub build provenance, archive checksums, platform identity, safe paths, file sizes, and every per-file SHA-256 entry before activation. The packaged release also installs the Codex `/hive` skill. Git and a current `gh` are prerequisites; Alpine/musl is not supported by the official bundled Node runtime.

## One-command setup and continuous operation

The installed command inspected React, TypeScript, Playwright, Storybook, npm scripts, existing workflows, branch protection, permissions, high-risk paths, and reviewed baselines. It generated the comprehensive 13-layer repository plan and created setup PR [`#128`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/128). Re-running setup reused the merged PR and produced no duplicate setup PR. Later generator hardening used reviewed setup PRs [`#130`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/130) and [`#131`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/131).

The released scheduler runs from the installed `.8` distribution at a 15-minute interval. `hive status --json` reports its process identity, exact executable, `production_ready: true`, current attempt, last successful hosted run, and next scheduled run. Setup and production workflows are read-only, secret-free for target code, SHA-pin every third-party Action, and pin Visual Hive to its exact commit.

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

## Reviewed baseline and current closure proof

Hive selected the genuine `missing_mobile_viewport` finding with repository fingerprint `52fd3562b7fdd90c028564443f0799a623663b5f57632b21691f9aee21821c97` and reused existing issue [`#59`](https://github.com/DavidDiaz0317/visual-hive-demo-site/issues/59), rather than creating a duplicate. A real Codex repair added the mobile `api-error-state-contract` screenshot to `visual-hive.config.yaml`.

The initial exact-head hosted run [`29116676219`](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/29116676219) failed only because the new cross-platform baselines did not yet exist. Hive did not approve them. It created separate draft, hold-labeled baseline PR [`#137`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/137) containing only two reviewed images. Their SHA-256 digests were `03607f01461550e344cf1f2dd75727bdaec37efc395de787fac405763e2c0118` for Linux and `db7fea310bafc8e7a3867dc9031cde4c909a2c40dbce164b84aa04716677d6cb` for Windows. Exact-head check [`29116774447`](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/29116774447) passed before manual review and merge as `ea8aa16321d7d6ee3cb6b69617afb939bc556443`.

Hive then resynchronized and revalidated the original repair. During this live recovery, GitHub exposed both an older cancelled and newer successful check with the same name. The production state machine was hardened to select the newest immutable check-run ID, preserve the same PR across no-change retries, reject marker reuse on another branch, and reconcile any legacy duplicate by exact marker/branch/head. Released `.5` closed superseded PR [`#136`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/136), deleted its exact branch, and retained one active repair PR.

Final repair PR [`#138`](https://github.com/DavidDiaz0317/visual-hive-demo-site/pull/138) changed only `visual-hive.config.yaml`. Exact head `53f2970ea294c6e4075039d85becb4d659fcd0e6` passed required check [`29119533624`](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/29119533624). Because configuration is outside the low-risk auto-merge allowlist, Hive durably held the PR for review. It was manually merged with an expected-head guard as `7e0550f8a20ccb77b1b36aed6cd55fb810686ce6`; issue #59 remained open.

Complete authoritative target run [`29121160007`](https://github.com/DavidDiaz0317/visual-hive-demo-site/actions/runs/29121160007) evaluated the affected contract at the exact merge, verified bundle `6b04e4d7-4901-407b-81d8-f2ddbf270067` with digest `c3335ec2c64b8c4f64c13160c7ebfb732208f76165f33b33c655758bc342532f`, and proved the finding absent. Hive then updated and closed issue #59 and bead `4cd000a3-d13`. Released `.7` cleanup logic, retained in `.8`, also recovered and deleted the legacy baseline branch at exact reviewed head `c0a0a95e0f4ac28b2ae778dbdbbc1844a98a54c3`; no `hive/baseline-*` or superseded repair ref remains.

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
{"action":"authorize_duplicate_repair_reconciled","allowed":true,"repository_fingerprint":"52fd...","detail":"closed superseded PR #136 and deleted exact branch; retained PR #138"}
{"action":"authorize_legacy_baseline_branch_reconciled","allowed":true,"repository_fingerprint":"52fd...","detail":"deleted exact merged proposal branch from PR #137"}
```

No credential values are stored in repository configuration, proof text, lifecycle records, daemon status, or audit excerpts.

## Verification results

- Visual Hive: Node 22; build passed; typecheck passed; 401/401 tests passed; lint passed; all 48 `demo:all` steps passed; schema catalog passed.
- Hive fork: `go build ./...`, `go test ./...`, and `go vet ./...` passed after the final lifecycle change; Linux race tests passed for automation, GitHub, repair, lifecycle, and integrated orchestration packages.
- Demo: the packaged `.8` Visual Hive CLI completed the 13-section external `vh:full-run` in 425.9 seconds with every section passing, including clean and seeded-defect runs, 12/12 mutation results, evidence/verdict generation, Hive handoff, issue/agent packets, MCP, tool registry, schema verification, and control plane. Hosted PR checks passed for all reviewed workflow changes; lifecycle import, recurrence, restart recovery, and closure passed.
- Installers: signed public `.8` Windows install passed; signed public `.8` Ubuntu 24.04 container install passed from a pristine environment without Go or Node. Both verified attestation, checksum, platform, and every manifest entry; the installed bundle verified all 84 schemas and 219 checks.
- Release Actions: all production Actions and third-party checkouts use immutable commit SHAs.

## Operational boundaries

- Visual Hive owns deterministic analysis, test planning, browser and mutation evidence, adapters, and verdicts. Hive is the only GitHub lifecycle writer in integrated mode.
- Playwright is the default local evidence source. ODiff and self-hosted Visual Regression Tracker are optional versioned supplemental adapters and cannot override the deterministic verdict. No paid provider is required.
- Models may propose tests and repairs from the versioned repository evidence and test-creation plan, but deterministic schemas, policy, exact-head checks, branch protection, risk/file allowlists, and target-branch verification remain authoritative.
- Workflow, baseline, authentication, security, deployment, secret, and dependency-major changes remain review-gated unless separately and explicitly authorized.
- Comprehensive analysis also retains non-gating test-plan and visual-coverage recommendations as internal `detected` backlog. With the proof's deliberate WIP limit of one, these are not temporary proof defects or duplicate GitHub issues; Hive can promote them incrementally when the operator raises capacity or selects a narrower plan.
