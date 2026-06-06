# Infinite Canvas + Prism Directions for ArtisanalCanvas

## Purpose

This document turns the Prism/Nash/Dock concept into repo-local implementation directions for **ArtisanalCanvas**.

The current app is a Renaissance Perspective Academy with a React/Vite client, Express server, shared schemas, curriculum routes, a drawing canvas, and AI assessment routes. The goal is **not** to replace that product surface. The goal is to add a new spatial studio layer that can eventually host drawing, curriculum, research, assembly, and final-use experiences.

Use this as the north-star for the next build loop:

```txt
Nash Room / Infinite Canvas = persistent spatial learning and authoring surface
Prism = small bottom-left context selector
Dock = bottom viewer/surface tray
Meta-Build = visible inspection/debug layer
Current Academy = preserved existing product surface
```

## Current repo facts to preserve

The app already has:

- Vite + React + TypeScript client code.
- Express server routes.
- Shared Drizzle/Zod schemas.
- Current routes for `/`, `/academy`, `/etextbooks`, `/curriculum`, `/learning`, and `/analytics`.
- A fixed academy page layout with a left sidebar, drawing canvas center, and right instructions/assessment area.
- A canvas utility that already understands strokes, horizon lines, vanishing points, construction lines, undo/redo, and PNG submission.
- API routes for user progress, practice sessions, drawing submission, AI assessment, differentiated content, and analytics.

Do not destroy these while adding studio code.

## Product direction

Add a new route such as:

```txt
/studio
```

This route should host the new infinite canvas / Nash Room surface.

Important distinction:

- A top-level route to enter the studio is okay.
- Prism workspace/cell changes must **not** be route changes.
- Prism changes should update state, dock viewer emphasis, commands, and active tools while the room persists.

## Architecture rules

### Nash Room / Infinite Canvas

The Nash Room is the persistent spatial root of the studio.

It owns:

- viewport pan/zoom/camera
- world-coordinate objects
- object selection
- spatial cards
- drawing strokes in world coordinates
- perspective guides
- connections/strings between objects
- viewer surface placement
- studio state save/load later

It must not own:

- Prism contract inference
- all backend persistence
- AI assessment service logic
- final student progress logic
- global page routing

### Prism

The Prism is a small bottom-left cube-like context selector.

It should emit:

```txt
workspace x engine x functionality
```

It should **not** contain the canvas or documents.

Recommended current matrix:

```txt
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
```

The Prism answers:

```txt
Given this active cell, which tools, viewers, commands, contracts, and validation surfaces become relevant?
```

It does not answer:

```txt
Where did the document go?
```

The Nash Room holds the work. The Prism selects context.

### Dock

The dock is a bottom tray of viewers/surfaces. It is not a permanent side panel.

It should manage:

- open
- minimize
- restore
- tile
- expand
- focus
- close
- missing/stubbed viewer status

Starter viewer registry:

```txt
canvas-objects
canvas-tools
exercise-instructions
source-notes
assessment-feedback
curriculum-map
cell-inspector
contract-graph
state-inspector
accessibility-lab
```

The dock should respond to the active Prism cell by emphasizing relevant viewers.

### Meta-Build

Meta-Build makes hidden system structure visible.

Starter Meta-Build viewers:

```txt
Cell Inspector
Contract Graph
State Inspector
Viewer Registry
Command Registry
Build Order Map
Accessibility Lab
```

Meta-Build is not Engine 4. Engine 4 is final-use only.

## Recommended folder structure

Add new code under `client/src/studio` rather than scattering experimental state through existing Academy components.

```txt
client/src/studio/
  canvas/
    InfiniteCanvasRoot.tsx
    InfiniteCanvasViewport.tsx
    CanvasObjectLayer.tsx
    CanvasConnectionLayer.tsx
    CanvasDrawingLayer.tsx
    viewportMath.ts
  prism/
    PrismCube.tsx
    prismConfig.ts
    prismState.ts
    prismTypes.ts
  dock/
    BottomDock.tsx
    dockViewerRegistry.ts
    dockState.ts
    dockTypes.ts
  menu/
    StudioCommandMenu.tsx
    commandRegistry.ts
  meta-build/
    CellInspectorViewer.tsx
    ContractGraphViewer.tsx
    StateInspectorViewer.tsx
    AccessibilityLabViewer.tsx
  state/
    studioStore.ts
    studioFixtures.ts
  types/
    artifactTypes.ts
    contractTypes.ts
    canvasTypes.ts
  fixtures/
    graphnodeToRwi.fixture.ts
  StudioRoute.tsx
```

Possible future shared files:

```txt
shared/studio-schema.ts
shared/canvas-schema.ts
shared/prism-schema.ts
```

Keep persistence as local client fixtures first unless a task explicitly needs database persistence.

## Minimal type model

Start with TypeScript types before complex UI.

```ts
export type WorkspaceId =
  | "meta-navigation"
  | "research-drafting"
  | "drafting-building"
  | "building-production"
  | "production-final"
  | "inspect-repair-debug";

export type EngineId =
  | "graphnode"
  | "rwi"
  | "assembler"
  | "frontend-final-use";

export type FunctionalityId =
  | "search-scope"
  | "inspect-compare"
  | "arrange-transform"
  | "preview-validate";

export interface PrismCellAddress {
  workspace: WorkspaceId;
  engine: EngineId;
  functionality: FunctionalityId;
}

export interface ViewportState {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasObject {
  id: string;
  type: "concept-card" | "source-note" | "exercise-card" | "drawing" | "assessment" | "viewer-surface";
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  data: Record<string, unknown>;
}

export interface DockViewerDefinition {
  id: string;
  label: string;
  category: "canvas" | "graphnode" | "rwi" | "assembler" | "frontend-final-use" | "meta-build";
  defaultState: "closed" | "minimized" | "open" | "emphasized";
}

export interface StudioState {
  viewport: ViewportState;
  activeCell: PrismCellAddress;
  objects: CanvasObject[];
  selectedObjectIds: string[];
  openViewerIds: string[];
}
```

## Infinite canvas implementation guidance

### Coordinate system

Use world coordinates for all canvas objects.

Pointer conversion should follow this pattern:

```txt
screen point -> viewport transform -> world point
```

Do not store object positions in screen pixels. Store them in world coordinates.

### Pan and zoom

Minimum controls:

- mouse wheel or trackpad zoom
- keyboard zoom in/out
- keyboard reset view
- single-pointer pan mode
- arrow-key nudge for selected objects

No important operation should require drag-only interaction.

### Objects

Start with simple spatial cards before advanced drawing.

Recommended first objects:

```txt
Concept Card
Source Note
Exercise Card
Assessment Card
Viewer Surface placeholder
```

### Drawing

The repo already has drawing behavior. Do not immediately rewrite it.

Instead:

1. Treat existing `DrawingCanvasComponent` as legacy/final-use academy drawing.
2. Add a new studio drawing layer only after the room, object layer, and viewport math are stable.
3. Move strokes into world coordinates before using them in the infinite canvas.
4. Keep horizon lines and vanishing points as first-class guide objects.

## Prism implementation guidance

### v0.1 Prism behavior

Build the Prism as a small fixed bottom-left component.

Minimum behavior:

- renders active workspace label
- renders 4 engine rows x 4 functionality columns
- shows active cell
- updates active cell in local studio state
- emits `onCellChange(address)`
- supports keyboard navigation
- does not navigate routes
- does not move canvas objects

### Visual restraint

Do not spend v0.1 on elaborate cube animation.

A flat 4 x 4 face with workspace rotation controls is enough:

```txt
[workspace label]
[4 x 4 active face grid]
[previous workspace] [next workspace]
```

Cube animation can come after contracts and dock viewer behavior work.

## Dock implementation guidance

### v0.1 Dock behavior

Build a bottom dock component that displays viewer chips/cards.

Minimum behavior:

- shows all registered viewers
- marks open/minimized/emphasized/missing viewers
- clicking a viewer opens/focuses it
- active Prism cell can emphasize required viewers
- no side panels

### Cell-to-viewer emphasis

Example mapping:

```ts
const viewerNeedsByCell = {
  "research-drafting.graphnode.search-scope": [
    "canvas-objects",
    "cell-inspector",
    "contract-graph",
    "source-notes"
  ],
  "research-drafting.rwi.inspect-compare": [
    "source-notes",
    "cell-inspector",
    "contract-graph"
  ],
  "production-final.frontend-final-use.preview-validate": [
    "exercise-instructions",
    "assessment-feedback",
    "accessibility-lab"
  ]
};
```

## First visible loop

Do not build the whole universe first.

Build this loop:

```txt
Concept Card
-> Prism active cell
-> Dock viewer emphasis
-> Cell Inspector
-> Contract Graph placeholder
```

Then build this artifact path:

```txt
Concept Card
-> Source Note
-> Exercise Card
-> Assessment Feedback
-> Backward Request
```

## First contract to document and build

Start with:

```txt
GraphNode -> RWI
selected concept node -> source search / evidence lane
```

Why this one:

- It connects concept structure to research.
- It requires dock viewer emphasis.
- It creates a small artifact schema.
- It can be inspected by Meta-Build.
- It can generate clear backward requests when incomplete.

Starter artifact:

```ts
export interface ConceptBrief {
  nodeId: string;
  title: string;
  aliases: string[];
  conceptType?: string;
  relationHints: string[];
  openQuestions: string[];
  imageRefs?: string[];
  sourceSeeds?: string[];
  provenanceRefs?: string[];
}

export interface SourceSearchRequest {
  requestId: string;
  conceptBriefId: string;
  queryTerms: string[];
  desiredEvidenceTypes: Array<"text" | "image" | "diagram" | "citation">;
  createdByCell: PrismCellAddress;
}
```

## Build stages

### Stage 1: Directions and guardrails

- `AGENTS.md`
- `docs/INFINITE_CANVAS_PRISM_DIRECTIONS.md`
- `docs/PRISM_CONTRACT_DOSSIER_GRAPHNODE_TO_RWI.md`
- optional `.codex/agents/*.toml`

### Stage 2: Studio entry route

- Add `StudioRoute.tsx`.
- Add `/studio` route in `App.tsx`.
- Preserve existing `/` and `/academy` behavior.

### Stage 3: Local studio state

- Add local `StudioState` fixture.
- Add active cell state.
- Add viewport state.
- Add a few object fixtures.

### Stage 4: Infinite canvas skeleton

- Add viewport container.
- Render cards in world coordinates.
- Add pan/zoom.
- Add selection.
- Add keyboard navigation.

### Stage 5: Prism skeleton

- Add bottom-left Prism component.
- Add 4 x 4 grid.
- Add workspace switching in state.
- Add active cell event log.

### Stage 6: Dock skeleton

- Add bottom dock.
- Add viewer registry.
- Add viewer open/focus/minimize states.
- Add active-cell viewer emphasis.

### Stage 7: Meta-Build viewers

- Add Cell Inspector.
- Add Contract Graph placeholder.
- Add State Inspector.
- Show current active cell and selected object.

### Stage 8: First contract

- Add `ConceptBrief` and `SourceSearchRequest` types.
- Add GraphNode -> RWI fixture.
- Add a command to create source search request from selected Concept Card.
- Show the result in Cell Inspector / Contract Graph.

## Accessibility requirements

Every important action needs:

- keyboard path
- single-pointer path
- visible focus
- non-drag alternative
- large enough target
- reduced-motion path for animations
- predictable focus order

Specific requirements:

- Prism cells must be reachable with arrow keys.
- Dock viewers must be reachable with Tab and activatable with Enter/Space.
- Canvas objects must be selectable without dragging.
- Object movement must support arrow-key nudging.
- Pan/zoom must have buttons or keyboard controls, not only gesture controls.

## Acceptance criteria for the first v0.1 slice

The first implementation slice is successful when:

- `/studio` opens without breaking `/academy`.
- The studio shows a persistent infinite-canvas-style room.
- At least three spatial cards render in world coordinates.
- Prism is visible bottom-left and changes active cell in state.
- Prism changes do not navigate routes.
- Bottom dock is visible and emphasizes viewers based on active cell.
- Cell Inspector shows active cell and selected object.
- Contract Graph placeholder shows the GraphNode -> RWI contract.
- Basic keyboard navigation works.
- Existing Academy drawing behavior is preserved.
- `npm run check` or an equivalent typecheck passes.

## Anti-patterns to reject

Reject implementation paths that:

- replace Academy entirely
- make the Prism the app root
- put the infinite canvas inside the Prism
- use route changes for Prism cell changes
- create permanent side panels for the studio
- rename dock viewers as panels
- require drag-only interaction
- make Engine 4 mean frontend development
- bury contracts in invisible code with no Meta-Build viewer

## Suggested first Codex task

```txt
Implement only the v0.1 studio skeleton.

Scope:
1. Add a /studio route without changing existing / and /academy behavior.
2. Add client/src/studio folders.
3. Add local StudioState types and fixture data.
4. Add InfiniteCanvasRoot that renders 3 world-coordinate cards.
5. Add PrismCube as a bottom-left 4 x 4 active-cell selector.
6. Add BottomDock with a small viewer registry.
7. Add CellInspectorViewer that shows the active cell and selected object.
8. Add ContractGraphViewer placeholder for GraphNode -> RWI.

Constraints:
- No backend changes.
- No database changes.
- No route-based Prism workspace switching.
- No side panels.
- Preserve Academy behavior.

Done criteria:
- Files changed listed.
- npm run check or build run, or explain why not.
- /studio route loads.
- Existing /academy route still loads.
- Keyboard path exists for Prism and dock.
```
