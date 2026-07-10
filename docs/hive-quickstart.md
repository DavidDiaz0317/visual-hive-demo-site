# Hive + Visual Hive

This repository is managed by Hive with `comprehensive` coverage and `issues` automation authority. Visual Hive runs deterministic checks; Hive alone owns issues, repair branches, pull requests, merges, and closure. Hive keeps at most 1 managed findings active as GitHub issues at once; every additional finding remains durable as a bead until capacity is available.

## Operator commands

Set `HIVE_STATE_DIR` to the persistent Hive data directory, then run:

```sh
hive doctor --json
hive status --json
hive run --json
hive pause
hive resume
```

Default branch: `main`. Detected languages: TypeScript/JavaScript.
