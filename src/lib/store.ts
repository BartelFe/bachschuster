import { create } from 'zustand';

export type CursorMode = 'default' | 'link' | 'media' | 'data' | 'audio' | 'hidden';

interface UIState {
  // Sound
  isSoundEnabled: boolean;
  setSoundEnabled: (v: boolean) => void;
  toggleSound: () => void;
  hasShownSoundToast: boolean;
  markSoundToastShown: () => void;

  // Section tracking — set by ScrollTrigger callbacks on section enter
  currentSection: string | null;
  setCurrentSection: (id: string | null) => void;

  // Cursor mode — set by data-cursor attribute observers on hover
  cursorMode: CursorMode;
  setCursorMode: (mode: CursorMode) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSoundEnabled: false,
  setSoundEnabled: (v) => set({ isSoundEnabled: v }),
  toggleSound: () => set((state) => ({ isSoundEnabled: !state.isSoundEnabled })),

  hasShownSoundToast: false,
  markSoundToastShown: () => set({ hasShownSoundToast: true }),

  currentSection: null,
  setCurrentSection: (id) => set({ currentSection: id }),

  cursorMode: 'default',
  setCursorMode: (mode) => set({ cursorMode: mode }),
}));
