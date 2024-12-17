import React from 'react';
import { ChevronRight, ChevronDown, Plus, Trash2, Edit2 } from 'lucide-react';
import { useCustomSectionsStore } from '../../store/customSectionsStore';
import { useNotificationStore } from '../../store/notificationStore';
import { useAttributesTableStore } from '../../store/attributesTableStore';
import { SectionNameModal } from './SectionCreation';
import { useLayerOrderStore } from '../../store/layerOrderStore';

interface CustomSectionProps {
  sectionId: string;
}

export function CustomSection({ sectionId }: CustomSectionProps) {
  const { sections, addLayer, removeSection, renameSection, toggleLayerVisibility, toggleSectionExpanded, removeLayer, renameLayer } = useCustomSectionsStore();
  const { removeSection: removeFromOrder } = useLayerOrderStore();
  const { showAttributesTable } = useAttributesTableStore();
  const setActiveLabel = useNotificationStore((state) => state.setActiveLabel);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAddingLayer, setIsAddingLayer] = React.useState(false);
  const [editingLayer, setEditingLayer] = React.useState<{id: string, name: string} | null>(null);

  const section = sections.find(s => s.id === sectionId);
  if (!section) return null;

  const handleAddLayer = (name: string) => {
    setIsAddingLayer(true);
    addLayer(sectionId, name);
    setTimeout(() => setIsAddingLayer(false), 300);
    setIsModalOpen(false);
  };

  const handleRenameSection = (newName: string) => {
    renameSection(sectionId, newName);
    setIsEditModalOpen(false);
  };

  const handleDeleteSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this section and all its contents?')) {
      removeSection(sectionId);
      removeFromOrder(sectionId);
    }
  };

  const handleDeleteLayer = (layerId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this layer?')) {
      removeLayer(sectionId, layerId);
    }
  };

  const handleEditLayer = (layerId: string, currentName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingLayer({ id: layerId, name: currentName });
  };

  const handleRenameLayer = (newName: string) => {
    if (editingLayer) {
      renameLayer(sectionId, editingLayer.id, newName);
      setEditingLayer(null);
    }
  };

  const handleLayerClick = (layerId: string, e: React.MouseEvent) => {
    // Prevent default to avoid any parent handlers
    e.preventDefault();
    
    // Don't open attributes table if clicking controls
    const target = e.target as HTMLElement;
    if (
      target.closest('input[type="checkbox"]') || 
      target.closest('button') ||
      target.closest('.layer-controls')
    ) {
      return;
    }
    
    console.log('Opening attributes table:', { sectionId, layerId }); // Debug log
    showAttributesTable(sectionId, layerId);
  };

  const handleVisibilityChange = (layerId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLayerVisibility(sectionId, layerId);
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <div className={`px-3 py-2 flex items-center justify-between bg-gray-50 rounded-lg ${!isAddingLayer && !isModalOpen ? 'hover:bg-gray-100' : ''}`}
        onMouseEnter={() => !isAddingLayer && !isModalOpen && setActiveLabel(section.name)}
        onMouseLeave={() => !isAddingLayer && !isModalOpen && setActiveLabel(null)}
      >
        <button
          className="flex items-center gap-2 flex-1"
          onClick={(e) => {
            e.stopPropagation();
            toggleSectionExpanded(sectionId);
          }}
        >
          {section.isExpanded ? (
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
            onClick={(e) => {
              e.stopPropagation();
              setIsEditModalOpen(true);
            }}
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
            title="Add Layer"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <SectionNameModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddLayer}
          title="Add New Layer"
        />

        <SectionNameModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleRenameSection}
          initialValue={section.name}
          title="Rename Section"
        />

        <SectionNameModal
          isOpen={Boolean(editingLayer)}
          onClose={() => setEditingLayer(null)}
          onSubmit={handleRenameLayer}
          initialValue={editingLayer?.name}
          title="Rename Layer"
        />
      </div>

      {section.isExpanded && (
        <div className="pl-3 space-y-2 mt-2">
          {section.layers.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-gray-500 italic">
              No layers added yet
            </p>
          ) : (
            <div className="space-y-0.5">
              {section.layers.map(layer => (
                <div
                  key={layer.id}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg touch-manipulation cursor-pointer hover:bg-gray-100/50 active:bg-gray-200/50"
                  onMouseEnter={() => !isAddingLayer && setActiveLabel(layer.name)}
                  onMouseLeave={() => !isAddingLayer && setActiveLabel(null)}
                  onClick={(e) => handleLayerClick(layer.id, e)}
                >
                  <input
                    type="checkbox"
                    checked={layer.visible}
                    onChange={() => toggleLayerVisibility(sectionId, layer.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20 w-4 h-4"
                  />
                  <span 
                    className="text-sm text-gray-500 flex-1"
                    onClick={(e) => handleLayerClick(layer.id, e)}
                  >
                    {layer.name}
                  </span>
                  <div className="layer-controls flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Edit Layer"
                      onClick={(e) => handleEditLayer(layer.id, layer.name, e)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-200 rounded"
                      title="Delete Layer"
                      onClick={(e) => handleDeleteLayer(layer.id, e)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
