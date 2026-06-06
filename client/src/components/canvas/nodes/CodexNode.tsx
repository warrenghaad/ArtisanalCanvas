import { BaseNode } from "./BaseNode";
import { Search, ChevronRight } from "lucide-react";

export function CodexNode({ x, y }: { x: number, y: number }) {
  return (
    <BaseNode x={x} y={y} title="Codex Ontology" width={450}>
      <div className="space-y-6">
        <p className="leading-relaxed">
          The geometric registry substrate. Connects shapes and concepts across civilizations.
        </p>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search geometry, sign, or concept..." 
            className="w-full bg-transparent border border-border p-3 pl-10 font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-primary"
          />
        </div>

        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center group cursor-pointer">
            <span className="font-serif text-lg group-hover:underline">gea.circle</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex justify-between items-center group cursor-pointer">
            <span className="font-serif text-lg group-hover:underline">gea.petzinger.aviform</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex justify-between items-center group cursor-pointer">
            <span className="font-serif text-lg group-hover:underline">gem.square_triangle_composite</span>
            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
