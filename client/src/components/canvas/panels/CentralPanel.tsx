import { useState, ReactNode, useEffect, useRef } from "react";
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
  const panelRef = useRef<HTMLDivElement>(null);
  
  // Use fixed positioning on the side instead of absolute canvas coordinates
  
  const tabs: { id: TabId; label: string; component: ReactNode }[] = [
    { id: "dam", label: "DAM", component: <DamNode /> },
    { id: "codex", label: "Codex", component: <CodexNode /> },
    { id: "rwi", label: "RWI Bot", component: <RwiNode /> },
    { id: "throughline", label: "Philosophy", component: <ThroughlineNode /> },
    { id: "admin", label: "Admin", component: <AdminNode /> },
    { id: "data", label: "Engine", component: <DataEngineNode /> },
  ];

  // Stop events from propagating to canvas
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    const stopPropagation = (e: Event) => {
      e.stopPropagation();
    };

    el.addEventListener('pointerdown', stopPropagation);
    el.addEventListener('wheel', stopPropagation);
    
    return () => {
      el.removeEventListener('pointerdown', stopPropagation);
      el.removeEventListener('wheel', stopPropagation);
    };
  }, []);

  if (!isExpanded) {
    return (
      <div 
        ref={panelRef}
        className="fixed top-6 right-6 bg-background/95 border border-border backdrop-blur-md shadow-2xl flex flex-col z-50 w-48 cursor-default transition-all duration-300"
      >
        <div className="flex justify-between items-center p-3 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-primary">EUCLID Tools</span>
          </div>
          <button onClick={() => setIsExpanded(true)} className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={panelRef}
      className="fixed top-6 right-6 bottom-6 bg-background/95 border border-border backdrop-blur-md shadow-2xl flex flex-col z-50 w-[450px] cursor-default transition-all duration-300 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]"
    >
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-border bg-muted/20 shrink-0">
        <div className="flex items-center gap-2 pl-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Project EUCLID // Tools</span>
        </div>
        <div className="flex items-center">
          <button onClick={() => setIsExpanded(false)} className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
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
        <div className="flex-1 relative overflow-auto flex flex-col p-4 bg-muted/5">
           {tabs.find(t => t.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}