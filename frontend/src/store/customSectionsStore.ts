import { create } from 'zustand';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
}

interface Folder {
  id: string;
  name: string;
  layers: Layer[];
  isExpanded?: boolean;
}

export interface CustomSection {
  id: string;
  name: string;
  folders: Folder[];
}

interface CustomSectionsState {
  sections: CustomSection[];
  addSection: (name: string) => string; // returns section id
  addFolder: (sectionId: string, folderName: string) => void;
  addLayer: (sectionId: string, folderId: string, layerName: string) => void;
  toggleLayerVisibility: (sectionId: string, folderId: string, layerId: string) => void;
  toggleFolderExpanded: (sectionId: string, folderId: string) => void;
  removeSection: (id: string) => void;
  removeFolder: (sectionId: string, folderId: string) => void;
  removeLayer: (sectionId: string, folderId: string, layerId: string) => void;
  renameSection: (sectionId: string, newName: string) => void;
  renameFolder: (sectionId: string, folderId: string, newName: string) => void;
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
          folders: [],
        },
      ],
    }));
    return id;
  },
  addFolder: (sectionId: string, folderName: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              folders: [
                ...section.folders,
                {
                  id: Math.random().toString(36).substr(2, 9),
                  name: folderName,
                  layers: [],
                  isExpanded: true,
                },
              ],
            }
          : section
      ),
    })),
  addLayer: (sectionId: string, folderId: string, layerName: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              folders: section.folders.map((folder) =>
                folder.id === folderId
                  ? {
                      ...folder,
                      layers: [
                        ...folder.layers,
                        {
                          id: Math.random().toString(36).substr(2, 9),
                          name: layerName,
                          visible: true,
                        },
                      ],
                    }
                  : folder
              ),
            }
          : section
      ),
    })),
  toggleLayerVisibility: (sectionId: string, folderId: string, layerId: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              folders: section.folders.map((folder) =>
                folder.id === folderId
                  ? {
                      ...folder,
                      layers: folder.layers.map((layer) =>
                        layer.id === layerId
                          ? { ...layer, visible: !layer.visible }
                          : layer
                      ),
                    }
                  : folder
              ),
            }
          : section
      ),
    })),
  toggleFolderExpanded: (sectionId: string, folderId: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              folders: section.folders.map((folder) =>
                folder.id === folderId
                  ? { ...folder, isExpanded: !folder.isExpanded }
                  : folder
              ),
            }
          : section
      ),
    })),
  removeSection: (id: string) =>
    set((state) => ({
      sections: state.sections.filter((section) => section.id !== id),
    })),
  removeFolder: (sectionId: string, folderId: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              folders: section.folders.filter((folder) => folder.id !== folderId),
            }
          : section
      ),
    })),
  removeLayer: (sectionId: string, folderId: string, layerId: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              folders: section.folders.map((folder) =>
                folder.id === folderId
                  ? {
                      ...folder,
                      layers: folder.layers.filter((layer) => layer.id !== layerId),
                    }
                  : folder
              ),
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
  renameFolder: (sectionId: string, folderId: string, newName: string) =>
    set((state) => ({
      sections: state.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              folders: section.folders.map((folder) =>
                folder.id === folderId
                  ? {
                      ...folder,
                      name: newName,
                    }
                  : folder
              ),
            }
          : section
      ),
    })),
}));
