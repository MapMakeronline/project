import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LayerSectionId = 'base' | 'postgis' | 'sheets';

interface LayerOrderStore {
  order: LayerSectionId[];
  setOrder: (order: LayerSectionId[]) => void;
}

const defaultOrder: LayerSectionId[] = ['base', 'postgis', 'sheets'];

export const useLayerOrderStore = create<LayerOrderStore>()(
  persist(
    (set) => ({
      order: defaultOrder,
      setOrder: (order) => set({ order }),
    }),
    {
      name: 'layer-order',
    }
  )
);