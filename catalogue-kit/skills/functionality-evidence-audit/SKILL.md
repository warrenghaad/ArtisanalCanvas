---
name: functionality-evidence-audit
description: Build an evidence-backed inventory of what an app actually does. Use when asked to "catalogue the app's functionality", "what does this app do / what works", "audit features before a merge", "inventory a branch", or to fill a catalogue source ledger. Traces user-facing actions through screen, action, service/storage, and visible result, records evidence strength and dates, and separates missing access from inspected absence. Not a security review or code review, and never changes application code.
version: 0.1.0-draft
---

# Functionality evidence audit

Draft v0.1. Test it on the pilot (three entries) before relying on it broadly.

## Use when

- Starting or refreshing a functionality catalogue (stages 1–3 of `catalogue-kit/OPERATING_MODEL.md`).
- Comparing what two branches or repos can do before a merge or port.
- Someone asks "does X work?" and the answer should be recorded, not just said.

## Do not use for

- Security, performance, or code-quality review (use those skills).
- Building or fixing features. This skill observes and records only.
- Reading Figma in depth. Hand that to the host's Figma procedure (for example `figma-design-to-code` / `get_design_context` reading), then record its findings here.

## Inputs

- `catalogue/config.json`: code sources and their roles (primary / incoming / reference), constraints.
- `catalogue/sources.json`: the source ledger (create rows as you go).
- The app's brief `catalogue/README.md` and `catalogue/decisions.json`.
- Optional: an area or function to focus on.

## Procedure

1. **Bound the sources.** For every source in scope, make sure a ledger row exists before you interpret anything: branch, Figma file, document folder, asset, running app. States: `pending`, `inspected`, `partially-inspected` (with limitations), `inaccessible` (with the missing access), `irrelevant` (with the reason).
2. **Generate the structural map** for each code source:
   `npx tsx catalogue-kit/scripts/inventory.ts <ref> --out catalogue/inventory/<name>.json`
   This lists screens, endpoints, tables, services, and env vars with file and line. It is *indirect* evidence only.
3. **Find functions, not files.** Start from what a person tries to do on each screen. For each candidate function, trace:
   - **screen**: where it starts (route, page, viewer, Figma frame)
   - **action**: what the person does (click, type, upload, choose)
   - **service/storage**: what code runs and what is read or written
   - **result**: what the person sees afterwards
   Record each hop as evidence with `file`, `lines`, and `commit`.
4. **Decide one function or several.** Two surfaces doing the same job make one function. The same button doing different jobs in different contexts makes several functions. Write down why.
5. **Exercise it when you can.** Run the app and try the function. A successful run, or a test that exercises it, is `direct` evidence, and so is an end-to-end code trace with no unverified hop. Save a screenshot when it helps the caption. Note any precondition (seeded data, API key, login).
6. **Assign status from evidence only:**
   - `working`: direct evidence that the result appears
   - `partial`: some hops work; name the part that does not
   - `broken`: built, and exercising it fails (record the error)
   - `not-built`: no implementation in the inspected source
   - `not-verified`: something exists, nobody exercised it (the default)
7. **Watch for hollow UI.** Hard-coded counts, randomized progress, placeholder text, and buttons with no handler go into `status.note` as limitations, never into the catalogue as facts.
8. **Record conflicts.** If a document says one thing and the code does another, keep both as evidence (`stated` vs `direct`/`indirect`) and add an open question.
9. **Update the ledger** row for every source you touched, with date, scope, and limitations.
10. **Validate:** `npx tsx catalogue-kit/scripts/validate.ts catalogue`

## Outputs

- Ledger rows in `catalogue/sources.json`
- Inventory files in `catalogue/inventory/`
- Draft entries (or entry notes for the editor pass) with evidence and status
- A short list of unresolved conflicts and missing access

## Stop when

- you would need to change code, data, routes, schemas, or branches to continue;
- access is missing (record `inaccessible`, then report);
- evidence conflicts with an owner decision;
- the stage checkpoint is reached (pilot = three entries).
