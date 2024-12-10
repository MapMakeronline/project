import React from 'react';
import { BaseToolPanel } from './BaseToolPanel';

interface SharePanelProps {
  onClose: () => void;
}

export function SharePanel({ onClose }: SharePanelProps) {
  return (
    <BaseToolPanel title="Share" onClose={onClose}>
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Share Options</h4>
          <div className="space-y-2">
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Copy Link
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Share View
            </button>
            <button className="w-full px-3 py-2 text-sm text-left hover:bg-gray-100 rounded-lg">
              Embed Map
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Share Settings</h4>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm">Include markers</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm">Include drawings</span>
            </label>
          </div>
        </div>
      </div>
    </BaseToolPanel>
  );
}