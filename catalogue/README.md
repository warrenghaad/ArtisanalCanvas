# ArtisanalCanvas functionality catalogue: operating brief

*Plain-language brief for the owner and for every agent doing catalogue work in this project. The owner can revise any of it; changes go into `decisions.json`.*

## What we're doing and why

ArtisanalCanvas exists to help people learn to design, compose, and decompose images and art. Two versions of the project have grown separately:

- **`main`**: the current Academy (drawing practice, curriculum, eTextbooks, analytics, AI drawing feedback, image studio, primitive library).
- **`warrenghaad`**: an earlier separate Replit project (geometry research studio, Prism cube, dock, curation dashboard).

To bring them together well, the owner first needs a clear, honest picture of **what each version actually does**. That picture is the functionality catalogue, presented like an eTextbook. The same approach will later be used for the owner's other projects.

## The three tiers, and where we are

| Tier | What | Status |
|---|---|---|
| 1. Template | Reusable eTextbook reading template: one combined Figma file + Storybook components | Waiting for the Figma links and the Card Stack design |
| 2. Functionality catalogue | Template + status, evidence, review history, and the rules (`catalogue-kit/`) | Draft written; revised after the pilot |
| 3. ArtisanalCanvas catalogue | This folder: real entries for this app | Setup done (sources, decisions, conflicts, inventories); no entries yet |

Current stage: **0 Setup** (see `config.json`).

## Who does what

- **Owner**: decides meaning, names, order, priorities; approves each checkpoint.
- **Claude** (in GitHub): writes the considerations, specs, prompts, skills, and rules; builds the combined Figma file; keeps the cross-project tools; reviews Replit's work against written acceptance criteria and explains the results in plain language.
- **Replit**: builds the template and catalogue screens, runs the app, researches functions, takes screenshots, writes entries, and wires the catalogue into the app once approved.

## What we know so far (from the inventories, not yet verified by use)

- `main` has **7 screens** (Academy, eTextbooks, Curriculum, Learning Hub, Analytics, Image Studio, Primitive Library), about **38 server actions**, and **13 database tables**. It uses OpenAI and a Neon database.
- `warrenghaad` has **2 screens** (the Interactive Geometry Research Engine and a Dashboard, plus a Curation page). It has **no server actions or database use**: everything runs and saves in the browser (geometry scenes, Prism cube and selector, dock, canvas nodes).
- The two versions **share no git history**, so they can't be combined with an ordinary merge. Features will likely be moved over one by one (proposed: `move-warrenghaad-features-by-hand`).
- Details: `inventory/compare-main-vs-warrenghaad.md`. These are structural facts only; nothing has been run or traced yet.
- Known hollow spot: the eTextbook page shows a **random** progress bar (`client/src/pages/etextbook-explorer.tsx:169`). It must never be read as a real number.

## Rules for this project

Everything in `catalogue-kit/CONSIDERATIONS.md` and `OPERATING_MODEL.md`, plus the constraints in `config.json`:

- No changes to app code, routes, the app shell, schemas, or stored user data during catalogue stages.
- `warrenghaad` is read as incoming evidence only; never merged or rewritten.
- No Prism building, and its grid is never used as catalogue chapters.
- No AI-generated images presented as the app or a design; screenshots use sample data only.
- Records live here in `catalogue/`; Replit memory and tasks only point here.
- The template lives only in Storybook until the owner approves it.

Older instructions that conflict with these are listed in `RECONCILIATION.md`.

## Order of work

| Step | Who | Ends with |
|---|---|---|
| Owner sends the Figma eTextbook link and says where the Card Stack design is | Owner | — |
| Build the combined Figma template file | Claude | Owner looks at the file |
| `prompts/replit-task-1-template.md`: template components + Storybook | Replit | Screenshot review (Claude checks, owner approves) |
| `prompts/replit-task-2-catalogue-screens.md`: catalogue screens on the template | Replit | Screenshot review |
| `prompts/replit-task-3-pilot.md`: three real entries | Replit | **Checkpoint A**: do they truthfully show what exists, what's intended, what's unknown? |
| Remaining entries, then chapters and order | Replit, Claude reviews | **Checkpoint B** |
| Written layout for wiring into the app | Claude | **Checkpoint C** |
| Wire the catalogue into the app | Replit | Owner check |

Replit's standing instructions: `prompts/replit-lead-agent.md`.

## Files

```
config.json            app identity, stage, code sources, constraints
sources.json           what has been inspected, how far, and what is inaccessible
decisions.json         owner decisions (approved) and agent proposals (proposed)
RECONCILIATION.md      conflicts between older instructions and current direction
entries/               one file per function (none yet)
inventory/             generated structural maps of main and warrenghaad, and their comparison
prompts/               paste-ready Replit instructions
```

Check everything with:

```bash
npx tsx catalogue-kit/scripts/validate.ts catalogue
```
