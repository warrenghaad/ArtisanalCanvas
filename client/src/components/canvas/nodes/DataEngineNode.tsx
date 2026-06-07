import { BaseNode } from "./BaseNode";
import { GitCommit, Settings2 } from "lucide-react";

export function DataEngineNode({ x, y }: { x?: number, y?: number }) {
  return (
    <BaseNode x={x} y={y} title="Data Engine Pipeline">
      <div className="space-y-6">
        <p className="text-sm font-sans text-muted-foreground">
          Node pipeline orchestrator. Maps relationships across the Euclidean grid.
        </p>

        <div className="border border-border p-4 space-y-4">
          <div className="flex justify-between items-center text-xs font-mono uppercase">
            <span>Pipeline A</span>
            <span className="text-green-500">Active</span>
          </div>
          <div className="h-2 w-full bg-muted overflow-hidden">
            <div className="h-full bg-foreground w-3/4"></div>
          </div>
          
          <div className="flex justify-between items-center text-xs font-mono uppercase mt-4">
            <span>Pipeline B</span>
            <span className="text-yellow-500">Queued</span>
          </div>
          <div className="h-2 w-full bg-muted overflow-hidden">
            <div className="h-full bg-foreground w-1/4 opacity-30"></div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 p-2 border border-border flex justify-center items-center hover:bg-muted transition-colors">
            <GitCommit className="w-4 h-4" />
          </button>
          <button className="flex-1 p-2 border border-border flex justify-center items-center hover:bg-muted transition-colors">
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </BaseNode>
  );
}
