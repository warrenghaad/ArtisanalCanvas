import { BaseNode } from "./BaseNode";
import { Box, Play, Download, Settings, Image as ImageIcon } from "lucide-react";

export function DamNode({ x, y }: { x: number, y: number }) {
  return (
    <BaseNode x={x} y={y} title="DAM / Curation Engine" width={500}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="font-mono text-xs uppercase tracking-widest text-primary">Curation Status</div>
          <div className="font-mono text-[10px] text-green-500 animate-pulse">Running</div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="border border-border p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer group">
            <Download className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-mono text-[10px] uppercase text-center">Image<br/>Downloading</span>
          </div>
          <div className="border border-border p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer group bg-muted/20">
            <ImageIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-mono text-[10px] uppercase text-center">Dataset<br/>Curation</span>
          </div>
          <div className="border border-border p-4 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors cursor-pointer group">
            <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="font-mono text-[10px] uppercase text-center">LLM<br/>Processing</span>
          </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold uppercase tracking-widest">LLM Curation Prompt</label>
           <textarea 
             className="w-full h-24 bg-muted/30 border border-border p-3 text-[10px] font-mono resize-none focus:outline-none focus:border-primary transition-colors leading-relaxed"
             defaultValue={"Analyze incoming artifacts and determine if their primary structure aligns with our definition of 'Monumental Brutalism'. Discard images with low structural clarity."}
           />
        </div>

        <div className="border border-border p-3 bg-muted/10 font-mono text-[10px] text-muted-foreground">
          <div className="mb-1 text-primary">Recent Activity:</div>
          <div>&gt; Downloaded 14 new candidates</div>
          <div>&gt; Filtered out 9 (low contrast)</div>
          <div>&gt; LLM accepted 2 for the 'Square' category</div>
        </div>
      </div>
    </BaseNode>
  );
}
