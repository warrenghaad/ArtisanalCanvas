import { useState } from "react";
import { SourceNoteViewer } from "@/studio/dock/SourceNoteViewer";
import { CanvasInteractionLayer } from "@/studio/canvas/CanvasInteractionLayer";
import { EXAMPLE_SOURCE_NOTES, SCREEN_SHADOW_SPEC } from "@/studio/fixtures/example-data";
import type { AssetType } from "@/studio/types";

// ─────────────────────────────────────────────────────────────────────────────
// Dock viewer list
// ─────────────────────────────────────────────────────────────────────────────

const DOCK_VIEWERS = [
  { id: "source-notes",   label: "Source Notes" },
  { id: "canvas-objects", label: "Canvas Objects" },
  { id: "interaction",    label: "Canvas Interaction" },
] as const;

type DockViewerId = (typeof DOCK_VIEWERS)[number]["id"];

// ─────────────────────────────────────────────────────────────────────────────
// Studio page
// ─────────────────────────────────────────────────────────────────────────────

export default function StudioPage() {
  const [activeDock, setActiveDock] = useState<DockViewerId>("source-notes");
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [assetFilter, setAssetFilter] = useState<AssetType | null>(null);
  const [dockOpen, setDockOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-stone-100 overflow-hidden" aria-label="ArtisanalCanvas Studio">

      {/* Top navigation bar */}
      <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-800 transition-colors">
            ← Academy
          </a>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-semibold text-gray-900">Artisanal Canvas Studio</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setAssetFilter(assetFilter === "canvas-interaction" ? null : "canvas-interaction")}
            className={`text-xs px-2 py-1 rounded border transition-colors ${
              assetFilter === "canvas-interaction"
                ? "bg-rose-100 border-rose-400 text-rose-800"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            Canvas Interaction
          </button>
          <button
            type="button"
            onClick={() => setAssetFilter(assetFilter === "flat-construction-vector" ? null : "flat-construction-vector")}
            className={`text-xs px-2 py-1 rounded border transition-colors ${
              assetFilter === "flat-construction-vector"
                ? "bg-indigo-100 border-indigo-400 text-indigo-800"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            Construction Vectors
          </button>
          <button
            type="button"
            onClick={() => setAssetFilter(null)}
            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:border-gray-400 bg-white"
          >
            Clear filter
          </button>
        </div>
      </header>

      {/* Main body: canvas + dock */}
      <div className="flex-1 flex flex-col min-h-0">

        {/* Canvas area */}
        <main className="flex-1 flex min-h-0">

          {/* Infinite canvas placeholder */}
          <div className="flex-1 relative overflow-hidden bg-stone-100">
            {/* Canvas background grid */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" aria-hidden="true">
              <defs>
                <pattern id="studio-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M60,0 L0,0 0,60" fill="none" stroke="#8b7355" strokeWidth="0.5"/>
                </pattern>
                <pattern id="studio-grid-major" x="0" y="0" width="300" height="300" patternUnits="userSpaceOnUse">
                  <path d="M300,0 L0,0 0,300" fill="none" stroke="#8b7355" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#studio-grid)"/>
              <rect width="100%" height="100%" fill="url(#studio-grid-major)"/>
            </svg>

            {/* Canvas center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md px-6">
                <p className="text-2xl font-serif text-stone-500 mb-3">Infinite Canvas</p>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Cards, drawings, concept nodes, and construction guides will be placed here as spatial objects.
                  The canvas persists across Prism context changes.
                </p>
                <p className="text-xs text-stone-400 mt-4 italic">
                  Open the dock below to explore source notes and asset types.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Bottom dock */}
        <div className="shrink-0 border-t border-gray-200 bg-white" style={{ height: dockOpen ? "320px" : "40px" }}>
          {/* Dock tab bar */}
          <div className="flex items-center px-2 border-b border-gray-200 h-10">
            <div className="flex gap-1 flex-1">
              {DOCK_VIEWERS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => {
                    setActiveDock(v.id);
                    if (!dockOpen) setDockOpen(true);
                  }}
                  className={`px-3 py-1.5 text-xs rounded-t transition-colors ${
                    activeDock === v.id && dockOpen
                      ? "bg-amber-50 border border-amber-300 border-b-white text-amber-900 font-medium"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  aria-selected={activeDock === v.id && dockOpen}
                  aria-controls={`dock-${v.id}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDockOpen((v) => !v)}
              className="text-xs text-gray-400 hover:text-gray-700 px-2"
              aria-label={dockOpen ? "Minimize dock" : "Open dock"}
            >
              {dockOpen ? "▼" : "▲"}
            </button>
          </div>

          {/* Dock panel */}
          {dockOpen && (
            <div className="h-full overflow-hidden" style={{ height: "280px" }}>
              {/* Source Notes viewer */}
              {activeDock === "source-notes" && (
                <div id="dock-source-notes" className="h-full overflow-hidden">
                  <SourceNoteViewer
                    notes={EXAMPLE_SOURCE_NOTES}
                    activeNoteId={activeNoteId}
                    filterByAssetType={assetFilter}
                    onNoteSelect={setActiveNoteId}
                  />
                </div>
              )}

              {/* Canvas Objects placeholder */}
              {activeDock === "canvas-objects" && (
                <div id="dock-canvas-objects" className="h-full flex items-center justify-center text-sm text-gray-400">
                  <div className="text-center">
                    <p className="font-medium text-gray-600 mb-1">Canvas Objects</p>
                    <p className="text-xs text-gray-400">
                      World-coordinate cards and connections will appear here as they are placed on the canvas.
                    </p>
                  </div>
                </div>
              )}

              {/* Canvas Interaction viewer */}
              {activeDock === "interaction" && (
                <div id="dock-interaction" className="h-full overflow-hidden">
                  <CanvasInteractionLayer spec={SCREEN_SHADOW_SPEC} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
