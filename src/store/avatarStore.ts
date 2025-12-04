import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Avatar, BusinessInfo, ResearchData } from '@/types/avatar';

interface AvatarState {
  // Current avatar being generated/edited
  currentAvatar: Partial<Avatar> | null;
  currentBusinessInfo: BusinessInfo | null;
  currentResearchData: ResearchData | null;

  // Saved avatars
  savedAvatars: Avatar[];

  // UI state
  isGenerating: boolean;
  generationStep: string;
  generationProgress: number;
  error: string | null;

  // Comparison
  comparisonAvatars: Avatar[];

  // Actions
  setBusinessInfo: (info: BusinessInfo) => void;
  setResearchData: (data: ResearchData) => void;
  setCurrentAvatar: (avatar: Partial<Avatar>) => void;
  updateCurrentAvatar: (updates: Partial<Avatar>) => void;

  saveAvatar: (avatar: Avatar) => void;
  updateAvatar: (id: string, updates: Partial<Avatar>) => void;
  deleteAvatar: (id: string) => void;

  setGenerating: (isGenerating: boolean) => void;
  setGenerationStep: (step: string) => void;
  setGenerationProgress: (progress: number) => void;
  setError: (error: string | null) => void;

  addToComparison: (avatar: Avatar) => void;
  removeFromComparison: (id: string) => void;
  clearComparison: () => void;

  reset: () => void;
}

const initialState = {
  currentAvatar: null,
  currentBusinessInfo: null,
  currentResearchData: null,
  savedAvatars: [],
  isGenerating: false,
  generationStep: '',
  generationProgress: 0,
  error: null,
  comparisonAvatars: [],
};

export const useAvatarStore = create<AvatarState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setBusinessInfo: (info) => set({ currentBusinessInfo: info }),

      setResearchData: (data) => set({ currentResearchData: data }),

      setCurrentAvatar: (avatar) => set({ currentAvatar: avatar }),

      updateCurrentAvatar: (updates) => set((state) => ({
        currentAvatar: state.currentAvatar
          ? { ...state.currentAvatar, ...updates }
          : updates,
      })),

      saveAvatar: (avatar) => set((state) => ({
        savedAvatars: [avatar, ...state.savedAvatars.filter(a => a.id !== avatar.id)],
        currentAvatar: null,
      })),

      updateAvatar: (id, updates) => set((state) => ({
        savedAvatars: state.savedAvatars.map((avatar) =>
          avatar.id === id ? { ...avatar, ...updates, updatedAt: new Date().toISOString() } : avatar
        ),
      })),

      deleteAvatar: (id) => set((state) => ({
        savedAvatars: state.savedAvatars.filter((avatar) => avatar.id !== id),
        comparisonAvatars: state.comparisonAvatars.filter((avatar) => avatar.id !== id),
      })),

      setGenerating: (isGenerating) => set({ isGenerating }),

      setGenerationStep: (step) => set({ generationStep: step }),

      setGenerationProgress: (progress) => set({ generationProgress: progress }),

      setError: (error) => set({ error }),

      addToComparison: (avatar) => set((state) => {
        if (state.comparisonAvatars.length >= 3) return state;
        if (state.comparisonAvatars.some((a) => a.id === avatar.id)) return state;
        return { comparisonAvatars: [...state.comparisonAvatars, avatar] };
      }),

      removeFromComparison: (id) => set((state) => ({
        comparisonAvatars: state.comparisonAvatars.filter((a) => a.id !== id),
      })),

      clearComparison: () => set({ comparisonAvatars: [] }),

      reset: () => set(initialState),
    }),
    {
      name: 'avatar-storage',
      partialize: (state) => ({
        savedAvatars: state.savedAvatars,
      }),
    }
  )
);
