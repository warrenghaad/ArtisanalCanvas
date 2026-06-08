import { useStudioStore } from '../state/useStudioStore';

export function DockContainer() {
  const { isDockVisible, toggleDock, prismContext, selectedCanvasNode, saveFixture, lastSaved } = useStudioStore();

  if (!isDockVisible) {
    return (
      <button 
        onClick={toggleDock}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-background/80 backdrop-blur border border-border/50 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors z-40"
      >
        Open Surface
      </button>
    );
  }

  // Get current workspace label
  const getWorkspaceTitle = (workspace: string) => {
    const titles: Record<string, string> = {
      'meta-navigation': 'Meta-Nav',
      'research-drafting': 'Research',
      'drafting-building': 'Drafting',
      'building-production': 'Building',
      'production-final': 'Production',
      'inspect-repair-debug': 'Debug'
    };
    return titles[workspace] || workspace;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-72 bg-background/95 backdrop-blur-md border-t border-primary/20 z-40 flex flex-col pointer-events-auto shadow-[0_-10px_40px_rgba(var(--primary),0.05)]">
      {/* Header / Context Bar */}
      <div className="flex justify-between items-center px-6 py-2 border-b border-border/30 bg-muted/20">
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-primary/70">
          <span className="text-primary">{getWorkspaceTitle(prismContext.workspace)}</span>
          <span className="text-primary/30">/</span>
          <span>{prismContext.engine}</span>
          <span className="text-primary/30">/</span>
          <span>{prismContext.functionality}</span>
        </div>
        <div className="flex items-center gap-4">
          {lastSaved && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-green-500/70">
              State Saved
            </span>
          )}
          <button
            onClick={saveFixture}
            className="text-muted-foreground hover:text-primary transition-colors text-[10px] font-mono uppercase px-2 py-1 border border-border/30 hover:border-primary/50"
          >
            Save Fixture
          </button>
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50 ml-4">
            [Summoned Room]
          </span>
          <button 
            onClick={toggleDock}
            className="text-muted-foreground hover:text-primary transition-colors text-[10px] font-mono uppercase"
          >
            [Dismiss]
          </button>
        </div>
      </div>

      {/* Surface Content Area */}
      <div className="flex-1 p-6 flex gap-6 overflow-x-auto items-stretch">
        
        {/* Cell Inspector Viewer */}
        <div className="h-full w-[400px] flex-shrink-0 bg-background/50 border border-primary/20 flex flex-col relative group hover:border-primary/40 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
          <div className="p-3 border-b border-primary/10 flex justify-between items-center">
            <span className="font-mono text-[10px] uppercase text-muted-foreground group-hover:text-primary transition-colors">Cell Inspector</span>
            <span className={`w-1.5 h-1.5 rounded-full ${selectedCanvasNode ? 'bg-primary animate-pulse' : 'bg-muted'}`}></span>
          </div>
          <div className="p-4 flex-1 flex flex-col gap-3 font-mono text-xs overflow-y-auto">
            {selectedCanvasNode ? (
              <>
                <div className="flex items-center justify-between border-b border-primary/10 pb-2 mb-2">
                  <span className="text-primary uppercase">{selectedCanvasNode.label}</span>
                  <span className="text-[9px] text-muted-foreground uppercase px-1.5 py-0.5 border border-primary/20 rounded-sm">
                    {selectedCanvasNode.type}
                  </span>
                </div>
                
                <div className="text-primary/70 mb-2">
                  <span className="text-muted-foreground">Scope //</span> {selectedCanvasNode.data?.scope || 'Unknown'}
                </div>
                
                <div>
                  <span className="text-muted-foreground mb-1 block">Properties //</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedCanvasNode.data?.properties?.map((prop: string) => (
                      <span key={prop} className="px-2 py-1 bg-primary/10 text-primary/80 border border-primary/20 text-[9px] uppercase">
                        {prop}
                      </span>
                    )) || <span className="text-muted-foreground/50">None</span>}
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t border-primary/10 flex gap-2">
                  <button className="flex-1 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 uppercase text-[9px] transition-colors">Edit Node</button>
                  <button className="flex-1 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 uppercase text-[9px] transition-colors">Trace Rel</button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground/50 text-center uppercase tracking-widest opacity-50">
                Select a canvas object<br/>to inspect its properties
              </div>
            )}
          </div>
        </div>

        {/* Engine Status Widget */}
        <div className="h-full w-80 flex-shrink-0 bg-background/50 border border-primary/20 flex flex-col relative group hover:border-primary/40 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
          <div className="p-3 border-b border-primary/10 flex justify-between">
            <span className="font-mono text-[10px] uppercase text-muted-foreground group-hover:text-primary transition-colors">Engine Context</span>
          </div>
          <div className="p-4 flex-1 font-mono text-[10px] text-primary/80 leading-relaxed flex flex-col gap-4">
            <div>
              <span className="text-muted-foreground">Workspace:</span> <br/>
              <span className="uppercase text-primary/90 text-xs">{getWorkspaceTitle(prismContext.workspace)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Active Engine:</span> <br/>
              <span className="uppercase text-primary/90 text-xs">{prismContext.engine}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Functionality:</span> <br/>
              <span className="uppercase text-primary/90 text-xs">{prismContext.functionality}</span>
            </div>
          </div>
        </div>

        {/* Action widget */}
        <div className="h-full w-64 flex-shrink-0 border border-dashed border-primary/30 flex flex-col items-center justify-center gap-4 hover:border-primary/60 transition-colors cursor-pointer group bg-background/30 hover:bg-primary/5">
          <div className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:border-primary">
            <span className="text-primary text-lg font-light group-hover:scale-110 transition-transform">+</span>
          </div>
          <span className="font-mono text-[10px] uppercase text-muted-foreground group-hover:text-primary transition-colors text-center px-4">
            Summon Evidence<br/>or Concepts
          </span>
        </div>
      </div>
    </div>
  );
}
