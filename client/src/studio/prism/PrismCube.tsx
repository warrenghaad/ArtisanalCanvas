import { useStudioStore, EngineId, FunctionalityId } from '../state/useStudioStore';

export function PrismCube() {
  const { prismContext, setPrismContext } = useStudioStore();
  
  const workspaces = [
    { id: 'meta-navigation', label: 'Meta' },
    { id: 'research-drafting', label: 'Research' },
    { id: 'drafting-building', label: 'Draft' },
    { id: 'building-production', label: 'Build' },
    { id: 'production-final', label: 'Produce' },
    { id: 'inspect-repair-debug', label: 'Debug' },
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

  const handleToolClick = (tool: typeof tools[0]) => {
    setPrismContext({
      engine: tool.engine,
      functionality: tool.functionality
    });
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    setPrismContext({ workspace: workspaceId as any });
  };

  return (
    <div className="fixed bottom-12 left-6 z-50 pointer-events-auto">
      <div className="w-[300px] bg-[#0A0F1C]/95 border border-[#4466FF]/30 backdrop-blur-md shadow-[0_0_30px_rgba(68,102,255,0.1)] flex flex-col rounded-sm overflow-hidden">
        
        {/* Workspace Tabs - Clean, no extra whitespace */}
        <div className="flex bg-[#050A15]/80">
          {workspaces.map((ws) => {
            const isActive = prismContext.workspace === ws.id;
            return (
              <button
                key={ws.id}
                onClick={() => handleWorkspaceChange(ws.id)}
                className={`py-2 px-0 flex-1 text-[8px] font-mono uppercase tracking-widest transition-colors border-r border-b border-[#4466FF]/10 last:border-r-0
                  ${isActive 
                    ? 'bg-[#4466FF]/20 text-[#88aaff] border-b-[#88aaff] shadow-inner font-bold' 
                    : 'text-[#88aaff]/50 hover:text-[#88aaff] hover:bg-[#4466FF]/10'}`}
              >
                {ws.label}
              </button>
            );
          })}
        </div>

        {/* Tools Grid - Tight packing */}
        <div className="bg-[#050A15]">
          <div className="grid grid-cols-4 grid-rows-4 gap-px bg-[#4466FF]/20 border-b border-[#4466FF]/20">
            {tools.map((tool, i) => {
              const isActive = prismContext.engine === tool.engine && 
                             prismContext.functionality === tool.functionality;
              
              return (
                <button 
                  key={i} 
                  className={`flex items-center justify-center py-2.5 text-[8px] font-mono transition-all duration-200 uppercase
                    ${isActive 
                      ? 'bg-[#4466FF]/30 text-white shadow-[0_0_15px_rgba(68,102,255,0.4)] z-10 font-bold border border-[#88aaff]/50' 
                      : 'bg-[#0A0F1C] hover:bg-[#4466FF]/20 text-[#88aaff]/70'}`}
                  onClick={() => handleToolClick(tool)}
                >
                  {tool.label}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="px-3 py-1.5 bg-[#050A15]/90 text-[8px] font-mono text-[#88aaff]/50 uppercase tracking-widest flex justify-between">
          <span>{prismContext.engine}</span>
          <span>{prismContext.functionality}</span>
        </div>
      </div>
    </div>
  );
}
