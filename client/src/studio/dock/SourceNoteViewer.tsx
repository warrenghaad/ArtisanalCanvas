import React, { useState } from "react";
import type { SourceNote, AssetType } from "../types";
import { ASSET_TYPE_LABELS, ASSET_TYPE_DESCRIPTIONS } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Asset type badge
// ─────────────────────────────────────────────────────────────────────────────

const BADGE_COLORS: Record<AssetType, string> = {
  "reference-board":           "bg-sky-100 text-sky-800 border-sky-300",
  "flat-construction-vector":  "bg-indigo-100 text-indigo-800 border-indigo-300",
  "expressive-linework-raster":"bg-amber-100 text-amber-800 border-amber-300",
  "step-worksheet":            "bg-green-100 text-green-800 border-green-300",
  "decomposition-overlay":     "bg-violet-100 text-violet-800 border-violet-300",
  "material-raster":           "bg-orange-100 text-orange-800 border-orange-300",
  "canvas-interaction":        "bg-rose-100 text-rose-800 border-rose-300",
  "perspective-projection":    "bg-teal-100 text-teal-800 border-teal-300",
  "context-card":              "bg-slate-100 text-slate-700 border-slate-300",
};

interface AssetTypeBadgeProps {
  type: AssetType;
  showTooltip?: boolean;
}

function AssetTypeBadge({ type, showTooltip = false }: AssetTypeBadgeProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      className={`relative inline-flex items-center px-2 py-0.5 rounded border text-xs font-medium select-none cursor-default ${BADGE_COLORS[type]}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {ASSET_TYPE_LABELS[type]}
      {showTooltip && hovered && (
        <span className="absolute bottom-full left-0 mb-1 z-50 w-56 rounded bg-gray-900 text-white text-xs p-2 shadow-lg pointer-events-none">
          {ASSET_TYPE_DESCRIPTIONS[type]}
        </span>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Asset record row
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  brief:       "text-gray-400",
  placeholder: "text-yellow-600",
  draft:       "text-blue-600",
  final:       "text-green-600",
} as const;

const STATUS_LABELS = {
  brief:       "Brief",
  placeholder: "Placeholder",
  draft:       "Draft",
  final:       "Final",
} as const;

interface AssetRowProps {
  type: AssetType;
  path: string;
  status: "brief" | "placeholder" | "draft" | "final";
  description?: string;
}

function AssetRow({ type, path, status, description }: AssetRowProps) {
  return (
    <li className="flex items-start gap-2 py-1.5 border-b border-gray-100 last:border-0">
      <AssetTypeBadge type={type} showTooltip />
      <div className="flex-1 min-w-0">
        <span className="block text-xs text-gray-700 font-mono truncate" title={path}>
          {path.split("/").pop()}
        </span>
        {description && (
          <span className="block text-xs text-gray-500 leading-snug mt-0.5">{description}</span>
        )}
      </div>
      <span className={`text-xs shrink-0 ${STATUS_COLORS[status]}`}>
        {STATUS_LABELS[status]}
      </span>
    </li>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Source note card
// ─────────────────────────────────────────────────────────────────────────────

interface SourceNoteCardProps {
  note: SourceNote;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}

function SourceNoteCard({ note, isActive = false, onSelect }: SourceNoteCardProps) {
  const [expanded, setExpanded] = useState(isActive);

  return (
    <article
      className={`rounded-lg border transition-colors ${
        isActive ? "border-amber-400 bg-amber-50" : "border-gray-200 bg-white"
      }`}
    >
      {/* Header */}
      <button
        type="button"
        className="w-full flex items-start justify-between gap-2 px-3 py-2 text-left"
        onClick={() => {
          setExpanded((v) => !v);
          onSelect?.(note.id);
        }}
        aria-expanded={expanded}
      >
        <div>
          <span className="block text-sm font-semibold text-gray-900 leading-snug">
            {note.title}
          </span>
          {note.culturalContext && (
            <span className="block text-xs text-gray-500 mt-0.5">{note.culturalContext}</span>
          )}
          {/* Asset type badge row */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {note.assetTypes.map((t) => (
              <AssetTypeBadge key={t} type={t} showTooltip />
            ))}
          </div>
        </div>
        <span
          className="mt-1 text-gray-400 shrink-0 text-sm"
          aria-hidden="true"
        >
          {expanded ? "▲" : "▼"}
        </span>
      </button>

      {/* Expanded body */}
      {expanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Generated assets list */}
          {note.generatedAssets.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Assets
              </h4>
              <ul className="space-y-0">
                {note.generatedAssets.map((a, i) => (
                  <AssetRow
                    key={i}
                    type={a.type}
                    path={a.path}
                    status={a.status}
                    description={a.description}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Search query seeds */}
          {note.searchQuerySeeds.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Search Seeds
              </h4>
              <ul className="space-y-0.5">
                {note.searchQuerySeeds.map((seed, i) => (
                  <li key={i} className="text-xs text-gray-600 leading-snug">
                    · {seed}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rights note */}
          {note.rightsNote && (
            <div>
              <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Rights
              </h4>
              <p className="text-xs text-gray-600 leading-snug">{note.rightsNote}</p>
            </div>
          )}

          {/* Context warning */}
          {note.contextWarning && (
            <div className="rounded bg-yellow-50 border border-yellow-300 px-2 py-1.5">
              <p className="text-xs text-yellow-800 leading-snug">
                ⚠ {note.contextWarning}
              </p>
            </div>
          )}

          {/* Source board link */}
          {note.sourceBoardPath && (
            <p className="text-xs text-gray-400">
              Source board: <code className="font-mono">{note.sourceBoardPath}</code>
            </p>
          )}
        </div>
      )}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SourceNoteViewer — dock viewer surface
// ─────────────────────────────────────────────────────────────────────────────

interface SourceNoteViewerProps {
  /** All source notes available to display. */
  notes: SourceNote[];
  /** Currently active note id (e.g. tied to the active canvas card). */
  activeNoteId?: string | null;
  /** Filter to only show notes for a specific asset type. */
  filterByAssetType?: AssetType | null;
  onNoteSelect?: (id: string) => void;
}

export function SourceNoteViewer({
  notes,
  activeNoteId,
  filterByAssetType,
  onNoteSelect,
}: SourceNoteViewerProps) {
  const [assetFilter, setAssetFilter] = useState<AssetType | "">(
    filterByAssetType ?? ""
  );
  const [search, setSearch] = useState("");

  const visible = notes.filter((n) => {
    if (assetFilter && !n.assetTypes.includes(assetFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        (n.culturalContext?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  return (
    <section className="flex flex-col h-full bg-gray-50" aria-label="Source Notes Viewer">
      {/* Viewer header */}
      <header className="px-3 py-2 border-b border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-gray-800">Source Notes</h3>
        <p className="text-xs text-gray-500 leading-snug mt-0.5">
          Asset vocabulary, search seeds, and rights for each concept.
        </p>
      </header>

      {/* Filters */}
      <div className="px-3 py-2 border-b border-gray-100 bg-white space-y-1.5">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes…"
          className="w-full text-xs border border-gray-200 rounded px-2 py-1 outline-none focus:ring-1 focus:ring-amber-400"
          aria-label="Search source notes"
        />
        <select
          value={assetFilter}
          onChange={(e) => setAssetFilter(e.target.value as AssetType | "")}
          className="w-full text-xs border border-gray-200 rounded px-2 py-1 outline-none bg-white focus:ring-1 focus:ring-amber-400"
          aria-label="Filter by asset type"
        >
          <option value="">All asset types</option>
          {(
            [
              "flat-construction-vector",
              "expressive-linework-raster",
              "canvas-interaction",
              "decomposition-overlay",
              "step-worksheet",
              "reference-board",
              "material-raster",
              "perspective-projection",
              "context-card",
            ] as AssetType[]
          ).map((t) => (
            <option key={t} value={t}>
              {ASSET_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {/* Note list */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {visible.length === 0 ? (
          <p className="text-xs text-gray-400 text-center mt-8">No source notes match the current filter.</p>
        ) : (
          visible.map((note) => (
            <SourceNoteCard
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onSelect={onNoteSelect}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="px-3 py-1.5 border-t border-gray-200 bg-white">
        <p className="text-xs text-gray-400">
          {visible.length} of {notes.length} notes
        </p>
      </footer>
    </section>
  );
}
