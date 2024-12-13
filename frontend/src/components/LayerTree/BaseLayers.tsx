import React, { useState } from 'react';
import { ChevronRight, ChevronUp, Plus } from 'lucide-react';
import { useLayerStore } from '../../store/layerStore';
import { useNotificationStore } from '../../store/notificationStore';
import { baseLayers } from '../Map/constants';
import { AddLayerModal } from '../Attributes/AddLayerModal';

export function BaseLayers() {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { activeBaseLayer, setActiveBaseLayer } = useLayerStore();
  const setActiveLabel = useNotificationStore((state) => state.setActiveLabel);


  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="rounded-lg bg-gray-50 relative w-[150px]  bottom-5 overflow-hidden">
      {isExpanded && (
        <div className="pl-3 space-y-0.5 mt-1">
          {baseLayers.map(layer => (
            <label
              key={layer.id}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-100/50 active:bg-gray-200/50 rounded-lg touch-manipulation"
              onMouseEnter={() => setActiveLabel(layer.name)}
              onMouseLeave={() => setActiveLabel(null)}
            >
              <input
                type="radio"
                name="baseLayer"
                checked={activeBaseLayer === layer.id}
                onChange={() => setActiveBaseLayer(layer.id)}
                className="rounded-full border-gray-300 text-blue-500 focus:ring-blue-500/20 w-4 h-4"
              />
              <span className="text-sm text-gray-500">{layer.name}</span>
            </label>
          ))}
        </div>
      )}
      <div className="px-3 py-2 flex  items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-lg">
        <button
          className="flex  items-center gap-2 flex-1"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <span className="font-medium text-sm text-gray-600">Base Maps</span>
        </button>
        <button
          className="p-1 ms-auto hover:bg-gray-200 rounded"
          title="Add Base Layer"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
        </button>
        {isModalOpen && <AddLayerModal onClose={() => setIsModalOpen(false)} />}
      </div>
      
      
    </div>
  );
}