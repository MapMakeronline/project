import React, { useState } from 'react';
import { BaseToolPanel } from '../BaseToolPanel';
import { LayerSelector } from './LayerSelector';
import { StyleEditor } from './StyleEditor';
import { StyleImporter } from './StyleImporter';
import { useLayerStyleStore } from '../../../../store/layerStyleStore';
import { Palette, Upload } from 'lucide-react';

interface StylePanelProps {
  onClose: () => void;
}

export function StylePanel({ onClose }: StylePanelProps) {
  const [mode, setMode] = useState<'import' | 'edit'>('import');
  const selectedLayers = useLayerStyleStore((state) => state.selectedLayers);

  return (
    <BaseToolPanel title="Layer Styles" onClose={onClose}>
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('import')}
            className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
              mode === 'import'
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Upload className="w-4 h-4" />
            Import Style
          </button>
          <button
            onClick={() => setMode('edit')}
            className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm ${
              mode === 'edit'
                ? 'bg-blue-50 text-blue-700'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <Palette className="w-4 h-4" />
            Custom Style
          </button>
        </div>

        {/* Layer Selection */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-gray-700">Select Layers</h4>
          <LayerSelector />
        </div>

        {/* Style Management */}
        {selectedLayers.length > 0 ? (
          <div className="space-y-4">
            {mode === 'import' ? (
              <StyleImporter onImport={console.log} />
            ) : (
              <StyleEditor />
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Select one or more layers to manage their styles.
          </p>
        )}
      </div>
    </BaseToolPanel>
  );
}