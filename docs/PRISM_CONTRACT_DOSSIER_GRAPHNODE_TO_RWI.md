# Prism Contract Dossier: GraphNode -> RWI

## Contract summary

```txt
Contract: GraphNode -> RWI
Source cell: research-drafting.graphnode.search-scope
Destination cell: research-drafting.rwi.search-scope
User action: Select a concept node and request sources, images, or evidence.
Primary artifact: ConceptBrief
Destination artifact: SourceSearchRequest
```

This is the first contract to build because it exercises the whole Prism/Nash/Dock shape without requiring the entire studio to exist.

It connects:

```txt
Concept Card / GraphNode object
-> source search request
-> evidence lane
-> dock viewer emphasis
-> Meta-Build inspection
-> backward request when missing context blocks progress
```

## Plain-language interpretation

When a learner, teacher, or builder selects a concept card in the infinite canvas, the Prism active cell can turn that selected concept into a research request.

The Nash Room still holds the selected object. The Prism does not move it. The Dock emphasizes the viewers needed to inspect the concept, search sources, and display evidence.

## Source cell

```txt
workspace: research-drafting
engine: graphnode
functionality: search-scope
cellId: research-drafting.graphnode.search-scope
```

The source cell asks:

```txt
What concept, node, image-bearing idea, relation cluster, or uncertain boundary should become researchable?
```

## Destination cell

```txt
workspace: research-drafting
engine: rwi
functionality: search-scope
cellId: research-drafting.rwi.search-scope
```

The destination cell asks:

```txt
What sources, notes, images, diagrams, citations, or evidence candidates should be searched for this concept?
```

## Artifact 1: ConceptBrief

A `ConceptBrief` is the smallest useful packet that GraphNode can pass into RWI.

```ts
export interface ConceptBrief {
  id: string;
  nodeId: string;
  title: string;
  aliases: string[];
  conceptType?: "person" | "place" | "object" | "motif" | "math-concept" | "art-principle" | "historical-event" | "mythic-figure" | "other";
  summary?: string;
  relationHints: string[];
  openQuestions: string[];
  imageRefs?: string[];
  sourceSeeds?: string[];
  provenanceRefs?: string[];
  createdByCell: PrismCellAddress;
}
```

Minimum required fields:

```txt
id
nodeId
title
aliases
relationHints
openQuestions
createdByCell
```

## Artifact 2: SourceSearchRequest

RWI receives a `ConceptBrief` and turns it into a search request.

```ts
export interface SourceSearchRequest {
  requestId: string;
  conceptBriefId: string;
  queryTerms: string[];
  desiredEvidenceTypes: Array<"text" | "image" | "diagram" | "citation" | "artifact" | "map">;
  requiredProvenanceLevel: "loose" | "classroom-safe" | "citation-ready";
  targetUse?: "lesson" | "drawing-exercise" | "assessment" | "teacher-note" | "student-facing-module";
  createdByCell: PrismCellAddress;
  destinationCell: PrismCellAddress;
}
```

## Artifact 3: BackwardRequest

If the destination cannot search well, it returns a structured backward request.

```ts
export interface BackwardRequest {
  requestId: string;
  targetEngine: "graphnode" | "rwi" | "assembler" | "frontend-final-use";
  targetCell: PrismCellAddress;
  reason:
    | "ambiguous-alias"
    | "missing-provenance"
    | "concept-boundary-unclear"
    | "insufficient-relation-hints"
    | "image-seed-missing"
    | "age-appropriateness-unclear";
  message: string;
  requestedFields: string[];
  blocking: boolean;
}
```

## Required context

The contract needs:

```txt
active workspace
active Prism cell
selected canvas object
selected object type
selected object title
node aliases
current graph neighborhood / relation hints
open questions
existing provenance refs if any
desired evidence type
```

## Dock viewers involved

Source viewers:

```txt
Canvas Objects
Node Inspector
Graph Neighborhood
```

Destination viewers:

```txt
Source Notes
Source Library
Reader + Annotation
Evidence Lane
Image Candidate Board
```

Meta-Build viewers:

```txt
Cell Inspector
Contract Graph
State Inspector
Viewer Registry
```

The Dock should emphasize these viewers when this contract is active.

## Commands

Starter command registry entries:

```ts
export const graphnodeToRwiCommands = [
  {
    id: "find-sources-for-selected-node",
    label: "Find sources for selected node",
    menuPath: "Tools > Research > Find sources for selected node",
    sourceCell: "research-drafting.graphnode.search-scope",
    destinationCell: "research-drafting.rwi.search-scope"
  },
  {
    id: "open-evidence-lane",
    label: "Open evidence lane",
    menuPath: "View > Evidence Lane",
    sourceCell: "research-drafting.rwi.search-scope"
  },
  {
    id: "request-image-candidates",
    label: "Request image candidates",
    menuPath: "Tools > Research > Request image candidates",
    sourceCell: "research-drafting.rwi.search-scope"
  }
];
```

## Validation rules

This contract passes when:

```txt
A selected concept card can generate a ConceptBrief.
The ConceptBrief is visible in Cell Inspector.
A SourceSearchRequest can be generated from the ConceptBrief.
The Dock emphasizes Source Notes, Source Library, Evidence Lane, Cell Inspector, and Contract Graph.
Failure states create clear BackwardRequests.
The interaction has keyboard and single-pointer paths.
The existing Academy drawing route still works.
```

## Failure modes

| Failure | Meaning | Backward request |
|---|---|---|
| ambiguous alias | The title or alias could refer to several concepts. | Ask GraphNode to split/merge/clarify node. |
| missing provenance | No source seed or provenance exists. | Ask GraphNode/RWI for provenance seed. |
| concept boundary unclear | The selected card is too broad. | Ask GraphNode to add relation hints and open questions. |
| no image seed | Image research cannot start well. | Ask for visual motifs, aliases, or artifact examples. |
| target use unclear | RWI cannot tune evidence for teacher/student/final use. | Ask caller to choose lesson, exercise, note, or module target. |

## Accessibility requirements

This contract must support:

```txt
select concept card by keyboard
open command by command palette
trigger source request without dragging
focus dock viewer by Tab/Enter
visible active-cell focus
visible selected-object focus
non-animated or reduced-motion Prism transition
screen-reader labels for Prism cells and dock viewers
```

## Contract dossier JSON

```json
{
  "contractId": "graphnode-to-rwi.concept-brief-to-source-search",
  "contractName": "Concept Brief to Source Search",
  "from": {
    "workspace": "research-drafting",
    "engine": "graphnode",
    "functionality": "search-scope",
    "cellId": "research-drafting.graphnode.search-scope"
  },
  "to": {
    "workspace": "research-drafting",
    "engine": "rwi",
    "functionality": "search-scope",
    "cellId": "research-drafting.rwi.search-scope"
  },
  "artifactPassed": {
    "type": "ConceptBrief",
    "requiredFields": [
      "id",
      "nodeId",
      "title",
      "aliases",
      "relationHints",
      "openQuestions",
      "createdByCell"
    ],
    "optionalFields": [
      "conceptType",
      "summary",
      "imageRefs",
      "sourceSeeds",
      "provenanceRefs"
    ]
  },
  "destinationArtifact": {
    "type": "SourceSearchRequest",
    "requiredFields": [
      "requestId",
      "conceptBriefId",
      "queryTerms",
      "desiredEvidenceTypes",
      "requiredProvenanceLevel",
      "createdByCell",
      "destinationCell"
    ]
  },
  "viewersInvolved": {
    "source": [
      "canvas-objects",
      "node-inspector",
      "graph-neighborhood"
    ],
    "destination": [
      "source-notes",
      "source-library",
      "reader-annotation",
      "evidence-lane",
      "image-candidate-board"
    ],
    "meta": [
      "cell-inspector",
      "contract-graph",
      "state-inspector",
      "viewer-registry"
    ]
  },
  "commands": [
    "find-sources-for-selected-node",
    "open-evidence-lane",
    "request-image-candidates"
  ],
  "validationRules": [
    "Selected object is a concept-card or compatible graph node.",
    "Selected object has stable id and title.",
    "ConceptBrief can be inspected before being sent.",
    "SourceSearchRequest contains queryTerms.",
    "Dock emphasizes required viewers.",
    "Failure returns BackwardRequest instead of silent no-op."
  ],
  "failureModes": [
    "ambiguous-alias",
    "missing-provenance",
    "concept-boundary-unclear",
    "insufficient-relation-hints",
    "image-seed-missing",
    "age-appropriateness-unclear"
  ],
  "swarmAgents": [
    "canon_keeper",
    "prism_brain",
    "nash_room_agent",
    "dock_agent",
    "meta_build_agent",
    "accessibility_agent",
    "qa_audit_agent"
  ]
}
```

## Smallest build slice

```txt
1. Add ConceptBrief and SourceSearchRequest types as local studio types.
2. Add one concept-card fixture in StudioState.
3. Add command definition: find-sources-for-selected-node.
4. Add local function: createConceptBriefFromCanvasObject.
5. Add local function: createSourceSearchRequestFromConceptBrief.
6. Show both artifacts in Cell Inspector.
7. Show GraphNode -> RWI edge in Contract Graph placeholder.
8. Emphasize Source Notes / Source Library / Cell Inspector in BottomDock.
```

No backend or database changes are needed for this first contract.

## Codex task prompt

```text
Implement only the local GraphNode -> RWI contract slice.

Scope:
- Add local studio types for PrismCellAddress, ConceptBrief, SourceSearchRequest, and BackwardRequest.
- Add a concept-card fixture.
- Add a contract helper that turns the selected concept-card into a ConceptBrief.
- Add a second helper that turns ConceptBrief into SourceSearchRequest.
- Expose the generated artifacts in Cell Inspector.
- Show the contract edge in ContractGraphViewer.
- Emphasize Source Notes, Source Library, Cell Inspector, and Contract Graph in BottomDock when the contract is active.

Constraints:
- No backend changes.
- No database changes.
- Do not alter existing Academy drawing behavior.
- Do not use route changes for Prism cells.
- Do not create side panels.
- Keep all new code under client/src/studio unless shared types are clearly needed.

Done criteria:
- Files changed listed.
- npm run check or build run, or reason why not.
- /studio still loads if it exists.
- /academy still loads.
- Keyboard path exists for selecting the command and focusing the dock viewers.
```
