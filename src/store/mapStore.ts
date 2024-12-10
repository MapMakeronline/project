import { create } from 'zustand';

interface MapStore {
  clickedPoint: { lat: number; lng: number } | null;
  setClickedPoint: (point: { lat: number; lng: number } | null) => void;
}

export const useMapStore = create<MapStore>((set) => ({
  clickedPoint: null,
  setClickedPoint: (point) => set({ clickedPoint: point }),
}));