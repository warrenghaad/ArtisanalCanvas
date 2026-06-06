import { BaseNode } from "./BaseNode";
import { Box, Play } from "lucide-react";

export function DamNode({ x, y }: { x: number, y: number }) {
  return (
    <BaseNode x={x} y={y} title="DAM / UI Workspace" width={500}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="font-mono text-xs uppercase tracking-widest">Active Canvas</div>
          <div className="font-mono text-[10px]">Viewport: Orthographic</div>
        </div>

        <div className="aspect-video border border-border relative overflow-hidden flex items-center justify-center bg-muted/20">
          <div className="absolute inset-0 bg-[url('/images/artifact_mesopotamian.png')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
          
          {/* Wireframe overlay mock */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border border-white/50 rotate-45 flex items-center justify-center">
              <div className="w-32 h-32 border border-white/50 -rotate-45 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 border border-border p-3 hover:bg-muted transition-colors flex justify-center items-center gap-2 font-mono text-xs uppercase">
            <Box className="w-4 h-4" /> Extract Wireframe
          </button>
          <button className="flex-1 border border-border bg-foreground text-background p-3 hover:opacity-90 transition-colors flex justify-center items-center gap-2 font-mono text-xs uppercase">
            <Play className="w-4 h-4" /> Simulate Motion
          </button>
        </div>
      </div>
    </BaseNode>
  );
}
