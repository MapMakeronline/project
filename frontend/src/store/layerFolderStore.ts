import { create } from 'zustand';

export interface Folder {
  id: string;
  name: string;
  layers: string[];
}

interface LayerFolderState {
  folders: Folder[];
  addFolder: (name: string) => void;
  addLayerToFolder: (folderId: string, layerId: string) => void;
  removeLayerFromFolder: (folderId: string, layerId: string) => void;
  removeFolder: (id: string) => void;
}

export const useLayerFolderStore = create<LayerFolderState>((set) => ({
  folders: [],
  addFolder: (name: string) =>
    set((state) => ({
      folders: [
        ...state.folders,
        {
          id: Math.random().toString(36).substr(2, 9),
          name,
          layers: [],
        },
      ],
    })),
  addLayerToFolder: (folderId: string, layerId: string) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId
          ? { ...folder, layers: [...folder.layers, layerId] }
          : folder
      ),
    })),
  removeLayerFromFolder: (folderId: string, layerId: string) =>
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId
          ? { ...folder, layers: folder.layers.filter((id) => id !== layerId) }
          : folder
      ),
    })),
  removeFolder: (id: string) =>
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== id),
    })),
}));
