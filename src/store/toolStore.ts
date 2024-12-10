import { create } from 'zustand';

interface ToolStore {
  activeTool: string | null;
  setActiveTool: (tool: string | null) => void;
}

export const useToolStore = create<ToolStore>((set) => ({
  activeTool: null,
  setActiveTool: (tool) => set({ activeTool: tool }),
}));