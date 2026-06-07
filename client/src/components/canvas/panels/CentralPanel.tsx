import { useState, ReactNode } from "react";
import { Maximize2, Minimize2, X, Move } from "lucide-react";
import { CodexNode } from "../nodes/CodexNode";
import { RwiNode } from "../nodes/RwiNode";
import { DamNode } from "../nodes/DamNode";
import { ThroughlineNode } from "../nodes/ThroughlineNode";
import { AdminNode } from "../nodes/AdminNode";
import { DataEngineNode } from "../nodes/DataEngineNode";

type TabId = "codex" | "rwi" | "dam" | "throughline" | "admin" | "data";

export function CentralPanel({ x, y }: { x: number; y: number }) {
  const [activeTab, setActiveTab] = useState<TabId>("dam");
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Start with roughly 30% of standard 1080p screen
  const [size, setSize] = useState({ width: 600, height: 600 });

  const tabs: { id: TabId; label: string; component: ReactNode }[] = [
    { id: "dam", label: "DAM", component: <DamNode x={0} y={0} /> },
    { id: "codex", label: "Codex", component: <CodexNode x={0} y={0} /> },
    { id: "rwi", label: "RWI Bot", component: <RwiNode x={0} y={0} /> },
    { id: "throughline", label: "Philosophy", component: <ThroughlineNode x={0} y={0} /> },
    { id: "admin", label: "Admin", component: <AdminNode x={0} y={0} /> },
    { id: "data", label: "Engine", component: <DataEngineNode x={0} y={0} /> },
  ];

  if (!isExpanded) {
    return (
      <div 
        className="absolute bg-background/95 border border-border backdrop-blur-md shadow-2xl flex flex-col cursor-move"
        style={{ transform: `translate3d(${x}px, ${y}px, 0)`, width: 300 }}
      >
        <div className="flex justify-between items-center p-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 text-muted-foreground" />
            <span className="font-mono text-xs uppercase tracking-widest text-primary">EUCLID Interface</span>
          </div>
          <button onClick={() => setIsExpanded(true)} className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground">
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="absolute bg-background/95 border border-border backdrop-blur-md shadow-2xl flex flex-col resize overflow-hidden"
      style={{ 
        transform: `translate3d(${x}px, ${y}px, 0)`,
        width: size.width,
        height: size.height,
        minWidth: 400,
        minHeight: 300
      }}
    >
      {/* Header / Drag Handle */}
      <div className="flex justify-between items-center p-2 border-b border-border bg-muted/20 cursor-move shrink-0">
        <div className="flex items-center gap-2 pl-2">
          <Move className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Project EUCLID // Unified Interface</span>
        </div>
        <div className="flex items-center">
          <button onClick={() => setIsExpanded(false)} className="p-2 hover:bg-muted text-muted-foreground hover:text-foreground">
            <Minimize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="w-40 border-r border-border bg-muted/10 flex flex-col shrink-0 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-4 font-mono text-[10px] uppercase tracking-widest transition-colors border-b border-border/50
                ${activeTab === tab.id 
                  ? "bg-primary/10 text-primary border-l-2 border-l-primary" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground border-l-2 border-l-transparent"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col p-4 bg-muted/5">
           {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </div>
      
      {/* Resize handle indicator */}
      <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-none opacity-50 flex items-end justify-end p-1">
        <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 0L0 6H6V0Z" />
        </svg>
      </div>
    </div>
  );
}