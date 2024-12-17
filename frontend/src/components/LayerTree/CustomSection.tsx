import React from 'react';
import { ChevronRight, ChevronDown, Plus, Folder, Trash2, Edit2 } from 'lucide-react';
import { useCustomSectionsStore } from '../../store/customSectionsStore';
import { useNotificationStore } from '../../store/notificationStore';
import { SectionNameModal } from './SectionCreation';
import { useLayerOrderStore } from '../../store/layerOrderStore';

interface FolderItemProps {
  sectionId: string;
  folder: {
    id: string;
    name: string;
    layers: Array<{
      id: string;
      name: string;
      visible: boolean;
    }>;
    isExpanded?: boolean;
  };
}

function FolderItem({ sectionId, folder }: FolderItemProps) {
  const { addLayer, toggleLayerVisibility, toggleFolderExpanded, removeFolder, renameFolder } = useCustomSectionsStore();
  const setActiveLabel = useNotificationStore((state) => state.setActiveLabel);
  const [isAddingLayer, setIsAddingLayer] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const handleAddLayer = () => {
    setIsAddingLayer(true);
    const layerName = `Layer ${folder.layers.length + 1}`;
    addLayer(sectionId, folder.id, layerName);
    setTimeout(() => setIsAddingLayer(false), 300);
  };

  const handleRenameFolder = (newName: string) => {
    renameFolder(sectionId, folder.id, newName);
    setIsEditModalOpen(false);
  };

  const handleDeleteFolder = () => {
    if (window.confirm('Are you sure you want to delete this folder and all its layers?')) {
      removeFolder(sectionId, folder.id);
    }
  };

  return (
    <div className="space-y-0.5">
      <div className={`px-3 py-2 flex items-center justify-between bg-gray-50 rounded-lg ${!isAddingLayer ? 'hover:bg-gray-100' : ''}`}>
        <button
          className="flex items-center gap-2 flex-1"
          onClick={() => toggleFolderExpanded(sectionId, folder.id)}
          onMouseEnter={() => !isAddingLayer && setActiveLabel(folder.name)}
          onMouseLeave={() => !isAddingLayer && setActiveLabel(null)}
        >
          {folder.isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <Folder className="w-4 h-4 text-gray-400" />
          <span className="font-medium text-sm text-gray-600">{folder.name}</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-gray-200 rounded"
            title="Edit Folder"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            title="Delete Folder"
            onClick={handleDeleteFolder}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            title="Add Layer"
            onClick={handleAddLayer}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <SectionNameModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleRenameFolder}
        initialValue={folder.name}
        title="Rename Folder"
      />

      {folder.isExpanded && (
        <div className="pl-6 space-y-0.5">
          {folder.layers.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-gray-500 italic">
              No layers in this folder
            </p>
          ) : (
            folder.layers.map(layer => (
              <label
                key={layer.id}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg touch-manipulation ${!isAddingLayer ? 'hover:bg-gray-100/50 active:bg-gray-200/50' : ''}`}
                onMouseEnter={() => !isAddingLayer && setActiveLabel(layer.name)}
                onMouseLeave={() => !isAddingLayer && setActiveLabel(null)}
              >
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => toggleLayerVisibility(sectionId, folder.id, layer.id)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20 w-4 h-4"
                />
                <span className="text-sm text-gray-500">{layer.name}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  );
}

interface CustomSectionProps {
  sectionId: string;
}

export function CustomSection({ sectionId }: CustomSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { sections, addFolder, removeSection, renameSection } = useCustomSectionsStore();
  const { removeSection: removeFromOrder } = useLayerOrderStore();
  const setActiveLabel = useNotificationStore((state) => state.setActiveLabel);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddingFolder, setIsAddingFolder] = React.useState(false);

  const section = sections.find(s => s.id === sectionId);
  if (!section) return null;

  const handleAddFolder = (name: string) => {
    setIsAddingFolder(true);
    addFolder(sectionId, name);
    setTimeout(() => setIsAddingFolder(false), 300);
    setIsModalOpen(false);
  };

  const handleRenameSection = (newName: string) => {
    renameSection(sectionId, newName);
    setIsEditModalOpen(false);
  };

  const handleDeleteSection = () => {
    if (window.confirm('Are you sure you want to delete this section and all its contents?')) {
      removeSection(sectionId);
      removeFromOrder(sectionId);
    }
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <div className={`px-3 py-2 flex items-center justify-between bg-gray-50 rounded-lg ${!isAddingFolder && !isModalOpen ? 'hover:bg-gray-100' : ''}`}
        onMouseEnter={() => !isAddingFolder && !isModalOpen && setActiveLabel(section.name)}
        onMouseLeave={() => !isAddingFolder && !isModalOpen && setActiveLabel(null)}
      >
        <button
          className="flex items-center gap-2 flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span className="font-medium text-sm text-gray-600">{section.name}</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            className="p-1 hover:bg-gray-200 rounded"
            title="Edit Section"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            title="Delete Section"
            onClick={handleDeleteSection}
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="p-1 hover:bg-gray-200 rounded"
            title="Add Folder"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <SectionNameModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddFolder}
          title="Add New Folder"
        />

        <SectionNameModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleRenameSection}
          initialValue={section.name}
          title="Rename Section"
        />
      </div>

      {isExpanded && (
        <div className="pl-3 space-y-2 mt-2">
          {section.folders.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-gray-500 italic">
              No folders created yet
            </p>
          ) : (
            section.folders.map(folder => (
              <FolderItem
                key={folder.id}
                sectionId={sectionId}
                folder={folder}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
