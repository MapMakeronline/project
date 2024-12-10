import React from 'react';
import { useLayerStyleStore } from '../../../../store/layerStyleStore';

const availableLayers = [
  { id: 'properties', name: 'Properties', description: 'Property markers and boundaries' },
  { id: 'selected-point', name: 'Selected Point', description: 'Currently selected location' },
  { id: 'measurements', name: 'Measurements', description: 'Distance and area measurements' },
  { id: 'drawings', name: 'Drawings', description: 'User-created shapes and annotations' },
];

export function LayerSelector() {
  const { selectedLayers, setSelectedLayers } = useLayerStyleStore();

  const handleLayerToggle = (event: React.MouseEvent, layerId: string) => {
    if (event.ctrlKey) {
      // Multi-select with Ctrl key
      if (selectedLayers.includes(layerId)) {
        setSelectedLayers(selectedLayers.filter(id => id !== layerId));
      } else {
        setSelectedLayers([...selectedLayers, layerId]);
      }
    } else {
      // Single select without Ctrl key
      setSelectedLayers([layerId]);
    }
  };

  return (
    <div className="space-y-2">
      {availableLayers.map(layer => (
        <div
          key={layer.id}
          className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
            selectedLayers.includes(layer.id)
              ? 'bg-blue-50 hover:bg-blue-100'
              : 'hover:bg-gray-50'
          }`}
          onClick={(e) => handleLayerToggle(e, layer.id)}
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedLayers.includes(layer.id)}
              onChange={() => {}} // Handled by div click
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
            />
            <div>
              <div className="text-sm font-medium">{layer.name}</div>
              <div className="text-xs text-gray-500">{layer.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}