import { BaseNode } from "./BaseNode";
import { Activity, Database, GitBranch, Share2 } from "lucide-react";

export function AdminNode({ x, y }: { x: number, y: number }) {
  return (
    <BaseNode x={x} y={y} title="Admin Catalogue" width={450}>
      <div className="space-y-6">
        <div className="flex justify-between items-center border border-border p-3">
          <span className="font-mono text-xs uppercase tracking-widest">System Status</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> ONLINE</span>
        </div>
        
        <div className="space-y-2">
          <div className="font-mono text-xs uppercase tracking-widest mb-4 flex justify-between items-center">
            <span>Property Graph</span>
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </div>
          
          <div className="aspect-[4/3] border border-border relative bg-muted/10 overflow-hidden group">
            {/* Simulated property graph visual */}
            <div className="absolute inset-0 opacity-50 flex items-center justify-center">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="stroke-primary">
                <circle cx="50%" cy="50%" r="4" className="fill-primary" />
                <circle cx="20%" cy="30%" r="3" className="fill-primary/60" />
                <circle cx="80%" cy="40%" r="3" className="fill-primary/60" />
                <circle cx="30%" cy="70%" r="3" className="fill-primary/60" />
                <circle cx="70%" cy="80%" r="3" className="fill-primary/60" />
                
                <line x1="50%" y1="50%" x2="20%" y2="30%" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
                <line x1="50%" y1="50%" x2="80%" y2="40%" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
                <line x1="50%" y1="50%" x2="30%" y2="70%" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
                <line x1="50%" y1="50%" x2="70%" y2="80%" strokeWidth="1" strokeDasharray="4 4" className="opacity-50" />
                <line x1="20%" y1="30%" x2="30%" y2="70%" strokeWidth="1" strokeDasharray="4 4" className="opacity-20" />
                <line x1="80%" y1="40%" x2="70%" y2="80%" strokeWidth="1" strokeDasharray="4 4" className="opacity-20" />
              </svg>
            </div>
            
            <div className="absolute top-2 left-2 text-[10px] font-mono text-primary bg-background/80 px-1">
              Nodes: 1,432 | Edges: 3,921
            </div>
            <div className="absolute bottom-2 left-2 right-2 text-[9px] font-mono text-muted-foreground leading-tight p-2 bg-background/90 border border-border">
              Select a node to inspect curated image properties, confidence scores, and categorical mappings.
            </div>
          </div>
        </div>

        <div className="border border-border p-4 mt-6">
          <div className="font-mono text-[10px] text-muted-foreground">
            &gt; Analyzing semantic clusters...<br/>
            &gt; Syncing artifact data...<br/>
            &gt; Registry validation passed.
          </div>
        </div>
      </div>
    </BaseNode>
  );
}
