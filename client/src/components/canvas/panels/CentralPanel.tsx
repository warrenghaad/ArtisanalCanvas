import { useState, ReactNode, useRef } from "react";
import { Rnd } from "react-rnd";
import { Maximize2, Minimize2, X, Move, ChevronRight, ChevronLeft } from "lucide-react";
import { CodexNode } from "../nodes/CodexNode";
import { RwiNode } from "../nodes/RwiNode";
import { DamNode } from "../nodes/DamNode";
import { ThroughlineNode } from "../nodes/ThroughlineNode";
import { AdminNode } from "../nodes/AdminNode";
import { DataEngineNode } from "../nodes/DataEngineNode";

type TabId = "codex" | "rwi" | "dam" | "throughline" | "admin" | "data";

export function CentralPanel() {
  const [activeTab, setActiveTab] = useState<TabId>("dam");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  
  const tabs: { id: TabId; label: string; component: ReactNode }[] = [
    { id: "dam", label: "DAM", component: <DamNode /> },
    { id: "codex", label: "Codex", component: <CodexNode /> },
    { id: "rwi", label: "RWI Bot", component: <RwiNode /> },
    { id: "throughline", label: "Philosophy", component: <ThroughlineNode /> },
    { id: "admin", label: "Admin", component: <AdminNode /> },
    { id: "data", label: "Engine", component: <DataEngineNode /> },
  ];

  if (!isVisible) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsVisible(true)}
          className="bg-background/95 border border-border backdrop-blur-md shadow-2xl p-3 hover:bg-muted/50 transition-colors flex flex-col items-center justify-center font-mono text-[10px] uppercase tracking-widest text-primary cursor-pointer pointer-events-auto"
        >
          Tools
        </button>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <Rnd
        default={{
          x: 24,
          y: 24,
          width: 250,
          height: 'auto',
        }}
        enableResizing={false}
        bounds="window"
        dragHandleClassName="drag-handle"
        className="z-50"
      >
        <div className="bg-background/95 border border-border backdrop-blur-md shadow-2xl flex flex-col cursor-default w-full">
          <div className="flex justify-between items-center p-3 border-b border-border bg-muted/20 drag-handle cursor-move">
            <div className="flex items-center gap-2">
              <Move className="w-4 h-4 text-muted-foreground" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">EUCLID Tools</span>
            </div>
            <div className="flex gap-1 pointer-events-auto">
              <button onClick={() => setIsExpanded(true)} className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground">
                <Maximize2 className="w-4 h-4" />
              </button>
              <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Rnd>
    );
  }

  return (
    <Rnd
      default={{
        x: 24,
        y: 24,
        width: 450,
        height: 600,
      }}
      minWidth={350}
      minHeight={400}
      bounds="window"
      dragHandleClassName="drag-handle"
      className="z-50 bg-background/95 border border-border backdrop-blur-md shadow-2xl flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.5)]"
      // Stop events from propagating to canvas
      onDragStart={(e) => { e.stopPropagation(); }}
      onMouseDown={(e) => { e.stopPropagation(); }}
      onWheel={(e) => { e.stopPropagation(); }}
      onTouchStart={(e) => { e.stopPropagation(); }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-border bg-muted/20 shrink-0 drag-handle cursor-move">
        <div className="flex items-center gap-2 pl-2">
          <Move className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Project EUCLID // Tools</span>
        </div>
        <div className="flex items-center gap-1 pointer-events-auto">
          <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground">
            <Minimize2 className="w-4 h-4" />
          </button>
          <button onClick={() => setIsVisible(false)} className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden pointer-events-auto">
        {/* Sidebar Tabs */}
        <div className="w-32 border-r border-border bg-muted/10 flex flex-col shrink-0 overflow-y-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-3 py-4 font-mono text-[10px] uppercase tracking-widest transition-colors border-b border-border/50
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
        <div 
          className="flex-1 relative overflow-auto flex flex-col p-4 bg-muted/5"
          onDragOver={(e) => {
            e.preventDefault();
            e.currentTarget.classList.add('bg-primary/5');
          }}
          onDragLeave={(e) => {
            e.currentTarget.classList.remove('bg-primary/5');
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('bg-primary/5');
            // Handle drop in the future
          }}
        >
           {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </div>
    </Rnd>
  );
}