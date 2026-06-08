import { useState } from 'react';
import { useStudioStore, EngineId, FunctionalityId } from '../state/useStudioStore';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

export function PrismCube() {
  const { prismContext, setPrismContext } = useStudioStore();
  
  // Track continuous rotation to avoid snapping back when angles pass 360
  const [rotation, setRotation] = useState({ x: -15, y: 25 });

  const handleRotate = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'left') setRotation(r => ({ ...r, y: r.y - 90 }));
    if (direction === 'right') setRotation(r => ({ ...r, y: r.y + 90 }));
    if (direction === 'up') setRotation(r => ({ ...r, x: r.x + 90 }));
    if (direction === 'down') setRotation(r => ({ ...r, x: r.x - 90 }));
  };

  const faces = [
    { id: 'meta-navigation', label: 'Meta-Nav', transform: 'translateZ(100px)' },
    { id: 'research-drafting', label: 'Research', transform: 'rotateY(90deg) translateZ(100px)' },
    { id: 'drafting-building', label: 'Drafting', transform: 'rotateY(180deg) translateZ(100px)' },
    { id: 'building-production', label: 'Building', transform: 'rotateY(-90deg) translateZ(100px)' },
    { id: 'production-final', label: 'Production', transform: 'rotateX(90deg) translateZ(100px)' },
    { id: 'inspect-repair-debug', label: 'Debug', transform: 'rotateX(-90deg) translateZ(100px)' },
  ];

  // Map 16 tools to combinations of engine and functionality for the store
  const tools: { label: string; engine: EngineId; functionality: FunctionalityId }[] = [
    { label: "RWI", engine: "rwi", functionality: "search-scope" },
    { label: "Graph", engine: "graphnode", functionality: "inspect-compare" },
    { label: "Asmblr", engine: "assembler", functionality: "arrange-transform" },
    { label: "Final", engine: "frontend-final-use", functionality: "preview-validate" },
    { label: "Scope", engine: "graphnode", functionality: "search-scope" },
    { label: "Cmpare", engine: "rwi", functionality: "inspect-compare" },
    { label: "Trnsfm", engine: "assembler", functionality: "arrange-transform" },
    { label: "Vldate", engine: "frontend-final-use", functionality: "preview-validate" },
    { label: "Codex", engine: "graphnode", functionality: "inspect-compare" },
    { label: "DAM", engine: "rwi", functionality: "arrange-transform" },
    { label: "Rules", engine: "assembler", functionality: "preview-validate" },
    { label: "Ontol", engine: "graphnode", functionality: "search-scope" },
    { label: "Debug", engine: "rwi", functionality: "inspect-compare" },
    { label: "Trace", engine: "graphnode", functionality: "arrange-transform" },
    { label: "Audit", engine: "assembler", functionality: "preview-validate" },
    { label: "Sync", engine: "frontend-final-use", functionality: "search-scope" }
  ];

  const handleCubieClick = (workspaceId: string, tool: typeof tools[0]) => {
    // Update the global state with the new context
    setPrismContext({
      workspace: workspaceId as any,
      engine: tool.engine,
      functionality: tool.functionality
    });
    
    // Ensure dock is visible when a tool is selected
    useStudioStore.setState({ isDockVisible: true });
  };

  return (
    <div 
      className="fixed bottom-32 left-24 z-50 pointer-events-auto"
      style={{ perspective: '1200px' }}
    >
      <div 
        className="w-[200px] h-[200px] relative transition-transform duration-700 ease-out"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
        }}
      >
        {faces.map((face) => (
          <div 
            key={face.id}
            className="absolute w-full h-full bg-background/95 border border-primary/40 backdrop-blur-md flex flex-col overflow-hidden shadow-[0_0_30px_rgba(var(--primary),0.1)]"
            style={{ 
              transform: face.transform,
              backfaceVisibility: 'hidden'
            }}
          >
            {/* Face Header */}
            <div className={`text-center font-mono text-[10px] uppercase tracking-widest py-1.5 shadow-inner border-b transition-colors
              ${prismContext.workspace === face.id 
                ? 'bg-primary text-primary-foreground border-primary' 
                : 'bg-primary/10 text-primary border-primary/30'}`}
            >
              {face.label}
            </div>
            
            {/* 16 Cubies (4x4 Grid) */}
            <div className="grid grid-cols-4 grid-rows-4 gap-[2px] flex-1 p-2 bg-muted/20">
              {tools.map((tool, i) => {
                const isActive = prismContext.workspace === face.id && 
                               prismContext.engine === tool.engine && 
                               prismContext.functionality === tool.functionality;
                
                return (
                  <button 
                    key={i} 
                    className={`border flex items-center justify-center text-[8px] font-mono transition-all duration-200 uppercase
                      ${isActive 
                        ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]' 
                        : 'bg-background/80 hover:bg-primary/50 text-foreground border-border/50'}`}
                    onClick={() => handleCubieClick(face.id, tool)}
                  >
                    {tool.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Orbit Controls */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-2 bg-background/80 backdrop-blur-sm border border-border/50 p-1.5 rounded-full shadow-xl">
        <button onClick={() => handleRotate('left')} className="p-1.5 text-primary hover:bg-primary/20 rounded-full transition-colors"><ChevronLeft className="w-4 h-4" /></button>
        <div className="flex flex-col gap-1">
          <button onClick={() => handleRotate('up')} className="p-1 text-primary hover:bg-primary/20 rounded-full transition-colors"><ChevronUp className="w-4 h-4" /></button>
          <button onClick={() => handleRotate('down')} className="p-1 text-primary hover:bg-primary/20 rounded-full transition-colors"><ChevronDown className="w-4 h-4" /></button>
        </div>
        <button onClick={() => handleRotate('right')} className="p-1.5 text-primary hover:bg-primary/20 rounded-full transition-colors"><ChevronRight className="w-4 h-4" /></button>
      </div>
    </div>
  );
}
