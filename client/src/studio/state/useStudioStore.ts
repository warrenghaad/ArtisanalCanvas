import { create } from 'zustand';

export type WorkspaceId = 'gallery' | 'constellation' | 'mirror' | 'trace' | 'lesson-seed' | 'atlas';
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
    workspace: 'gallery',
    engine: 'graphnode',
    functionality: 'inspect-compare'
  },
  setPrismContext: (context) => 
    set((state) => ({ 
      prismContext: { ...state.prismContext, ...context } 
    })),
  isDockVisible: false,
  toggleDock: () => set((state) => ({ isDockVisible: !state.isDockVisible })),
}));
