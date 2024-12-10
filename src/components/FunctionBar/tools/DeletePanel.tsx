import React from 'react';
import { BaseToolPanel } from './BaseToolPanel';

interface DeletePanelProps {
  onClose: () => void;
}

export function DeletePanel({ onClose }: DeletePanelProps) {
  return (
    <BaseToolPanel title="Delete" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Select items on the map to delete them. You can delete markers, drawings, and measurements.
        </p>

        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Delete Options</h4>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Delete Selected
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg text-red-600 hover:text-red-700">
              Clear All
            </button>
          </div>
        </div>
      </div>
    </BaseToolPanel>
  );
}