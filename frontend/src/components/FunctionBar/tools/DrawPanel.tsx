import React from 'react';
import { BaseToolPanel } from './BaseToolPanel';

interface DrawPanelProps {
  onClose: () => void;
}

export function DrawPanel({ onClose }: DrawPanelProps) {
  return (
    <BaseToolPanel title="Draw" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Drawing Tools</h4>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Point
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Line
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Polygon
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Rectangle
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Circle
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Style</h4>
          <div className="space-y-2">
            <div>
              <label className="block text-sm mb-1">Color</label>
              <input type="color" className="w-full h-8 rounded" />
            </div>
            <div>
              <label className="block text-sm mb-1">Line Width</label>
              <input type="range" min="1" max="10" className="w-full" />
            </div>
          </div>
        </div>
      </div>
    </BaseToolPanel>
  );
}