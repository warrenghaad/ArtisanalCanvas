# Functionality Catalogue — Operating Model

This is the rulebook any agent (Replit Agent, Claude, Codex, or a person) follows when building a functionality catalogue for an app. It is app-agnostic. Each app adds its own brief in `catalogue/README.md`, which may narrow these rules but not loosen them.

The catalogue exists to answer, honestly and with evidence:

1. **What does this app do?** (functions, in everyday words)
2. **Does each function actually work?** (with dated evidence)
3. **What is only intended, designed, or imagined?** (kept visibly separate)
4. **How should all of that be explained and organized?** (decided with the owner)

The owner is usually not a developer. The detailed thinking on research, order, summaries, imaging, layout, and reporting is in `CONSIDERATIONS.md`; this file is the rulebook. Agents do the technical determination; the owner decides product intent, names, meaning, and tradeoffs.

---

## 1. Stages and checkpoints

Work moves through stages. **A checkpoint is a hard stop**: show the artifact, the evidence behind it, the open questions, and the proposed next step, then wait. Approval of one stage never authorizes the next build.

| Stage | What happens | Output | Stop |
|---|---|---|---|
| 0 Setup | Read the app brief, decisions, and existing agent instructions. Record conflicts. | Updated `RECONCILIATION.md` (or equivalent) | Ask the owner about conflicts that change scope |
| 1 Inventory | List sources *before* interpreting them. Run the inventory script. Fill the source ledger. | `sources.json`, `inventory/*.json` | — |
| 2 Pilot | Write **three** entries: one working behavior, one incomplete or unverified behavior, one design/reference-only item. | 3 entry files | **Checkpoint A**: does the pilot truthfully show what exists, what is intended, and what is unknown? |
| 3 Entries | Populate entries area by area, using the approved pilot as the pattern. | Entry files | — |
| — | Propose chapters, reading order, cross-links, with reasons and alternatives. | Ordering rationale | **Checkpoint B**: names, captions, grouping, and order, in plain language |
| 4 Layout | Write (not build) the page-type specification for desktop and mobile. | Layout spec (`catalogue-kit/templates/layout-spec.md` as the outline) | **Checkpoint C**: owner approves the written layout direction |
| 5 Handoff | Say what to reuse, adapt, map, or leave out, what data must be preserved, and which build tasks may resume. | Handoff note | Owner authorizes any build separately |

Small loops are fine: re-entering stage 3 to add entries after Checkpoint B does not need a new checkpoint unless names, grouping, or meaning change.

## 2. Roles (passes, not separate agents)

One **lead agent** owns scope, evidence reconciliation, and the conversation with the owner. The roles below are *passes* the lead performs in sequence. Describing a role does not mean spawning an agent, and no role is authorized to build application code.

| Pass | Does | Hands off |
|---|---|---|
| Source investigator | Traces each user-facing action through screen → action → service/storage → visible result. Reads incoming branches without merging them. | Source map; observed behavior; conflicting or missing evidence |
| Figma/reference reader | Walks every page of each linked design file down to relevant frames, components, variants, interactions, and responsive states. Uses the host's existing Figma procedure rather than inventing one. | Coverage rows per page/node; node links; what the design *proposes* vs what the app *has* |
| Catalogue editor | Names and explains functions in everyday language; writes literal captions; separates evidence from imagination. | Entries; terminology list; questions for the owner |
| Information & layout planner | Proposes reversible groupings, reading order, cross-links, and page types. | Ordering rationale; layout spec; alternatives where uncertain |
| Verification reviewer | Checks provenance, coverage, contradictory statuses, accessibility, and integration boundaries. | Findings; a readiness recommendation (never an implementation permission) |

## 3. Evidence rules

- **Every status needs dated evidence.** No evidence means `not-verified`.
- **`working` and `broken` need direct evidence**: someone ran it, a test exercises it, or the full code path was traced end to end. A design, filename, button, document claim, route, endpoint, or successful build alone is never enough. (The schema enforces this.)
- **Strength labels**: `direct` (exercises or shows the behavior), `indirect` (shows a part, e.g. an endpoint exists), `stated` (only says it is intended).
- **Missing access is not absence.** If you could not open something, the ledger row is `inaccessible` with the reason. Never write "does not exist" about something you could not inspect.
- **A sample is not complete.** Sampled sources are `partially-inspected`, and `limitations` says what was skipped.
- **Repo evidence records the commit** it was read at, so later reviews can tell what changed.
- **Incoming branches are evidence about the incoming branch only.** Code on another branch is `applicability: incoming`, not `in-app`.
- **Generated or fabricated numbers in the app** (placeholder counts, randomized progress) are never catalogue facts. Record them as a limitation.

## 4. The four separate axes

Never let one stand in for another.

| Axis | Values | Question it answers |
|---|---|---|
| `claimType` | observed · source-stated · proposed | What kind of claim is this? |
| `applicability` | in-app · incoming · reference-only · idea | Where does it live? |
| `status.state` | working · partial · broken · not-built · not-verified | Does it work, per dated evidence? |
| `designDecision` | undecided · proposed · approved · rejected · superseded | Has the owner approved how it is named, explained, or designed? |

Consequences:

- A reference-only design is `not-built`, never `broken`. It was never part of the app.
- An approved design can be `not-built`. A `working` function can still have an `undecided` design.
- An idea is always `claimType: proposed`.

## 5. Writing entries

Fields (see `schema/catalogue.ts`): id, title, one-line summary, user goal, audience, claim type, applicability, description, inputs, actions, outputs, surfaces, related functions, status (state, date, reviewer, evidence, note), evidence list, caption, design decision, open questions, optional provisional chapter, history.

- **Title**: what a person gets done, in everyday words ("Get AI feedback on a drawing"), not a component or route name.
- **One function, many surfaces**: if two screens do the same job, that is one entry with two surfaces (`same-function-different-surface`). Keep the evidence for that judgment.
- **Caption pattern**: *"[Visible surface or function] lets [user] [action] to produce [result]. [Current limitation, if any.]"* A caption describes the actual image or state and says where it came from. It never promises.
- **Open questions** are for things only the owner can answer (intent, meaning, priority), not technical facts the agent could check.
- **Illustrations** (examples that are not real facts) carry `illustrative: true`.

## 6. Records and memory boundaries

| Record | Where | Holds | Never holds |
|---|---|---|---|
| Source ledger | `catalogue/sources.json` | What was inspected, at what revision, how far | Interpretations |
| Inventory | `catalogue/inventory/` | Generated structural source maps per branch | Status judgments |
| Entries | `catalogue/entries/*.json` | The catalogue content, with evidence and history | Agent chatter |
| Decisions | `catalogue/decisions.json` | Owner decisions with rationale; proposals marked `proposed` | Agent decisions marked approved |
| Project instructions | `AGENTS.md`, `replit.md`, `catalogue/README.md` | Operating constraints and precedence | Raw audits |
| Agent memory | e.g. `.agents/memory/`, Claude memory | Short, durable, non-obvious decisions **with a link** to the canonical record | Audit dumps, task lists, copied sources, guessed product commitments |
| Skills | `catalogue-kit/skills/` | General procedures usable in any app | This app's taxonomy |

Canonical records live **in the git repository**, so every tool and every repo can read the same thing. Tool-local storage (Replit task files, chat memory) may point at them but is never the source of truth.

Only the owner approves decisions. Agents record proposals as `state: "proposed"`; the validator rejects an `approved` decision not made by `owner`.

## 7. Repeat review

1. Run `npx tsx catalogue-kit/scripts/inventory.ts --changed catalogue/inventory/<branch>.json <ref>` to list files changed since the last inventory.
2. Run `npx tsx catalogue-kit/scripts/validate.ts catalogue --recheck` to list entries whose evidence files changed.
3. Re-check only those claims. Add a new evidence item and a `history` line; **do not delete earlier evidence or rewrite earlier history**. Owner decisions are superseded with a new decision, never edited away.
4. Regenerate the inventory and commit it, so the next review has a baseline.

## 8. Stop conditions (any stage)

Stop and ask the owner when:

- a source conflicts with an owner decision, or two owner decisions conflict;
- the next step would change application code, routes, schemas, stored data, or branches;
- you would have to guess product intent, a name's meaning, or a priority;
- access to an in-scope source is missing;
- a stage's checkpoint is reached.

## 9. Language with the owner

Use everyday words. Explain a specialist term the first time it is needed, or avoid it. Ask the owner about intent and meaningful tradeoffs, not about things you can determine yourself. Show evidence, not confidence.
