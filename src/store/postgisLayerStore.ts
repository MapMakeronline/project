import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PostGISLayer {
  id: string;
  name: string;
  schema: string;
  table: string;
  geometry_column: string;
  visible: boolean;
  style?: {
    color: string;
    weight: number;
    opacity: number;
    fillColor: string;
    fillOpacity: number;
  };
}

interface PostGISLayerStore {
  layers: PostGISLayer[];
  addLayer: (layer: PostGISLayer) => void;
  removeLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  updateLayerStyle: (id: string, style: PostGISLayer['style']) => void;
}

export const usePostGISLayerStore = create<PostGISLayerStore>()(
  persist(
    (set) => ({
      layers: [],
      addLayer: (layer) =>
        set((state) => ({
          layers: [...state.layers, layer],
        })),
      removeLayer: (id) =>
        set((state) => ({
          layers: state.layers.filter((layer) => layer.id !== id),
        })),
      toggleLayerVisibility: (id) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === id ? { ...layer, visible: !layer.visible } : layer
          ),
        })),
      updateLayerStyle: (id, style) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === id ? { ...layer, style } : layer
          ),
        })),
    }),
    {
      name: 'postgis-layers',
    }
  )
);