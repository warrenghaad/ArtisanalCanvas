import { useStudioStore } from '../state/useStudioStore';

export function DockContainer() {
  const { isDockVisible, toggleDock } = useStudioStore();

  if (!isDockVisible) {
    return (
      <button 
        onClick={toggleDock}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-background/80 backdrop-blur border border-border/50 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors z-40"
      >
        Dock
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-48 bg-background/90 backdrop-blur-md border-t border-primary/20 z-40 flex flex-col pointer-events-auto transform transition-transform duration-300">
      <div className="flex justify-between items-center px-4 py-2 border-b border-border/30">
        <div className="font-mono text-[10px] uppercase tracking-widest text-primary/70">
          Dock Viewer
        </div>
        <button 
          onClick={toggleDock}
          className="text-muted-foreground hover:text-primary transition-colors text-[10px] font-mono uppercase"
        >
          [Close]
        </button>
      </div>
      <div className="flex-1 p-4 flex gap-4 overflow-x-auto">
        {/* Placeholder for dock items/spawned content */}
        <div className="h-full w-64 border border-dashed border-primary/20 flex items-center justify-center text-[10px] font-mono text-muted-foreground shrink-0">
          [Empty Slot]
        </div>
        <div className="h-full w-64 border border-dashed border-primary/20 flex items-center justify-center text-[10px] font-mono text-muted-foreground shrink-0">
          [Empty Slot]
        </div>
        <div className="h-full w-64 border border-dashed border-primary/20 flex items-center justify-center text-[10px] font-mono text-muted-foreground shrink-0">
          [Empty Slot]
        </div>
      </div>
    </div>
  );
}
