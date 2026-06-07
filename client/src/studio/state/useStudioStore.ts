import { create } from 'zustand';

export type WorkspaceId = 'meta-navigation' | 'research-drafting' | 'drafting-building' | 'building-production' | 'production-final' | 'inspect-repair-debug';
export type EngineId = 'graphnode' | 'rwi' | 'assembler' | 'frontend-final-use';
export type FunctionalityId = 'search-scope' | 'inspect-compare' | 'arrange-transform' | 'preview-validate';

export interface PrismContext {
  workspace: WorkspaceId;
  engine: EngineId;
  functionality: FunctionalityId;
}

export interface StudioState {
  prismContext: PrismContext;
  setPrismContext: (context: Partial<PrismContext>) => void;
  isDockVisible: boolean;
  toggleDock: () => void;
}

export const useStudioStore = create<StudioState>((set) => ({
  prismContext: {
    workspace: 'research-drafting',
    engine: 'graphnode',
    functionality: 'inspect-compare'
  },
  setPrismContext: (context) => 
    set((state) => ({ 
      prismContext: { ...state.prismContext, ...context } 
    })),
  isDockVisible: true,
  toggleDock: () => set((state) => ({ isDockVisible: !state.isDockVisible })),
}));
