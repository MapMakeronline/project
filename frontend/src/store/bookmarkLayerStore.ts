import { create } from 'zustand';

export interface BookmarkLayer {
  id: string;
  name: string;
  visible: boolean;
}

interface BookmarkLayerState {
  layers: BookmarkLayer[];
  addLayer: (name: string) => void;
  toggleLayerVisibility: (id: string) => void;
  removeLayer: (id: string) => void;
}

export const useBookmarkLayerStore = create<BookmarkLayerState>((set) => ({
  layers: [],
  addLayer: (name: string) =>
    set((state) => ({
      layers: [
        ...state.layers,
        {
          id: Math.random().toString(36).substr(2, 9),
          name,
          visible: true,
        },
      ],
    })),
  toggleLayerVisibility: (id: string) =>
    set((state) => ({
      layers: state.layers.map((layer) =>
        layer.id === id ? { ...layer, visible: !layer.visible } : layer
      ),
    })),
  removeLayer: (id: string) =>
    set((state) => ({
      layers: state.layers.filter((layer) => layer.id !== id),
    })),
}));
