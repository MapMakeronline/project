import React, { useState } from 'react';
import { BaseToolPanel } from './BaseToolPanel';
import { useMapSettingsStore } from '../../../store/mapSettingsStore';
import { HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';

interface MapSettingsPanelProps {
  onClose: () => void;
}

interface SettingsSectionProps {
  title: string;
  tooltip: string;
  children: React.ReactNode;
  defaultCollapsed?: boolean;
}

function SettingsSection({ title, tooltip, children, defaultCollapsed = true }: SettingsSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="space-y-3">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
          <h4 className="font-medium text-sm text-gray-700">{title}</h4>
        </div>
        <button 
          className="p-1 hover:bg-gray-100 rounded-full"
          title={tooltip}
          onClick={(e) => e.stopPropagation()}
        >
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="pl-6 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

export function MapSettingsPanel({ onClose }: MapSettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useMapSettingsStore();

  return (
    <BaseToolPanel title="Map Settings" onClose={onClose}>
      <div className="space-y-6">
        {/* Quick Settings */}
        <div className="space-y-3 pb-4 border-b">
          <h4 className="font-medium text-sm text-gray-700">Quick Settings</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.singleClickZoom}
                onChange={(e) => updateSettings({ singleClickZoom: e.target.checked })}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
              />
              <span className="text-sm">Single Click Zoom</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.smoothZoom}
                onChange={(e) => updateSettings({ smoothZoom: e.target.checked })}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
              />
              <span className="text-sm">Smooth Zoom</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.zoomAnimation}
                onChange={(e) => updateSettings({ zoomAnimation: e.target.checked })}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
              />
              <span className="text-sm">Animations</span>
            </label>
          </div>
        </div>

        {/* Advanced Settings */}
        <SettingsSection 
          title="Click Behavior" 
          tooltip="Configure how the map responds to mouse clicks"
        >
          <div className="space-y-4">
            {settings.singleClickZoom && (
              <div>
                <label className="block text-sm mb-2">Single Click Zoom Level</label>
                <input
                  type="range"
                  min="14"
                  max="18"
                  step="0.5"
                  value={settings.singleClickZoomLevel}
                  onChange={(e) => updateSettings({ 
                    singleClickZoomLevel: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>District (14)</span>
                  <span>Block (18)</span>
                </div>
              </div>
            )}

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.doubleClickZoom}
                onChange={(e) => updateSettings({ doubleClickZoom: e.target.checked })}
                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500/20"
              />
              <span className="text-sm">Double Click Zoom</span>
            </label>

            {settings.doubleClickZoom && (
              <div>
                <label className="block text-sm mb-2">Double Click Zoom Level</label>
                <input
                  type="range"
                  min="17"
                  max="20"
                  step="0.5"
                  value={settings.doubleClickZoomLevel}
                  onChange={(e) => updateSettings({ 
                    doubleClickZoomLevel: parseFloat(e.target.value)
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Plot (17)</span>
                  <span>Detail (20)</span>
                </div>
              </div>
            )}
          </div>
        </SettingsSection>

        <SettingsSection 
          title="Zoom Behavior" 
          tooltip="Control zoom smoothness and responsiveness"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Zoom Step Size</label>
              <input
                type="range"
                min="0.25"
                max="1"
                step="0.25"
                value={settings.zoomDelta}
                onChange={(e) => updateSettings({ 
                  zoomDelta: parseFloat(e.target.value),
                  zoomSnap: parseFloat(e.target.value)
                })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Smooth (0.25)</span>
                <span>Quick (1.0)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Zoom Sensitivity</label>
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
                <span>Fine (40px)</span>
                <span>Coarse (120px)</span>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Response Time</label>
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
                <span>Quick (40ms)</span>
                <span>Smooth (200ms)</span>
              </div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection 
          title="Animations" 
          tooltip="Configure map transition effects"
        >
          <div className="space-y-3">
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
        </SettingsSection>

        <div className="pt-2 border-t">
          <button
            onClick={resetSettings}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </BaseToolPanel>
  );
}