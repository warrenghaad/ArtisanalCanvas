# Codex Swarm Directions for Prism / Nash / Dock Studio

## Purpose

Use this file when asking Codex to plan or build the new Infinite Canvas + Prism Studio layer for ArtisanalCanvas.

The repo already has a working Academy app. The first goal is not to replace it. The first goal is to let Codex create a safe v0.1 studio skeleton beside it.

## Core process

Use the swarm in four phases:

```txt
inspect -> infer -> packetize -> build
```

Do not let every agent build at once.

The swarm should first inspect the current repo, infer contracts, create build packets, and only then implement a narrow slice.

## Agent layers

```txt
Layer 1: ChatGPT planning
  canon, architecture, contract dossiers, build packets

Layer 2: Codex swarm agents
  repo inspection, scaffolding, implementation, review

Layer 3: Future in-app Prism Brain
  contract inference and Meta-Build viewers inside the studio
```

For now, use Layers 1 and 2.

## Recommended agents

### Orchestrator

Role: merge agent findings and produce the final build packet.

Owns:

```txt
build order
scope control
agent assignment
acceptance criteria
final summary
```

### Canon Keeper

Role: prevent architectural collapse.

Checks:

```txt
Nash Room is persistent spatial root
Prism is small bottom-left context selector
Dock is viewer/surface tray
No panels
No route-swapped Prism workspaces
Engine 4 is final-use, not frontend development
Meta-Build is separate from the four engines
```

### Prism Brain

Role: infer contracts.

For each cell or contract, answer:

```txt
What artifact moves?
What context is required?
What dock viewers are needed?
What commands are active?
What validates success?
What fails?
What backward request is generated?
What Codex tasks are needed?
```

### Nash Room Agent

Role: own the persistent spatial root.

Owns:

```txt
room root
viewport
spatial object layer
connection layer
viewer surface layer
room state
```

Does not own:

```txt
Prism contract logic
engine-specific tools
page routes
panel shells
```

### Dock Agent

Role: own the bottom dock and viewer lifecycle.

Owns:

```txt
viewer registry
open / close / minimize / restore
tile / expand / focus
missing viewer badges
cell-to-viewer emphasis
```

### Engine Agents

Use one per engine:

```txt
graphnode_agent
rwi_agent
assembler_agent
frontend_final_use_agent
```

Engine boundaries:

```txt
GraphNode = concept nodes, relations, graph structure, image/provenance hints
RWI = sources, reading, annotation, evidence, writing, provenance review
Assembler = lessons, scenes, storyboards, timelines, packages
Frontend Final-Use = final student/teacher/viewer experience, not React implementation
```

### Meta-Build Agent

Role: make hidden state visible.

Owns:

```txt
Cell Inspector
Contract Graph
State Inspector
Build Order Map
Viewer Registry
Command Registry
Accessibility Lab
```

### Accessibility Agent

Role: prevent interaction traps.

Checks:

```txt
keyboard path
single-pointer path
no drag-only workflow
visible focus
large targets
predictable focus order
reduced-motion path
```

### QA / Audit Agent

Role: final guardrail review.

Checks:

```txt
no Prism-as-root inversion
no side panels
no route-based Prism cell switching
dock viewers remain surfaces
contracts are inspectable
Academy still works
typecheck/build passes or failure is documented
```

## Project-scoped custom agents

This repo includes project-scoped Codex agents under:

```txt
.codex/agents/
```

Use them by asking Codex to spawn the specific agents by name.

Keep direct child agents only unless there is a strong reason to use recursive delegation.

## First survey prompt

Paste this into Codex after the files exist:

```text
I want to test the Prism/Nash/Dock agent process.

Spawn specialized subagents and wait for all results before summarizing.

Use these project agents:
1. canon_keeper
2. prism_brain
3. nash_room_agent
4. dock_agent
5. meta_build_agent
6. accessibility_agent
7. qa_audit_agent

Task:
Inspect the repository and propose the smallest safe v0.1 implementation path for the Infinite Canvas + Prism Studio.

Do not implement production code yet unless creating missing docs/config files is necessary.

Each agent should answer only from its role.

Focus on this first loop:
Concept Card
-> Source Search Request
-> Evidence Pack
-> Exercise / Scene Card
-> Final-Use Preview
-> Backward Request

Required output:
- current repo state summary
- architecture risks
- missing folders/files
- proposed folder structure
- first artifact schemas
- first contract to build
- first dock viewers
- first Meta-Build viewers
- first implementation tasks
- agent-by-agent findings
- merged recommended next Codex command
```

## First implementation prompt

Use after the survey:

```text
Implement only the v0.1 skeleton for the Infinite Canvas + Prism Studio.

Scope:
1. Add a /studio route without changing existing / and /academy behavior.
2. Create client/src/studio folders.
3. Create TypeScript config files for:
   - Prism workspaces
   - engine rows
   - functionality columns
   - dock viewer registry
   - first artifact schemas
   - first GraphNode -> RWI contract
4. Create placeholder React components:
   - StudioRoute
   - InfiniteCanvasRoot
   - PrismCube
   - BottomDock
   - CellInspectorViewer
   - ContractGraphViewer
5. Render three world-coordinate cards in the canvas.
6. Prism cell changes must update state, not routes.
7. Dock viewer emphasis must respond to active cell.
8. Preserve current Academy behavior.

Constraints:
- No backend changes.
- No database changes.
- No permanent side panels.
- Do not put the canvas inside the Prism.
- Do not make Prism the app root.
- Do not build fancy cube animation yet.

Use subagents:
- canon_keeper checks architecture.
- prism_brain defines contract dossier.
- nash_room_agent checks canvas root and viewport state.
- dock_agent defines viewer registry.
- meta_build_agent defines inspector fields.
- accessibility_agent checks keyboard and single-pointer alternatives.
- qa_audit_agent reviews the final diff.

Done criteria:
- Files changed listed.
- Commands run listed.
- npm run check or npm run build run, or reason why not.
- /studio loads.
- /academy still loads.
- Guardrail report included.
```

## First contract build prompt

Use after `/studio` exists:

```text
Implement only the local GraphNode -> RWI contract slice.

Scope:
- Add local studio types for PrismCellAddress, ConceptBrief, SourceSearchRequest, and BackwardRequest.
- Add a concept-card fixture.
- Add a helper that turns the selected concept-card into a ConceptBrief.
- Add a helper that turns ConceptBrief into SourceSearchRequest.
- Expose generated artifacts in CellInspectorViewer.
- Show the contract edge in ContractGraphViewer.
- Emphasize Source Notes, Source Library, Cell Inspector, and Contract Graph in BottomDock when the contract is active.

Constraints:
- No backend changes.
- No database changes.
- Do not alter existing Academy drawing behavior.
- Do not use route changes for Prism cells.
- Do not create side panels.
- Keep new code under client/src/studio unless shared types are clearly needed.

Done criteria:
- Files changed listed.
- npm run check or npm run build run, or reason why not.
- /studio still loads.
- /academy still loads.
- Keyboard path exists for selecting the command and focusing dock viewers.
```

## First audit prompt

Use after the first implementation:

```text
Audit the Infinite Canvas + Prism Studio implementation.

Do not add new features unless needed to fix critical broken behavior.

Review:
- architecture matches AGENTS.md
- Academy routes remain intact
- Prism is not root
- Prism cell changes do not navigate routes
- Infinite canvas remains persistent
- Dock uses viewers/surfaces, not panels
- Meta-Build viewers expose active cell and contract state
- Engine 4 remains final-use only
- TypeScript errors
- broken imports
- inaccessible interactions

Produce:
- docs/STUDIO_AUDIT.md with findings ranked Critical / Important / Nice-to-have
- Fix only Critical issues
- Leave Important and Nice-to-have as TODOs unless trivial
```

## First success target

The first win is not a finished IDE.

The first win is:

```txt
Codex reads the repo constitution,
spawns the right agents,
inspects the real app,
builds /studio as a safe sibling route,
shows Prism + infinite canvas + dock,
and preserves the existing Academy.
```

That is the spark before the forge. 🔥
