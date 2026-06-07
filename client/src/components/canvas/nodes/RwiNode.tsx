import { BaseNode } from "./BaseNode";
import { useState } from "react";
import { Upload } from "lucide-react";

export function RwiNode({ x, y }: { x?: number, y?: number }) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <BaseNode x={x} y={y} title="RWI Curator Bot">
      <div 
        className="space-y-6 relative h-full flex flex-col"
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          // Handle file drop in the future
        }}
      >
        <div className="bg-muted p-4 font-serif italic text-lg leading-relaxed border-l-2 border-primary">
          "I have scanned the Mesopotamian artifacts. The recurrence of the structural grid implies early bureaucratic control."
        </div>
        
        <div className="space-y-4 pt-4 border-t border-border flex-1">
          <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Recent Actions</div>
          <div className="flex gap-4 items-start">
            <div className="w-2 h-2 mt-1.5 bg-foreground"></div>
            <div>
              <div className="font-bold text-sm">Tagged MET artifact 4321</div>
              <div className="text-xs text-muted-foreground font-mono">12 mins ago</div>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="w-2 h-2 mt-1.5 bg-foreground"></div>
            <div>
              <div className="font-bold text-sm">Suggested structural link: Square to Early Writing</div>
              <div className="text-xs text-muted-foreground font-mono">1 hr ago</div>
            </div>
          </div>
        </div>

        {/* Drop Overlay */}
        {isDragging && (
          <div className="absolute inset-0 -m-4 bg-primary/10 backdrop-blur-sm border-2 border-dashed border-primary flex items-center justify-center flex-col z-10 pointer-events-none">
            <Upload className="w-12 h-12 text-primary mb-4 animate-bounce" />
            <div className="font-mono uppercase tracking-widest text-primary text-sm font-bold bg-background/80 px-4 py-2">
              Drop files to analyze
            </div>
          </div>
        )}
      </div>
    </BaseNode>
  );
}
