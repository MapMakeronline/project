import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GeometryFormat } from '../types/geometry';

interface GoogleSheetsLayer {
  id: string;
  name: string;
  spreadsheetId: string;
  sheetName: string;
  geometryFormat: GeometryFormat;
  geometryColumn?: string;
  latColumn?: string;
  lngColumn?: string;
  visible: boolean;
}

interface GoogleSheetsStore {
  layers: GoogleSheetsLayer[];
  addLayer: (layer: GoogleSheetsLayer) => void;
  removeLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  updateLayer: (id: string, updates: Partial<GoogleSheetsLayer>) => void;
}

export const useGoogleSheetsStore = create<GoogleSheetsStore>()(
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
      updateLayer: (id, updates) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === id ? { ...layer, ...updates } : layer
          ),
        })),
    }),
    {
      name: 'google-sheets-layers',
    }
  )
);