import React, { useRef } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { useNotificationStore } from '../../../../store/notificationStore';

interface StyleImporterProps {
  onImport: (styleData: any) => void;
}

export function StyleImporter({ onImport }: StyleImporterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      if (extension !== 'sld' && extension !== 'qml') {
        addNotification('error', 'Only SLD and QML files are supported');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          // Here we would parse the SLD/QML content
          // For now, just pass the raw content
          onImport(content);
          addNotification('success', 'Style imported successfully');
        } catch (error) {
          addNotification('error', 'Failed to parse style file');
        }
      };
      reader.readAsText(file);
    } catch (error) {
      addNotification('error', 'Failed to read file');
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-800">
            Select layers from the list below or click objects on the map before importing styles.
            Hold Ctrl to select multiple layers.
          </p>
        </div>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".sld,.qml"
          className="hidden"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-sm"
        >
          <Upload className="w-4 h-4" />
          Import Style File
        </button>
        
        <p className="mt-2 text-sm text-gray-500">
          Supported formats: SLD, QML
        </p>
      </div>
    </div>
  );
}