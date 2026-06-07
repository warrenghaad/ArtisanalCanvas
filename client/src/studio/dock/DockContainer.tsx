import { useStudioStore } from '../state/useStudioStore';

export function DockContainer() {
  const { isDockVisible, toggleDock, prismContext } = useStudioStore();

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
      'gallery': 'Gallery',
      'constellation': 'Constellation',
      'mirror': 'Mirror',
      'trace': 'Trace',
      'lesson-seed': 'Lesson Seed',
      'atlas': 'Atlas'
    };
    return titles[workspace] || workspace;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-64 bg-background/95 backdrop-blur-md border-t border-primary/20 z-40 flex flex-col pointer-events-auto shadow-[0_-10px_40px_rgba(var(--primary),0.05)]">
      {/* Header / Context Bar */}
      <div className="flex justify-between items-center px-6 py-2 border-b border-border/30 bg-muted/20">
        <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-primary/70">
          <span className="text-primary">{getWorkspaceTitle(prismContext.workspace)}</span>
          <span className="text-primary/30">/</span>
          <span>{prismContext.engine}</span>
          <span className="text-primary/30">/</span>
          <span>{prismContext.functionality}</span>
        </div>
        <div className="flex gap-4">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/50">
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
      <div className="flex-1 p-6 flex gap-6 overflow-x-auto items-center">
        {/* Placeholder widget 1 */}
        <div className="h-full w-80 bg-background/50 border border-primary/20 flex flex-col relative group hover:border-primary/40 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
          <div className="p-3 border-b border-primary/10 flex justify-between">
            <span className="font-mono text-[10px] uppercase text-muted-foreground group-hover:text-primary transition-colors">Engine Status</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse"></span>
          </div>
          <div className="p-4 flex-1 flex flex-col justify-center gap-2">
            <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-2/3"></div>
            </div>
            <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
              <div className="h-full bg-primary/60 w-1/2"></div>
            </div>
          </div>
        </div>

        {/* Placeholder widget 2 */}
        <div className="h-full w-80 bg-background/50 border border-primary/20 flex flex-col relative group hover:border-primary/40 transition-colors">
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary/20 group-hover:bg-primary transition-colors"></div>
          <div className="p-3 border-b border-primary/10">
            <span className="font-mono text-[10px] uppercase text-muted-foreground group-hover:text-primary transition-colors">Active Nodes</span>
          </div>
          <div className="p-4 flex-1 font-mono text-xs text-primary/80 leading-relaxed overflow-y-auto">
            {`> Analyzing ${getWorkspaceTitle(prismContext.workspace)}
> Engine: ${prismContext.engine}
> Function: ${prismContext.functionality}
> Awaiting input...`}
          </div>
        </div>

        {/* Action widget */}
        <div className="h-full w-64 border border-dashed border-primary/30 flex flex-col items-center justify-center gap-4 hover:border-primary/60 transition-colors cursor-pointer group bg-background/30 hover:bg-primary/5">
          <div className="w-8 h-8 rounded-full border border-primary/40 flex items-center justify-center group-hover:bg-primary/20 transition-colors group-hover:border-primary">
            <span className="text-primary text-lg font-light group-hover:scale-110 transition-transform">+</span>
          </div>
          <span className="font-mono text-[10px] uppercase text-muted-foreground group-hover:text-primary transition-colors">
            Summon Evidence
          </span>
        </div>
      </div>
    </div>
  );
}
