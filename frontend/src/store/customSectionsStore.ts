import { create } from 'zustand';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
}

export interface CustomSection {
  id: string;
  name: string;
  layers: Layer[];
  isExpanded?: boolean;
}

interface CustomSectionsState {
  sections: CustomSection[];
  addSection: (name: string) => string; // returns section id
  addLayer: (sectionId: string, layerName: string) => void;
  toggleLayerVisibility: (sectionId: string, layerId: string) => void;
  toggleSectionExpanded: (sectionId: string) => void;
  removeSection: (id: string) => void;
  removeLayer: (sectionId: string, layerId: string) => void;
  renameSection: (sectionId: string, newName: string) => void;
  renameLayer: (sectionId: string, layerId: string, newName: string) => void;
}

export const useCustomSectionsStore = create<CustomSectionsState>((set) => ({
  sections: [],
  addSection: (name: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    set((state) => ({
      sections: [
        ...state.sections,
        {
          id,
          name,
          layers: [],
          isExpanded: true,
        },
      ],
    }));
    return id;
  },
  addLayer: (sectionId: string, layerName: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              layers: [
                ...section.layers,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  name: layerName,
                  visible: true,
                },
              ],
            }
          : section
      ),
    })),
  toggleLayerVisibility: (sectionId: string, layerId: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              layers: section.layers.map((layer) =>
                layer.id === layerId
                  ? { ...layer, visible: !layer.visible }
                  : layer
              ),
            }
          : section
      ),
    })),
  toggleSectionExpanded: (sectionId: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? { ...section, isExpanded: !section.isExpanded }
          : section
      ),
    })),
  removeSection: (id: string) =>
    set((state) => ({
      sections: state.sections.filter((section) => section.id !== id),
    })),
  removeLayer: (sectionId: string, layerId: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              layers: section.layers.filter((layer) => layer.id !== layerId),
            }
          : section
      ),
    })),
  renameSection: (sectionId: string, newName: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              name: newName,
            }
          : section
      ),
    })),
  renameLayer: (sectionId: string, layerId: string, newName: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              layers: section.layers.map((layer) =>
                layer.id === layerId
                  ? { ...layer, name: newName }
                  : layer
              ),
            }
          : section
      ),
    })),
}));
