// Re-export all shared studio types for client use.
// Client components should import from here, not directly from shared/studio-schema.
export type {
  AssetType,
  AssetStatus,
  AssetRecord,
  SourceNote,
  CanvasCard,
  CanvasCardType,
  CanvasInteractionSpec,
  InteractionType,
  InteractionControl,
  ToggleLayer,
  StudioState,
} from "../../../../shared/studio-schema";

export {
  ASSET_TYPES,
  ASSET_TYPE_LABELS,
  ASSET_TYPE_DESCRIPTIONS,
  ASSET_STATUSES,
  CANVAS_CARD_TYPES,
  INTERACTION_TYPES,
  assetTypeSchema,
  assetRecordSchema,
  sourceNoteSchema,
  canvasCardSchema,
  canvasInteractionSpecSchema,
  studioStateSchema,
} from "../../../../shared/studio-schema";
