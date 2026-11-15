# CanonForge MVP 2

CanonForge is the local, review-first console described in
`docs/agentic-flows/canonforge-cli-architecture.md`. MVP 1 implements workspace
configuration, Markdown/text ingestion, SQLite run records, source-card output,
request translation, and Foreman work-order planning. It does not yet execute task
agents, extract concepts, or write repository patches.

## Install and run

From this directory:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
canonforge ingest ../docs/agentic-flows --workspace ..
canonforge plan "organize these primitive grammar notes" --target ../docs/sacred-geometry
canonforge runs --workspace ..
canonforge status --workspace ..
```

`canonforge chat --workspace ..` opens a small local console. It supports
`ingest <path>`, `plan <request>`, `status`, `runs`, `help`, and `exit`.

## MVP 2 planning loop

```text
user request
  -> HITL Translator task packet
  -> scoped instruction records
  -> Foreman work order
  -> review artifacts
  -> no file write
```

Each plan is stored in SQLite and emitted as `task-packet.yaml`,
`work-order.yaml`, and `foreman-result.yaml` beneath its run log. An unresolved
target forces plan mode and appears as a decision for the user.

## Local state

The first command creates the configured directories beneath the workspace:

```text
.canonforge/
  config.yaml            # optional; defaults are used when absent
  runs.sqlite
  logs/
    <run-id>/
      source-cards/
  patches/
  cache/
  inbox/
```

Generated `.canonforge/` state is local runtime data and should not be committed.
Copy `examples/config.yaml` to `<workspace>/.canonforge/config.yaml` to customize it.

## Scope boundary

Ingestion accepts `.md`, `.markdown`, and `.txt` files. Directories are scanned
recursively in deterministic path order. Unsupported files and anything inside a
`.canonforge` directory are ignored. Input files are read but never modified.
