import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Plus, Table } from 'lucide-react';
import { useGoogleSheetsStore } from '../../store/googleSheetsStore';
import { useNotificationStore } from '../../store/notificationStore';
import { GoogleSheetsModal } from './GoogleSheetsModal';
import { GoogleSheetsLayer } from './GoogleSheetsLayer';

export function GoogleSheetsLayers() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { layers } = useGoogleSheetsStore();
  const setActiveLabel = useNotificationStore((state) => state.setActiveLabel);

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
          <span className="font-medium text-sm text-gray-600">Google Sheets</span>
        </button>
        <button
          className="p-1 hover:bg-gray-200 rounded"
          title="Connect Google Sheet"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {isExpanded && (
        <div className="pl-3 space-y-2 mt-2">
          {layers.length === 0 ? (
            <p className="px-2 py-1.5 text-sm text-gray-500 italic">
              No sheets connected yet
            </p>
          ) : (
            layers.map(layer => (
              <GoogleSheetsLayer key={layer.id} layer={layer} />
            ))
          )}
        </div>
      )}

      {isModalOpen && (
        <GoogleSheetsModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}