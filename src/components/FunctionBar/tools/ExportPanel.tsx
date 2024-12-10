import React from 'react';
import { BaseToolPanel } from './BaseToolPanel';

interface ExportPanelProps {
  onClose: () => void;
}

export function ExportPanel({ onClose }: ExportPanelProps) {
  return (
    <BaseToolPanel title="Export" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Export Format</h4>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              PNG Image
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              PDF Document
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              GeoJSON
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Export Area</h4>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Current View
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Draw Custom Area
            </button>
          </div>
        </div>
      </div>
    </BaseToolPanel>
  );
}