import { BaseNode } from "./BaseNode";
import { Activity, Database, GitBranch } from "lucide-react";

export function AdminNode({ x, y }: { x: number, y: number }) {
  return (
    <BaseNode x={x} y={y} title="Admin Catalogue">
      <div className="space-y-6">
        <div className="flex justify-between items-center border border-border p-3">
          <span className="font-mono text-xs uppercase tracking-widest">System Status</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE</span>
        </div>
        
        <div className="space-y-2">
          <div className="font-mono text-xs uppercase tracking-widest mb-4">Active Modules</div>
          <div className="flex items-center gap-4 p-2 hover:bg-muted cursor-pointer transition-colors">
            <Database className="w-4 h-4" />
            <span>Registry Synchronizer</span>
          </div>
          <div className="flex items-center gap-4 p-2 hover:bg-muted cursor-pointer transition-colors">
            <Activity className="w-4 h-4" />
            <span>Ontology Inference Engine</span>
          </div>
          <div className="flex items-center gap-4 p-2 hover:bg-muted cursor-pointer transition-colors">
            <GitBranch className="w-4 h-4" />
            <span>Pipeline Integrator</span>
          </div>
        </div>

        <div className="border border-border p-4 mt-6">
          <div className="font-mono text-[10px] text-muted-foreground">
            > Last deployment: 4 hrs ago<br/>
            > Syncing artifact data...<br/>
            > Registry validation passed.
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
