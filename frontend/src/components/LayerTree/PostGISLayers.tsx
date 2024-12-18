import React from 'react';
import { ChevronRight, ChevronDown, Plus } from 'lucide-react';
import { usePostGISLayerStore } from '../../store/postgisLayerStore';
import { useNotificationStore } from '../../store/notificationStore';

export function PostGISLayers() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const { layers, toggleLayerVisibility } = usePostGISLayerStore();
  const setActiveLabel = useNotificationStore((state) => state.setActiveLabel);

  const handleAddPostGISLayer = () => {
    // TODO: Implement PostGIS layer addition logic
    console.log('Add PostGIS layer clicked');
  };

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="px-3 py-2 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg">
        <button
          className="flex items-center gap-2 flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span className="font-medium text-sm text-gray-600">PostGIS Layers</span>
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          title="Add PostGIS Layer"
          onClick={handleAddPostGISLayer}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {isExpanded && (
        <div className="pl-3 space-y-0.5 mt-1">
          {layers.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-gray-500 italic">
              No PostGIS layers added yet
            </p>
          ) : (
            layers.map(layer => (
              <label
                key={layer.id}
                className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100/50 active:bg-gray-200/50 rounded-lg touch-manipulation"
                onMouseEnter={() => setActiveLabel(layer.name)}
                onMouseLeave={() => setActiveLabel(null)}
              >
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => toggleLayerVisibility(layer.id)}
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