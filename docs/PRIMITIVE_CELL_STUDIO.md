# Primitive Cell Studio (Line All Richie / LAR Studio)

A reusable **primitive-cell library + image-generation swarm** layered onto
ArtisanalCanvas. It is **additive**: the Renaissance Academy app, curriculum,
eTextbook, learning, and analytics routes are untouched (per `AGENTS.md`).

The studio answers three questions on every run:

1. **What skill is this teaching?**
2. **What primitives compose it?**
3. **What reusable visual cells should be saved** so we don't rebuild them later?

The valuable artifact is not the generated image — it is the **primitive
manifest** and the reusable **cells** it yields. Generated images are just one
output. Cells behave like animation cels: reusable visual organs that can be
recombined into lessons, worksheets, critiques, and future frames.

## Where it lives

```
shared/schema.ts                 # studio tables + Zod manifest/critique/swarm contracts
server/studio/
  db.ts                          # Neon/Drizzle client (shares DATABASE_URL)
  storage.ts                     # StudioStorage: CRUD for all studio tables
  assetStore.ts                  # local-first image + manifest storage (ASSET_DIR)
  llm.ts                         # gpt-5 JSON helper, degrades gracefully w/o key
  openaiImages.ts                # gpt-image-1 generation -> assets/generated
  seed.ts                        # base GEOMETRIC + SACRED primitive library
  swarm.ts                       # orchestrator: runSwarm() + persistSwarm()
  routes.ts                      # Express router mounted at /api/studio
  agents/
    studioDirector.ts            # frames the brief (goal, level, outputs, material)
    primitiveDecomposer.ts       # subject -> primitive manifest (LLM + heuristics)
    curriculumMapper.ts          # places it on the learning progression
    promptArchitect.ts           # manifest -> educational image prompts
    imageGenerator.ts            # calls OpenAI image generation
    critiqueAgent.ts             # does it teach the skill?
    primitiveLibrarian.ts        # extracts reusable cells to save
    canonClerk.ts                # assigns lifecycle status
    heuristics.ts                # deterministic decomposition (no-API-key baseline)
    types.ts                     # agent IO contracts
assets/                          # local-first generated/, manifests/, primitives/, references/
```

## Design decisions

- **Integrated, not standalone.** Built on the existing Express + TypeScript +
  Drizzle/Postgres + Zod + OpenAI stack rather than the spec's separate
  SQLite/JS app, so it reuses the app's DB, validation, and OpenAI plumbing.
- **Local-first images.** Generated PNGs and JSON manifests are written under
  `ASSET_DIR` (default `./assets`). No external sync at generation time.
- **Graceful degradation.** With no `OPENAI_API_KEY`, the swarm still produces a
  complete manifest, prompts, reusable cells, practice card, and graph edges via
  deterministic heuristics — only the rendered image is skipped.
- **Priority ladder for the library:** `geometric → sacred → figure → other`.
  Geometric primitives must appear in every drawing; sacred/aesthetic geometry
  layers on top; figure applies them to people; other is the catch-all.

## The swarm

```
request -> Studio Director -> Primitive Decomposer -> Curriculum Mapper
        -> Prompt Architect -> Image Generator -> Critique Agent
        -> Primitive Librarian -> Canon Clerk -> persisted result
```

Every run returns: primitive manifest, image prompts, generated-image metadata,
new reusable cells, graph edges, a practice card, a critique, and a status.

## Lifecycle statuses

`raw → extracted → candidate → reviewed → canon → superseded → deprecated`.
Nothing becomes `canon` automatically; the Canon Clerk caps the crew at
`reviewed` pending human sign-off.

## API (mounted at `/api/studio`)

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/status` | LLM/image availability + categories |
| GET/POST | `/concepts`, `/concepts/:id`, PATCH `/concepts/:id` | Concepts |
| GET/POST | `/primitives` (`?category=`), `/primitives/:id`, PATCH `/primitives/:id` | Primitive cells |
| POST | `/images/plan` | Run the crew to prompts only (no image, no DB needed) |
| POST | `/images/generate` | Generate one image from a raw prompt |
| POST | `/images/generate-with-swarm` | Full pipeline + persistence |
| GET | `/images`, `/images/:id` | Generated images |
| GET | `/graph` | Graph edges |
| GET/POST | `/sources`, `/ingest/chat`, `/ingest/reference`, `/ingest/drawing` | Ingestion |

### Example

```bash
curl -X POST localhost:5000/api/studio/images/generate-with-swarm \
  -H 'content-type: application/json' \
  -d '{"subject":"skeptical face in three-quarter view","level":5,
       "learningGoal":"facial expression through primitive construction"}'
```

## Environment

```
DATABASE_URL=...        # required (shared with the Academy app)
OPENAI_API_KEY=...      # optional; enables LLM decomposition + image generation
ASSET_DIR=./assets      # optional; local asset root
```

Run `npm run db:push` after pulling to create the new studio tables.

## Roadmap (phased)

1. **MVP (this change):** schema, swarm, primitive library, local images, manifests.
2. **Canon Queue:** review/promote/supersede UI, Markdown + JSON export.
3. **Graph view:** concept/primitive relationships, learning paths, missing-cell prompts.
4. **Notion / Obsidian export:** Markdown cards with YAML frontmatter.
5. **Animation-cell composer:** drag-and-drop cells, pose/expression builder.
