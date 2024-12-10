import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MapSettings {
  // Click behavior
  singleClickZoom: boolean;
  singleClickZoomLevel: number;
  doubleClickZoom: boolean;
  doubleClickZoomLevel: number;
  
  // Zoom behavior
  smoothZoom: boolean;
  zoomDelta: number;
  zoomSnap: number;
  wheelPxPerZoomLevel: number;
  wheelDebounceTime: number;
  
  // Animation settings
  zoomAnimation: boolean;
  fadeAnimation: boolean;
  markerZoomAnimation: boolean;
}

interface MapSettingsStore {
  settings: MapSettings;
  updateSettings: (settings: Partial<MapSettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: MapSettings = {
  // Click behavior - optimized for property viewing
  singleClickZoom: true,
  singleClickZoomLevel: 16, // District level
  doubleClickZoom: true,
  doubleClickZoomLevel: 18, // Plot level
  
  // Zoom behavior
  smoothZoom: true,
  zoomDelta: 0.5,
  zoomSnap: 0.5,
  wheelPxPerZoomLevel: 80,
  wheelDebounceTime: 60,
  
  // Animation settings
  zoomAnimation: true,
  fadeAnimation: true,
  markerZoomAnimation: true
};

export const useMapSettingsStore = create<MapSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      updateSettings: (newSettings) => 
        set((state) => ({ 
          settings: { ...state.settings, ...newSettings }
        })),
      resetSettings: () => set({ settings: defaultSettings })
    }),
    {
      name: 'map-settings',
    }
  )
);