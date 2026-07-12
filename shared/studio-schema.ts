import { z } from "zod";

// ============================================================================
// Asset type vocabulary for sacred geometry and studio source cards.
// These 9 labels are used across all concept cards, source notes, and the
// canvas dock viewer to declare which asset types a concept carries.
// See docs/sacred-geometry/visualization-image-briefs.md for the full spec.
// ============================================================================

export const ASSET_TYPES = [
  "reference-board",
  "flat-construction-vector",
  "expressive-linework-raster",
  "step-worksheet",
  "decomposition-overlay",
  "material-raster",
  "canvas-interaction",
  "perspective-projection",
  "context-card",
] as const;

export type AssetType = (typeof ASSET_TYPES)[number];

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  "reference-board":           "Reference Board",
  "flat-construction-vector":  "Construction Vector",
  "expressive-linework-raster":"Expressive Linework",
  "step-worksheet":            "Step Worksheet",
  "decomposition-overlay":     "Decomposition Overlay",
  "material-raster":           "Material Raster",
  "canvas-interaction":        "Canvas Interaction",
  "perspective-projection":    "Perspective Projection",
  "context-card":              "Context Card",
};

export const ASSET_TYPE_DESCRIPTIONS: Record<AssetType, string> = {
  "reference-board":
    "Museum or architecture reference images with captions and source notes.",
  "flat-construction-vector":
    "Clean construction logic where 1D lines create clear 2D shapes: compass grids, polygons, proportion grids, unit cells, simple tiling maps, and repeat-unit diagrams.",
  "expressive-linework-raster":
    "Pressure-sensitive, depth-making, ornamental, hatching, contour-hatching, cross-contour, graphite, ink, charcoal, or hand-line studies where the line itself creates surface, shadow, rhythm, or emotional force.",
  "step-worksheet":
    "Student-facing sequence with numbered drawing steps.",
  "decomposition-overlay":
    "Image overlay showing axis, grid, primitive shapes, repeat unit, value groups, line hierarchy, or mark-density logic.",
  "material-raster":
    "Texture-aware image: clay, stone, tile, textile, pigment, bead, wood, metal, paper.",
  "canvas-interaction":
    "Interactive layer: toggle grid, drag tile, cast shadow, project pattern, test hatching density, or compare mark hierarchies.",
  "perspective-projection":
    "Pattern placed on wall, floor, dome, vessel, folded cloth, or screen.",
  "context-card":
    "Cultural note, usage note, rights note, and safe-use warning where needed.",
};

export const assetTypeSchema = z.enum(ASSET_TYPES);

// ============================================================================
// Asset record — a specific file or production brief attached to a concept.
// ============================================================================

export const ASSET_STATUSES = ["brief", "placeholder", "draft", "final"] as const;
export type AssetStatus = (typeof ASSET_STATUSES)[number];

export const assetRecordSchema = z.object({
  type:        assetTypeSchema,
  path:        z.string(),
  status:      z.enum(ASSET_STATUSES).default("brief"),
  description: z.string().optional(),
});
export type AssetRecord = z.infer<typeof assetRecordSchema>;

// ============================================================================
// Source note — a concept's curated asset manifest for the dock viewer.
// ============================================================================

export const sourceNoteSchema = z.object({
  id:               z.string(),
  conceptId:        z.string(),
  title:            z.string(),
  culturalContext:  z.string().optional(),
  assetTypes:       z.array(assetTypeSchema),
  searchQuerySeeds: z.array(z.string()).default([]),
  generatedAssets:  z.array(assetRecordSchema).default([]),
  rightsNote:       z.string().optional(),
  contextWarning:   z.string().optional(),
  sourceBoardPath:  z.string().optional(),
  createdAt:        z.string().optional(),
});
export type SourceNote = z.infer<typeof sourceNoteSchema>;

// ============================================================================
// Canvas card — a spatial object placed on the infinite canvas.
// Cards declare which asset types they carry so the dock viewer can
// filter and emphasise relevant source notes.
// ============================================================================

export const CANVAS_CARD_TYPES = [
  "concept",
  "source",
  "exercise",
  "assessment",
  "lesson-module",
] as const;
export type CanvasCardType = (typeof CANVAS_CARD_TYPES)[number];

export const canvasCardSchema = z.object({
  id:          z.string(),
  type:        z.enum(CANVAS_CARD_TYPES),
  title:       z.string(),
  assetTypes:  z.array(assetTypeSchema).default([]),
  conceptId:   z.string().optional(),
  position:    z.object({ x: z.number(), y: z.number() }),
  size:        z.object({ width: z.number(), height: z.number() }).optional(),
  content:     z.record(z.unknown()).optional(),
  connections: z.array(z.string()).default([]),
  createdAt:   z.string().optional(),
});
export type CanvasCard = z.infer<typeof canvasCardSchema>;

// ============================================================================
// Canvas-interaction spec — drives the CanvasInteractionLayer component.
// Describes what a `canvas-interaction` asset type contains: which layers
// can be toggled, what controls exist, and what keyboard shortcuts apply.
// ============================================================================

export const INTERACTION_TYPES = [
  "toggle-grid",
  "drag-tile",
  "cast-shadow",
  "hatch-density",
  "mark-hierarchy",
  "compare-cultures",
] as const;
export type InteractionType = (typeof INTERACTION_TYPES)[number];

export const toggleLayerSchema = z.object({
  id:             z.string(),
  label:          z.string(),
  groupKey:       z.string().optional(),
  svgPath:        z.string().optional(),
  defaultVisible: z.boolean().default(true),
});
export type ToggleLayer = z.infer<typeof toggleLayerSchema>;

export const interactionControlSchema = z.discriminatedUnion("type", [
  z.object({
    id:      z.string(),
    type:    z.literal("slider"),
    label:   z.string(),
    min:     z.number(),
    max:     z.number(),
    default: z.number(),
    step:    z.number().optional(),
    affects: z.string().optional(),
  }),
  z.object({
    id:      z.string(),
    type:    z.literal("select"),
    label:   z.string(),
    options: z.array(z.string()),
    default: z.string(),
    affects: z.string().optional(),
  }),
  z.object({
    id:      z.string(),
    type:    z.literal("toggle"),
    label:   z.string(),
    default: z.boolean(),
    affects: z.string().optional(),
  }),
]);
export type InteractionControl = z.infer<typeof interactionControlSchema>;

export const canvasInteractionSpecSchema = z.object({
  id:               z.string(),
  conceptId:        z.string().optional(),
  conceptIds:       z.array(z.string()).optional(),
  title:            z.string(),
  description:      z.string(),
  interactionType:  z.enum(INTERACTION_TYPES),
  toggleLayers:     z.array(toggleLayerSchema).default([]),
  controls:         z.array(interactionControlSchema).default([]),
  interactionHints: z.array(z.string()).default([]),
  keyboardShortcuts:z.record(z.string()).default({}),
  curriculumLinks:  z.array(z.string()).default([]),
});
export type CanvasInteractionSpec = z.infer<typeof canvasInteractionSpecSchema>;

// ============================================================================
// Studio state fixture — saveable/loadable snapshot of studio session.
// Stores the canvas viewport, all placed cards, and the active source note.
// ============================================================================

export const studioStateSchema = z.object({
  id:              z.string(),
  label:           z.string().optional(),
  viewport:        z.object({
    x:    z.number().default(0),
    y:    z.number().default(0),
    zoom: z.number().min(0.1).max(10).default(1),
  }),
  cards:           z.array(canvasCardSchema).default([]),
  activeCardId:    z.string().nullable().optional(),
  activeSourceNoteId: z.string().nullable().optional(),
  savedAt:         z.string().optional(),
});
export type StudioState = z.infer<typeof studioStateSchema>;
