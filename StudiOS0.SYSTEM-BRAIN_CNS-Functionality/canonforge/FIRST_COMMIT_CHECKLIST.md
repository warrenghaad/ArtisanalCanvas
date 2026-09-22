# CanonForge MVP 1–2 — first commit checklist

## Scope and architecture

- [ ] Confirm `canonforge/` remains an isolated Python subproject.
- [ ] Confirm no Academy, curriculum, eTextbook, learning, analytics, Studio, or server behavior changed.
- [ ] Confirm implemented scope is limited to local console, ingestion, task packets, and plan-mode work orders.
- [ ] Confirm task-agent execution, concept extraction, patch application, and repo integration remain deferred.

## Repository hygiene

- [ ] Add `.canonforge/` to the repository root `.gitignore` (included in this scaffold patch).
- [ ] Review `git diff --check`.
- [ ] Review `git status --short`; stage only intended CanonForge files and `.gitignore`.
- [ ] Confirm no generated database, logs, cache, virtual environment, or source cards are staged.

## Verification

- [ ] From `canonforge/`, create and activate Python 3.11+ virtual environment.
- [ ] Run `python -m pip install -e '.[dev]'`.
- [ ] Run `pytest`.
- [ ] Run `ruff check .`.
- [ ] Run `canonforge --help`.
- [ ] Run a smoke ingestion against a small fixture or temporary workspace.
- [ ] Run the repository-required `npm run check` to verify the existing TypeScript app remains intact.

## Commit

- [ ] Suggested commit: `feat(canonforge): add ingestion and planning MVPs`
- [ ] Record files changed, commands run, test results, architecture risks, and remaining MVP TODOs.
- [ ] Confirm no architecture guardrail was violated.
