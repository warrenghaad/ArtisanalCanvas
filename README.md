# ArtisanalCanvas

**ArtisanalCanvas** is a visual learning and drawing studio: a Vite + React + TypeScript application with an Express backend, designed for drawing practice, curriculum navigation, eTextbook exploration, analytics, AI-assisted assessment, and an evolving infinite-canvas studio surface.

The project’s north star is to turn drawing instruction into something visible, interactive, and spatial:

```txt
reference -> decomposition -> construction steps -> drawing practice -> assessment -> revision
```

It should support clear visualizations, photographic and painting decompositions, drawing pattern generation, perspective practice, and reusable lesson surfaces.

---

## Current product surface

The existing app includes a Renaissance Perspective Academy and related learning surfaces.

Primary routes:

| Route | Purpose |
| --- | --- |
| `/` | Academy home |
| `/academy` | Academy home |
| `/etextbooks` | eTextbook explorer |
| `/curriculum` | Curriculum dashboard |
| `/learning` | Learning hub |
| `/analytics` | Analytics dashboard |

---

## Stack

- **Client:** React 18, TypeScript, Vite
- **Routing:** Wouter
- **Server:** Express + TypeScript
- **Data / schemas:** Drizzle ORM, Drizzle Zod, Zod
- **Database target:** Neon serverless / PostgreSQL-compatible setup
- **UI:** Radix UI primitives, Tailwind CSS, Lucide React
- **State / data fetching:** TanStack React Query
- **Animation / visualization support:** Framer Motion, Recharts
- **AI service layer:** OpenAI integration

---

## Scripts

```sh
npm run dev
npm run build
npm run start
npm run check
npm run db:push
```

### What they do

| Script | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with `tsx server/index.ts` |
| `npm run build` | Build the Vite client and bundle the Express server into `dist/` |
| `npm run start` | Run the production server from `dist/index.js` |
| `npm run check` | Run TypeScript checking |
| `npm run db:push` | Push Drizzle schema changes |

---

## Local setup

```sh
git clone https://github.com/warrenghaad/ArtisanalCanvas.git
cd ArtisanalCanvas
npm install
npm run dev
```

Then open the local dev URL shown by Vite/Express.

Before considering a coding task complete, run at least one relevant verification command:

```sh
npm run check
npm run build
```

If a command cannot be run, document why.

---

## Studio architecture direction

The next major architectural layer is an **Infinite Canvas + Prism Studio** that preserves the current Academy app.

Mental model:

```txt
Infinite Canvas / Nash Room = persistent spatial learning and authoring surface
Prism = small bottom-left context selector
Dock = bottom viewer/surface tray
Global Menu / Command Palette = commands
Academy pages = existing product surfaces to preserve
```

### Guardrails

- Do not replace the current Academy shell unless explicitly asked.
- Do not remove Academy, curriculum, eTextbook, learning, or analytics routes.
- Do not make Prism the root app.
- Do not put the canvas inside Prism.
- Prism workspace changes should happen in state, not through page navigation.
- Avoid permanent side panels for the new studio surface.
- Use dock viewers or surfaces instead of panels.
- The infinite canvas should persist spatial objects, drawings, cards, connections, viewport state, and selections.
- Every important interaction should have keyboard and single-pointer alternatives.
- Do not create drag-only workflows.

Recommended future folder direction:

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

Possible shared schemas:

```txt
shared/studio-schema.ts
shared/canvas-schema.ts
shared/prism-schema.ts
```

---

## Visualization requirements

ArtisanalCanvas is a drawing-learning app. That means text alone is not enough.

Every major drawing lesson should provide visible instructional structure:

- annotated photographs
- decomposed paintings
- construction overlays
- raster diagrams
- step-by-step panels
- pattern sheets
- interactive Canvas overlays
- before/after comparisons
- line-depth and shadow demonstrations

### SVG policy

SVG should not be the default for expressive drawing instruction.

SVG is acceptable for clean 2D structures:

- proportion grids
- mathematical curves
- flat geometric diagrams
- simple tiling patterns
- repeat-unit pattern logic

SVG should not stand alone for:

- line depth
- shadow mass
- painterly tone
- charcoal or graphite texture
- edge softness
- expressive line weight
- photographic decomposition
- atmospheric depth

For those, prefer raster images, Canvas overlays, layered PNG/JPG/WebP assets, or annotated visual worksheets.

---

## Drawing decomposition model

A reference image, photograph, painting, or scene should be decomposed into layers:

1. **Reference**: the original source image or scene
2. **Silhouette**: the big outer shape and weight
3. **Axis map**: gesture, tilt, centerline, horizon, or rotation direction
4. **Grid / proportion map**: halves, thirds, anchors, spacing, landmarks
5. **Primitive forms**: boxes, cylinders, cones, ribbons, spheres, wedges, slabs
6. **Planes**: front, side, top, underside, cheek, brow, jaw, or shadow-facing planes
7. **Value masses**: light, halftone, shadow, accent dark, reflected light
8. **Edge behavior**: hard, soft, lost, broken, thick, thin, compressed, vibrating
9. **Pattern extraction**: repeatable visual rules that become drills

The goal is to convert observation into a usable drawing machine.

---

## First implementation loop

Start small and visible:

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

---

## Suggested issue/task template

Every implementation task should report:

- files changed
- commands run
- tests/typechecks run
- architecture risks
- remaining TODOs
- whether existing Academy behavior was preserved
- whether any guardrail may have been violated

---

## Project relationship

ArtisanalCanvas is the application surface.

It can receive curriculum and drawing concepts from companion repositories or documents such as:

- line-based drawing progressions
- grid-to-cube learning systems
- primitive-form studios
- visual decomposition protocols
- pattern-generation instructions
- classical drawing prompts

The app should turn those materials into interactive learning surfaces.

---

## License

MIT, matching the current package metadata.
