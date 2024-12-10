import React from 'react';
import { BaseToolPanel } from './BaseToolPanel';

interface MeasurePanelProps {
  onClose: () => void;
}

export function MeasurePanel({ onClose }: MeasurePanelProps) {
  return (
    <BaseToolPanel title="Measure" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Measurement Tools</h4>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Distance
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Area
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Radius
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Results</h4>
          <p className="text-sm text-gray-500 italic">
            Select a measurement tool to begin measuring.
          </p>
        </div>
      </div>
    </BaseToolPanel>
  );
}