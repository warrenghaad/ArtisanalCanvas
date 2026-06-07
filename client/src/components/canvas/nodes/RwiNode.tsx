import { BaseNode } from "./BaseNode";

export function RwiNode({ x, y }: { x?: number, y?: number }) {
  return (
    <BaseNode x={x} y={y} title="RWI Curator Bot">
      <div className="space-y-6">
        <div className="bg-muted p-4 font-serif italic text-lg leading-relaxed border-l-2 border-primary">
          "I have scanned the Mesopotamian artifacts. The recurrence of the structural grid implies early bureaucratic control."
        </div>
        
        <div className="space-y-4 pt-4 border-t border-border">
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
      </div>
    </BaseNode>
  );
}
