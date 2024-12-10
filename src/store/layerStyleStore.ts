import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface LayerStyle {
  color: string;
  weight: number;
  opacity: number;
  fillColor: string;
  fillOpacity: number;
  radius: number;
  dashArray?: string;
}

interface LayerStyleState {
  selectedLayers: string[];
  styles: Record<string, LayerStyle>;
  setSelectedLayers: (layers: string[]) => void;
  updateStyle: (layerId: string, style: Partial<LayerStyle>) => void;
  resetStyle: (layerId: string) => void;
}

const defaultStyle: LayerStyle = {
  color: '#2563eb',
  weight: 2,
  opacity: 1,
  fillColor: '#2563eb',
  fillOpacity: 0.4,
  radius: 6,
};

export const useLayerStyleStore = create<LayerStyleState>()(
  persist(
    (set) => ({
      selectedLayers: [],
      styles: {},
      setSelectedLayers: (layers) => set({ selectedLayers: layers }),
      updateStyle: (layerId, style) =>
        set((state) => ({
          styles: {
            ...state.styles,
            [layerId]: {
              ...(state.styles[layerId] || defaultStyle),
              ...style,
            },
          },
        })),
      resetStyle: (layerId) =>
        set((state) => {
          const { [layerId]: _, ...rest } = state.styles;
          return { styles: rest };
        }),
    }),
    {
      name: 'layer-styles',
    }
  )
);