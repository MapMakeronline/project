import { create } from 'zustand';

interface AttributesTableState {
  isVisible: boolean;
  selectedLayerId: string | null;
  selectedSectionId: string | null;
  showAttributesTable: (sectionId: string, layerId: string) => void;
  hideAttributesTable: () => void;
}

export const useAttributesTableStore = create<AttributesTableState>((set) => ({
  isVisible: false,
  selectedLayerId: null,
  selectedSectionId: null,
  showAttributesTable: (sectionId: string, layerId: string) => set({
    isVisible: true,
    selectedLayerId: layerId,
    selectedSectionId: sectionId,
  }),
  hideAttributesTable: () => set({
    isVisible: false,
    selectedLayerId: null,
    selectedSectionId: null,
  }),
}));
