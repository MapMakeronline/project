import React, { useRef } from 'react';
import { FileUp, PenLine, X } from 'lucide-react';

interface AddDataModalProps {
  onClose: () => void;
}

export function AddDataModal({ onClose }: AddDataModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://friendly-space-fishstick-q7v5jjrvg94jc4g6r-8000.app.github.dev/api/upload/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 md:items-center">
      <div className="bg-white w-full max-w-sm rounded-t-xl md:rounded-xl shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Add Data</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          <button
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg group"
            onClick={() => {
              // Handle draw data
              onClose();
            }}
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200">
              <PenLine className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">Draw Data</div>
              <div className="text-sm text-gray-600">Draw shapes and points on the map</div>
            </div>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".geojson,.kml,.shp,.csv,.gml"
            className="hidden"
          />

          <button
            className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg group"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">Import File</div>
              <div className="text-sm text-gray-600">Upload GeoJSON, KML, or Shapefile</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
