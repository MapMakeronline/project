import { create } from 'zustand';

interface HeaderStore {
  isMinimized: boolean;
  setIsMinimized: (isMinimized: boolean) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  isMinimized: false,
  setIsMinimized: (isMinimized) => set({ isMinimized }),
}));