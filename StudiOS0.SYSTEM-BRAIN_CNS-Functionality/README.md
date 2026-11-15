# StudiOS0.SYSTEM-BRAIN_CNS-Functionality

This folder is the StudiOS system-brain and central nervous system functionality
boundary. It provides a stable home for local intelligence, ingestion,
orchestration, run-state, and controlled repository-editing capabilities that can
serve more than one StudiOS surface.

## Current functionality

```text
StudiOS0.SYSTEM-BRAIN_CNS-Functionality/
  canonforge/
    pyproject.toml
    src/canonforge/
    tests/
    examples/
```

The nested CanonForge package is the canonical implementation and now includes MVP 2:

- Typer and Rich local console
- workspace configuration loading
- Markdown and text ingestion
- SQLite run and source records
- YAML source-card output
- HITL Translator task packets
- scoped instruction records
- Foreman work orders and review artifacts
- tests and first-commit checklist

CanonForge remains review-first. It reads source material and writes only local
`.canonforge/` runtime state; it does not yet alter canon documents or execute task
agents.

## Run

```bash
cd StudiOS0.SYSTEM-BRAIN_CNS-Functionality/canonforge
python -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
pytest
canonforge --help
```

The system-wide GitHub role is documented in
`docs/agentic-flows/studios-system-brain-hub-spoke-role.md`.
