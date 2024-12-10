import React from 'react';
import { useLayerStyleStore } from '../../../../store/layerStyleStore';

export function StyleEditor() {
  const { selectedLayers, styles, updateStyle } = useLayerStyleStore();

  // Get the first selected layer's style as a base
  const baseStyle = selectedLayers[0] ? styles[selectedLayers[0]] : null;

  const handleStyleChange = (property: string, value: string | number) => {
    selectedLayers.forEach(layerId => {
      updateStyle(layerId, { [property]: value });
    });
  };

  if (!baseStyle) return null;

  return (
    <div className="space-y-4">
      {/* Color */}
      <div>
        <label className="block text-sm mb-1">Color</label>
        <input
          type="color"
          value={baseStyle.color}
          onChange={(e) => handleStyleChange('color', e.target.value)}
          className="w-full h-8 rounded"
        />
      </div>

      {/* Fill Color */}
      <div>
        <label className="block text-sm mb-1">Fill Color</label>
        <input
          type="color"
          value={baseStyle.fillColor}
          onChange={(e) => handleStyleChange('fillColor', e.target.value)}
          className="w-full h-8 rounded"
        />
      </div>

      {/* Line Weight */}
      <div>
        <label className="block text-sm mb-1">Line Weight</label>
        <input
          type="range"
          min="1"
          max="10"
          value={baseStyle.weight}
          onChange={(e) => handleStyleChange('weight', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Thin (1px)</span>
          <span>Thick (10px)</span>
        </div>
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-sm mb-1">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={baseStyle.opacity}
          onChange={(e) => handleStyleChange('opacity', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Transparent</span>
          <span>Solid</span>
        </div>
      </div>

      {/* Fill Opacity */}
      <div>
        <label className="block text-sm mb-1">Fill Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={baseStyle.fillOpacity}
          onChange={(e) => handleStyleChange('fillOpacity', parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Transparent</span>
          <span>Solid</span>
        </div>
      </div>

      {/* Point Radius */}
      <div>
        <label className="block text-sm mb-1">Point Size</label>
        <input
          type="range"
          min="2"
          max="20"
          value={baseStyle.radius}
          onChange={(e) => handleStyleChange('radius', parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Small (2px)</span>
          <span>Large (20px)</span>
        </div>
      </div>

      {/* Line Style */}
      <div>
        <label className="block text-sm mb-1">Line Style</label>
        <select
          value={baseStyle.dashArray || ''}
          onChange={(e) => handleStyleChange('dashArray', e.target.value)}
          className="w-full px-3 py-1.5 border rounded text-sm"
        >
          <option value="">Solid</option>
          <option value="5,5">Dashed</option>
          <option value="1,5">Dotted</option>
          <option value="10,5">Long Dash</option>
          <option value="5,5,1,5">Dash-Dot</option>
        </select>
      </div>
    </div>
  );
}