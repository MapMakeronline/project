import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayerStore {
  activeBaseLayer: string;
  customBaseLayers: Array<{
    id: string;
    name: string;
    url: string;
    attribution?: string;
  }>;
  setActiveBaseLayer: (id: string) => void;
  addCustomBaseLayer: (layer: { name: string; url: string; attribution?: string }) => void;
  removeCustomBaseLayer: (id: string) => void;
}

export const useLayerStore = create<LayerStore>()(
  persist(
    (set) => ({
      activeBaseLayer: 'osm',
      customBaseLayers: [],
      setActiveBaseLayer: (id) => set({ activeBaseLayer: id }),
      addCustomBaseLayer: (layer) => 
        set((state) => ({
          customBaseLayers: [
            ...state.customBaseLayers,
            { ...layer, id: crypto.randomUUID() }
          ]
        })),
      removeCustomBaseLayer: (id) =>
        set((state) => ({
          customBaseLayers: state.customBaseLayers.filter(layer => layer.id !== id)
        }))
    }),
    {
      name: 'layer-store'
    }
  )
);