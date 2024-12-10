import React from 'react';
import { X } from 'lucide-react';
import { useMapSettingsStore } from '../../store/mapSettingsStore';

interface MapSettingsPanelProps {
  onClose: () => void;
}

export function MapSettingsPanel({ onClose }: MapSettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useMapSettingsStore();

  return (
    <div className="w-80 border-l bg-white/90 backdrop-blur-sm">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-medium">Map Settings</h3>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
        {/* Zoom Behavior Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700">Zoom Behavior</h4>
          
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.smoothZoom}
                onChange={(e) => updateSettings({ smoothZoom: e.target.checked })}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
              />
              <span className="text-sm">Smooth Zoom</span>
            </label>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Zoom Delta (Step Size)
            </label>
            <input
              type="range"
              min="0.25"
              max="1"
              step="0.25"
              value={settings.zoomDelta}
              onChange={(e) => updateSettings({ 
                zoomDelta: parseFloat(e.target.value)
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Smooth (0.25)</span>
              <span>Standard (1.0)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Zoom Sensitivity
            </label>
            <input
              type="range"
              min="40"
              max="120"
              value={settings.wheelPxPerZoomLevel}
              onChange={(e) => updateSettings({ 
                wheelPxPerZoomLevel: parseInt(e.target.value)
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Slower (40px)</span>
              <span>Faster (120px)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Zoom Response Time
            </label>
            <input
              type="range"
              min="40"
              max="200"
              step="20"
              value={settings.wheelDebounceTime}
              onChange={(e) => updateSettings({ 
                wheelDebounceTime: parseInt(e.target.value)
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Immediate (40ms)</span>
              <span>Smooth (200ms)</span>
            </div>
          </div>
        </div>

        {/* Zoom Limits Section */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700">Zoom Limits</h4>
          
          <div>
            <label className="block text-sm mb-2">
              Minimum Zoom Level
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={settings.minZoom}
              onChange={(e) => updateSettings({ 
                minZoom: parseInt(e.target.value)
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>World (1)</span>
              <span>Region (10)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">
              Maximum Zoom Level
            </label>
            <input
              type="range"
              min="15"
              max="22"
              value={settings.maxZoom}
              onChange={(e) => updateSettings({ 
                maxZoom: parseInt(e.target.value)
              })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>City (15)</span>
              <span>Building (22)</span>
            </div>
          </div>
        </div>

        {/* Animation Settings */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Animations</h4>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.zoomAnimation}
              onChange={(e) => updateSettings({ zoomAnimation: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
            />
            <span className="text-sm">Zoom Animation</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.fadeAnimation}
              onChange={(e) => updateSettings({ fadeAnimation: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
            />
            <span className="text-sm">Fade Animation</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.markerZoomAnimation}
              onChange={(e) => updateSettings({ markerZoomAnimation: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
            />
            <span className="text-sm">Marker Animation</span>
          </label>
        </div>

        {/* Performance Settings */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Performance</h4>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.preferCanvas}
              onChange={(e) => updateSettings({ preferCanvas: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
            />
            <span className="text-sm">Prefer Canvas Rendering</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.updateWhenZooming}
              onChange={(e) => updateSettings({ updateWhenZooming: e.target.checked })}
              className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
            />
            <span className="text-sm">Update During Zoom</span>
          </label>
        </div>

        <div className="pt-2 border-t">
          <button
            onClick={resetSettings}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}