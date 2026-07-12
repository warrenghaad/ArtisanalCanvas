import React, { useCallback, useEffect, useReducer, useRef } from "react";
import type { CanvasInteractionSpec, ToggleLayer } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────

interface LayerVisibility {
  [layerId: string]: boolean;
}

interface ControlValues {
  [controlId: string]: number | string | boolean;
}

interface InteractionState {
  layerVisibility: LayerVisibility;
  controlValues: ControlValues;
  hoveredLayer: string | null;
}

type Action =
  | { type: "TOGGLE_LAYER"; layerId: string }
  | { type: "SET_LAYER"; layerId: string; visible: boolean }
  | { type: "SET_CONTROL"; controlId: string; value: number | string | boolean }
  | { type: "SET_HOVERED_LAYER"; layerId: string | null }
  | { type: "CYCLE_SCREEN_GROUP"; groupKey: string; layers: ToggleLayer[] };

function buildInitialState(spec: CanvasInteractionSpec): InteractionState {
  const layerVisibility: LayerVisibility = {};
  for (const layer of spec.toggleLayers) {
    layerVisibility[layer.id] = layer.defaultVisible;
  }

  const controlValues: ControlValues = {};
  for (const ctrl of spec.controls) {
    controlValues[ctrl.id] = ctrl.default;
  }

  return { layerVisibility, controlValues, hoveredLayer: null };
}

function reducer(state: InteractionState, action: Action): InteractionState {
  switch (action.type) {
    case "TOGGLE_LAYER":
      return {
        ...state,
        layerVisibility: {
          ...state.layerVisibility,
          [action.layerId]: !state.layerVisibility[action.layerId],
        },
      };
    case "SET_LAYER":
      return {
        ...state,
        layerVisibility: {
          ...state.layerVisibility,
          [action.layerId]: action.visible,
        },
      };
    case "SET_CONTROL":
      return {
        ...state,
        controlValues: {
          ...state.controlValues,
          [action.controlId]: action.value,
        },
      };
    case "SET_HOVERED_LAYER":
      return { ...state, hoveredLayer: action.layerId };
    case "CYCLE_SCREEN_GROUP": {
      // Find the currently visible layer in the group, show the next one.
      const groupLayers = action.layers.filter((l) => l.groupKey === action.groupKey);
      const currentIdx = groupLayers.findIndex((l) => state.layerVisibility[l.id]);
      const nextIdx = currentIdx === -1 ? 0 : (currentIdx + 1) % groupLayers.length;
      const nextVisibility: LayerVisibility = { ...state.layerVisibility };
      for (const l of groupLayers) {
        nextVisibility[l.id] = l.id === groupLayers[nextIdx].id;
      }
      return { ...state, layerVisibility: nextVisibility };
    }
    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Controls bar
// ─────────────────────────────────────────────────────────────────────────────

interface ControlsBarProps {
  spec: CanvasInteractionSpec;
  values: ControlValues;
  onControlChange: (id: string, value: number | string | boolean) => void;
}

function ControlsBar({ spec, values, onControlChange }: ControlsBarProps) {
  if (spec.controls.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 px-3 py-2 bg-white border-b border-gray-200">
      {spec.controls.map((ctrl) => {
        if (ctrl.type === "slider") {
          return (
            <label key={ctrl.id} className="flex items-center gap-1.5 text-xs text-gray-700">
              <span className="shrink-0">{ctrl.label}</span>
              <input
                type="range"
                min={ctrl.min}
                max={ctrl.max}
                step={ctrl.step ?? 1}
                value={values[ctrl.id] as number ?? ctrl.default}
                onChange={(e) => onControlChange(ctrl.id, Number(e.target.value))}
                className="w-24 accent-amber-500"
                aria-label={ctrl.label}
              />
              <span className="w-8 text-gray-500 tabular-nums">{values[ctrl.id] as number}</span>
            </label>
          );
        }
        if (ctrl.type === "select") {
          return (
            <label key={ctrl.id} className="flex items-center gap-1.5 text-xs text-gray-700">
              <span className="shrink-0">{ctrl.label}</span>
              <select
                value={values[ctrl.id] as string ?? ctrl.default}
                onChange={(e) => onControlChange(ctrl.id, e.target.value)}
                className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white"
                aria-label={ctrl.label}
              >
                {ctrl.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </label>
          );
        }
        if (ctrl.type === "toggle") {
          return (
            <label key={ctrl.id} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={values[ctrl.id] as boolean ?? ctrl.default}
                onChange={(e) => onControlChange(ctrl.id, e.target.checked)}
                className="accent-amber-500"
                aria-label={ctrl.label}
              />
              <span>{ctrl.label}</span>
            </label>
          );
        }
        return null;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Layer toggle rail
// ─────────────────────────────────────────────────────────────────────────────

interface LayerRailProps {
  layers: ToggleLayer[];
  visibility: LayerVisibility;
  hovered: string | null;
  onToggle: (id: string) => void;
  onHover: (id: string | null) => void;
}

function LayerRail({ layers, visibility, hovered, onToggle, onHover }: LayerRailProps) {
  return (
    <div className="flex flex-wrap gap-1.5 px-3 py-2 bg-gray-50 border-b border-gray-200">
      {layers.map((layer) => {
        const isOn = visibility[layer.id] ?? false;
        const isHovered = hovered === layer.id;
        return (
          <button
            key={layer.id}
            type="button"
            onClick={() => onToggle(layer.id)}
            onMouseEnter={() => onHover(layer.id)}
            onMouseLeave={() => onHover(null)}
            className={`px-2 py-1 text-xs rounded border transition-colors ${
              isOn
                ? "bg-amber-100 border-amber-400 text-amber-900 font-medium"
                : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
            } ${isHovered ? "ring-1 ring-amber-300" : ""}`}
            aria-pressed={isOn}
            title={layer.label}
          >
            {layer.label}
          </button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder canvas (rendered when no real SVG asset is available)
// ─────────────────────────────────────────────────────────────────────────────

interface PlaceholderCanvasProps {
  spec: CanvasInteractionSpec;
  visibility: LayerVisibility;
}

function PlaceholderCanvas({ spec, visibility }: PlaceholderCanvasProps) {
  const visibleLayers = spec.toggleLayers.filter((l) => visibility[l.id]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-stone-100 relative overflow-hidden">
      {/* Soft grid background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        aria-hidden="true"
      >
        <defs>
          <pattern id="ci-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40,0 L0,0 0,40" fill="none" stroke="#8b7355" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ci-grid)"/>
      </svg>

      {/* Center content */}
      <div className="relative z-10 text-center max-w-xs">
        <p className="text-lg font-serif text-gray-600 mb-2">{spec.title}</p>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">{spec.description}</p>

        {visibleLayers.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {visibleLayers.map((l) => (
              <span
                key={l.id}
                className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-xs border border-amber-400"
              >
                {l.label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic mb-4">No layers visible. Toggle a layer above.</p>
        )}

        <p className="text-xs text-gray-400">
          Interactive asset (type: <code className="font-mono">{spec.interactionType}</code>)
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Hints panel
// ─────────────────────────────────────────────────────────────────────────────

function HintsPanel({ hints }: { hints: string[] }) {
  if (hints.length === 0) return null;
  return (
    <aside className="px-3 py-1.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
      <span className="font-medium text-gray-600">Hints: </span>
      {hints.join(" · ")}
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CanvasInteractionLayer — top-level component
// ─────────────────────────────────────────────────────────────────────────────

interface CanvasInteractionLayerProps {
  /** The canvas-interaction spec loaded from JSON (e.g. cross-cultural-screen-shadow-interaction.json) */
  spec: CanvasInteractionSpec;
  /** Optional: render a custom SVG canvas element instead of the placeholder. */
  renderCanvas?: (params: {
    spec: CanvasInteractionSpec;
    layerVisibility: LayerVisibility;
    controlValues: ControlValues;
  }) => React.ReactNode;
  className?: string;
}

export function CanvasInteractionLayer({
  spec,
  renderCanvas,
  className = "",
}: CanvasInteractionLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, dispatch] = useReducer(reducer, spec, buildInitialState);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const key = e.key;
      const shortcut = spec.keyboardShortcuts[key];
      if (!shortcut) return;

      e.preventDefault();

      if (shortcut === "cycle screens") {
        dispatch({ type: "CYCLE_SCREEN_GROUP", groupKey: "screen", layers: spec.toggleLayers });
        return;
      }

      // "show X only" — hide all in group, show one
      const showMatch = shortcut.match(/^show (.+) only$/);
      if (showMatch) {
        const targetId = showMatch[1];
        const layer = spec.toggleLayers.find((l) => l.id === targetId);
        if (layer) {
          for (const l of spec.toggleLayers) {
            if (l.groupKey === layer.groupKey) {
              dispatch({ type: "SET_LAYER", layerId: l.id, visible: l.id === targetId });
            }
          }
        }
        return;
      }

      // "toggle X"
      const toggleMatch = shortcut.match(/^toggle (.+)$/);
      if (toggleMatch) {
        dispatch({ type: "TOGGLE_LAYER", layerId: toggleMatch[1] });
        return;
      }

      // "increase X by N" / "decrease X by N"
      const adjustMatch = shortcut.match(/^(increase|decrease) (.+) by (\d+)$/);
      if (adjustMatch) {
        const dir = adjustMatch[1] === "increase" ? 1 : -1;
        const ctrlId = adjustMatch[2];
        const delta = Number(adjustMatch[3]) * dir;
        const ctrl = spec.controls.find((c) => c.id === ctrlId);
        if (ctrl && ctrl.type === "slider") {
          const current = (state.controlValues[ctrlId] as number) ?? ctrl.default;
          const next = Math.min(ctrl.max, Math.max(ctrl.min, current + delta));
          dispatch({ type: "SET_CONTROL", controlId: ctrlId, value: next });
        }
        return;
      }
    },
    [spec, state.controlValues]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full outline-none border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}
      tabIndex={0}
      role="application"
      aria-label={spec.title}
    >
      {/* Layer toggle rail */}
      <LayerRail
        layers={spec.toggleLayers}
        visibility={state.layerVisibility}
        hovered={state.hoveredLayer}
        onToggle={(id) => dispatch({ type: "TOGGLE_LAYER", layerId: id })}
        onHover={(id) => dispatch({ type: "SET_HOVERED_LAYER", layerId: id })}
      />

      {/* Controls bar */}
      <ControlsBar
        spec={spec}
        values={state.controlValues}
        onControlChange={(id, value) =>
          dispatch({ type: "SET_CONTROL", controlId: id, value })
        }
      />

      {/* Canvas area */}
      {renderCanvas ? (
        renderCanvas({
          spec,
          layerVisibility: state.layerVisibility,
          controlValues: state.controlValues,
        })
      ) : (
        <PlaceholderCanvas spec={spec} visibility={state.layerVisibility} />
      )}

      {/* Hints */}
      <HintsPanel hints={spec.interactionHints} />
    </div>
  );
}
