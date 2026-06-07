import { useState } from 'react';
import { useStudioStore, WorkspaceId, EngineId, FunctionalityId } from '../state/useStudioStore';

const WORKSPACES: { id: WorkspaceId; label: string }[] = [
  { id: 'meta-navigation', label: 'Meta-Nav' },
  { id: 'research-drafting', label: 'Research' },
  { id: 'drafting-building', label: 'Drafting' },
  { id: 'building-production', label: 'Building' },
  { id: 'production-final', label: 'Production' },
  { id: 'inspect-repair-debug', label: 'Debug' },
];

const ENGINES: { id: EngineId; label: string }[] = [
  { id: 'graphnode', label: 'GraphNode' },
  { id: 'rwi', label: 'RWI Bot' },
  { id: 'assembler', label: 'Assembler' },
  { id: 'frontend-final-use', label: 'Final Use' },
];

const FUNCTIONALITIES: { id: FunctionalityId; label: string }[] = [
  { id: 'search-scope', label: 'Search' },
  { id: 'inspect-compare', label: 'Inspect' },
  { id: 'arrange-transform', label: 'Arrange' },
  { id: 'preview-validate', label: 'Preview' },
];

export function PrismSelector() {
  const { prismContext, setPrismContext } = useStudioStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 pointer-events-auto">
      {isOpen ? (
        <div className="bg-background/95 border border-border backdrop-blur-md shadow-2xl p-4 flex flex-col gap-4 font-mono text-[10px] uppercase tracking-widest text-primary w-64 mb-2">
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <span>Prism Context</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-foreground">
              [CLOSE]
            </button>
          </div>
          
          <div className="space-y-1">
            <div className="text-muted-foreground mb-1">Workspace</div>
            <select 
              value={prismContext.workspace}
              onChange={(e) => setPrismContext({ workspace: e.target.value as WorkspaceId })}
              className="w-full bg-muted/20 border border-border/50 p-1 text-foreground focus:outline-none"
            >
              {WORKSPACES.map(w => <option key={w.id} value={w.id}>{w.label}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-muted-foreground mb-1">Engine</div>
            <select 
              value={prismContext.engine}
              onChange={(e) => setPrismContext({ engine: e.target.value as EngineId })}
              className="w-full bg-muted/20 border border-border/50 p-1 text-foreground focus:outline-none"
            >
              {ENGINES.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <div className="text-muted-foreground mb-1">Functionality</div>
            <select 
              value={prismContext.functionality}
              onChange={(e) => setPrismContext({ functionality: e.target.value as FunctionalityId })}
              className="w-full bg-muted/20 border border-border/50 p-1 text-foreground focus:outline-none"
            >
              {FUNCTIONALITIES.map(f => <option key={f.id} value={f.id}>{f.label}</option>)}
            </select>
          </div>
        </div>
      ) : null}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-background/95 border border-border backdrop-blur-md shadow-2xl p-3 hover:bg-muted/50 transition-colors flex items-center justify-center font-mono text-[10px] uppercase tracking-widest text-primary"
      >
        Prism: {WORKSPACES.find(w => w.id === prismContext.workspace)?.label} × {ENGINES.find(e => e.id === prismContext.engine)?.label}
      </button>
    </div>
  );
}
