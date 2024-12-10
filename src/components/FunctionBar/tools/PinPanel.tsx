import React from 'react';
import { BaseToolPanel } from './BaseToolPanel';

interface PinPanelProps {
  onClose: () => void;
}

export function PinPanel({ onClose }: PinPanelProps) {
  return (
    <BaseToolPanel title="Add Pin" onClose={onClose}>
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Click on the map to add a pin marker. You can add labels and descriptions to your pins.
        </p>

        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Pin Style</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-sm mb-1">Color</label>
              <input type="color" className="w-full h-8 rounded" />
            </div>
            <div>
              <label className="block text-sm mb-1">Size</label>
              <input type="range" min="20" max="60" className="w-full" />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Recent Pins</h4>
          <p className="text-sm text-gray-500 italic">
            No pins added yet. Click on the map to add your first pin.
          </p>
        </div>
      </div>
    </BaseToolPanel>
  );
}