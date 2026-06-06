# AGENTS.md

## Project identity

This repository is **ArtisanalCanvas**, currently a Vite + React + TypeScript client with an Express server and shared Drizzle/Zod schemas. Its existing product surface is a Renaissance Perspective Academy with drawing practice, curriculum navigation, eTextbooks, analytics, and AI-assisted drawing assessment.

The next architectural direction is to add an **Infinite Canvas + Prism Studio** layer without breaking the current academy app.

Use this mental model:

```txt
Infinite Canvas / Nash Room = persistent spatial learning and authoring surface
Prism = small bottom-left context selector
Dock = bottom viewer/surface tray
Global Menu / Command Palette = commands
Current Academy pages = existing product surfaces to preserve
```

## Current stack expectations

- Use TypeScript.
- Use React for client UI.
- Use Vite conventions already present in this repo.
- Use Express routes for server APIs.
- Use shared schemas from `shared/schema.ts` when backend persistence is added.
- Prefer Zod validation for new shared data shapes.
- Do not replace the current app shell unless explicitly asked.
- Do not remove the current Academy, curriculum, eTextbook, learning, or analytics routes while building the new studio surface.

## Non-negotiable architecture guardrails

- Do not make the Prism the root app.
- Do not put the canvas inside the Prism.
- Do not use page routes for Prism workspace changes.
- A top-level `/studio` or `/canvas` route is allowed as an entry point, but Prism rotation/cell changes must happen in state, not by navigating pages.
- Do not build permanent side panels for the new studio surface.
- Use dock **viewers/surfaces**, not panels.
- The infinite canvas should be persistent: changing Prism context should not reset spatial objects, drawings, cards, connections, or viewport state.
- Existing fixed drawing behavior should be preserved until a new infinite-canvas drawing layer fully replaces it.
- Every important interaction must have a keyboard and single-pointer alternative.
- Do not create drag-only workflows.
- Keep student/final-use experience separate from build/debug/Meta-Build tools.

## Infinite canvas direction

Build the infinite canvas as a persistent spatial room.

It should own:

- viewport camera state: pan, zoom, center, bounds
- world-coordinate objects
- drawing strokes in world coordinates
- perspective guides such as horizon lines and vanishing points
- cards for exercises, sources, concepts, assessments, and lesson modules
- lightweight connection strings between objects
- selection state
- keyboard navigation and object nudging
- save/load state later

It should not own:

- all server persistence
- Prism contract inference
- global routing
- final student progress logic
- AI assessment service logic

## Prism direction

The Prism should be a small bottom-left context engine.

Current recommended Prism address:

```txt
workspace x engine x functionality
```

Workspaces:

- meta-navigation
- research-drafting
- drafting-building
- building-production
- production-final
- inspect-repair-debug

Engines:

- graphnode
- rwi
- assembler
- frontend-final-use

Functionality columns:

- search-scope
- inspect-compare
- arrange-transform
- preview-validate

In this repo, map the engines pragmatically:

- `graphnode` = concepts, geometry ideas, curriculum nodes, historical-period nodes, relationships
- `rwi` = eTextbooks, references, source notes, evidence, myth/art/context material
- `assembler` = exercises, phase sequences, lesson cards, instruction packets, activity structures
- `frontend-final-use` = student practice mode, drawing stage, assessment feedback, progress experience

The Prism emits active context. It does not contain the work.

## Dock direction

The new studio surface should have a bottom dock that can open, restore, minimize, tile, expand, and focus viewers/surfaces.

Starter dock viewers:

- Canvas Objects
- Drawing Tools
- Exercise Instructions
- Source Notes
- Assessment Feedback
- Curriculum Map
- Cell Inspector
- Contract Graph
- State Inspector
- Accessibility Lab

Avoid naming these `Panel` in new code unless wrapping legacy UI.

## Recommended folder direction

Prefer adding new studio code under:

```txt
client/src/studio/
  canvas/
  prism/
  dock/
  menu/
  meta-build/
  state/
  types/
  fixtures/
```

Possible future shared types:

```txt
shared/studio-schema.ts
shared/canvas-schema.ts
shared/prism-schema.ts
```

Do not scatter Prism/canvas logic through existing academy components until the new surface is stable.

## First implementation loop

Build the smallest visible loop first:

```txt
Canvas Object
-> Prism active cell
-> Dock viewer emphasis
-> Cell Inspector
-> Saveable studio state fixture
```

Then add the curriculum/art loop:

```txt
Concept Card
-> Source Note
-> Exercise Card
-> Drawing Stage
-> Assessment Feedback
-> Backward Request
```

## Done criteria for Codex tasks

Every task must report:

- files changed
- commands run
- tests/typechecks run
- architecture risks
- remaining TODOs
- whether current Academy behavior was preserved
- whether any guardrail may have been violated

Do not claim success unless `npm run check`, `npm run build`, or a clear equivalent was run, or explain why it could not be run.
