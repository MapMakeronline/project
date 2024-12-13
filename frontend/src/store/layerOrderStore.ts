import { create } from 'zustand';

export type BuiltInSectionId = 'base' | 'postgis' | 'sheets' | 'folders';
export type LayerSectionId = BuiltInSectionId | string; // string for custom section IDs

interface LayerOrderState {
  order: LayerSectionId[];
  addSection: (id: string) => void;
  removeSection: (id: string) => void;
  setOrder: (newOrder: LayerSectionId[]) => void;
}

export const useLayerOrderStore = create<LayerOrderState>((set) => ({
  order: ['base', 'postgis', 'sheets', 'folders'],
  addSection: (id: string) =>
    set((state) => ({
      order: [...state.order, id],
    })),
  removeSection: (id: string) =>
    set((state) => ({
      order: state.order.filter((sectionId) => sectionId !== id),
    })),
  setOrder: (newOrder) => set({ order: newOrder }),
}));
