import React, { useState } from 'react';
import { BaseToolPanel } from './BaseToolPanel';
import { useToolStore } from '../../../store/toolStore';
import { useMapStore } from '../../../store/mapStore';
import { Settings, AlertCircle } from 'lucide-react';

interface IdentifyPanelProps {
  onClose: () => void;
}

interface QuerySettings {
  type: 'plot' | 'point';
  radius: number;
  wmsLayers: string[];
  wfsLayers: string[];
  autoZoom: boolean;
  zoomLevel: number;
}

const defaultSettings: QuerySettings = {
  type: 'point',
  radius: 5,
  wmsLayers: [],
  wfsLayers: [],
  autoZoom: true,
  zoomLevel: 18
};

export function IdentifyPanel({ onClose }: IdentifyPanelProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<QuerySettings>(defaultSettings);
  const [history, setHistory] = useState<any[]>([]);
  const activeTool = useToolStore((state) => state.activeTool);
  const clickedPoint = useMapStore((state) => state.clickedPoint);

  // If no query type is selected, show the initial setup
  if (!settings.type && !showSettings) {
    return (
      <BaseToolPanel title="Identify" onClose={onClose}>
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <p className="text-sm text-blue-800">
                Choose how you want to query the map. You can change these settings later.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setSettings({ ...settings, type: 'plot' })}
              className="w-full px-4 py-3 text-left bg-white border rounded-lg hover:bg-gray-50"
            >
              <h3 className="font-medium mb-1">Plot Query</h3>
              <p className="text-sm text-gray-600">
                Click on a plot to view its details and available information
              </p>
            </button>

            <button
              onClick={() => setSettings({ ...settings, type: 'point' })}
              className="w-full px-4 py-3 text-left bg-white border rounded-lg hover:bg-gray-50"
            >
              <h3 className="font-medium mb-1">Point Query</h3>
              <p className="text-sm text-gray-600">
                Click anywhere on the map to query all features within a radius
              </p>
            </button>
          </div>
        </div>
      </BaseToolPanel>
    );
  }

  return (
    <BaseToolPanel title="Identify" onClose={onClose}>
      <div className="space-y-6">
        {/* Header with settings toggle */}
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium text-sm text-gray-700">
              {settings.type === 'plot' ? 'Plot Query' : 'Point Query'}
            </h4>
            <p className="text-sm text-gray-500">
              Click on the map to identify features
            </p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Query Settings"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium mb-2">Query Type</label>
              <select
                value={settings.type}
                onChange={(e) => setSettings({ ...settings, type: e.target.value as 'plot' | 'point' })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="plot">Plot Query</option>
                <option value="point">Point Query</option>
              </select>
            </div>

            {settings.type === 'point' && (
              <div>
                <label className="block text-sm font-medium mb-2">Search Radius (meters)</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={settings.radius}
                  onChange={(e) => setSettings({ ...settings, radius: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>1m</span>
                  <span>{settings.radius}m</span>
                  <span>50m</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Auto-zoom on Selection</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.autoZoom}
                    onChange={(e) => setSettings({ ...settings, autoZoom: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Enable auto-zoom</span>
                </label>

                {settings.autoZoom && (
                  <input
                    type="range"
                    min="14"
                    max="20"
                    value={settings.zoomLevel}
                    onChange={(e) => setSettings({ ...settings, zoomLevel: parseInt(e.target.value) })}
                    className="w-full"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">WMS Layers</label>
              <div className="space-y-1">
                {/* Add WMS layer checkboxes here */}
                <p className="text-sm text-gray-500 italic">No WMS layers configured</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">WFS Layers</label>
              <div className="space-y-1">
                {/* Add WFS layer checkboxes here */}
                <p className="text-sm text-gray-500 italic">No WFS layers configured</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div>
          <h4 className="font-medium text-sm text-gray-700 mb-2">Recent Identifications</h4>
          {clickedPoint ? (
            <div className="space-y-2">
              <div className="p-3 bg-white border rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  Selected point: {clickedPoint.lat.toFixed(6)}, {clickedPoint.lng.toFixed(6)}
                </div>
                <button
                  onClick={() => {
                    // Implement plot check functionality
                    console.log('Checking plot at:', clickedPoint);
                  }}
                  className="w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  Check Plot
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No features identified yet. Click on the map to get started.
            </p>
          )}
        </div>
      </div>
    </BaseToolPanel>
  );
}