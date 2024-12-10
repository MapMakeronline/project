import React, { useState } from 'react';
import { X, Table, AlertCircle } from 'lucide-react';
import { useGoogleSheetsStore } from '../../store/googleSheetsStore';
import { useNotificationStore } from '../../store/notificationStore';
import { GeometryFormat } from '../../types/geometry';

interface GoogleSheetsModalProps {
  onClose: () => void;
}

const geometryFormats: { id: GeometryFormat; label: string; description: string }[] = [
  { 
    id: 'coordinates', 
    label: 'Coordinates', 
    description: 'Separate latitude and longitude columns (e.g., 52.237049, 21.017532)'
  },
  { 
    id: 'wkt', 
    label: 'WKT', 
    description: 'Well-Known Text (e.g., POINT(21.017532 52.237049))'
  },
  { 
    id: 'wkb', 
    label: 'WKB', 
    description: 'Well-Known Binary format'
  },
  { 
    id: 'geojson', 
    label: 'GeoJSON', 
    description: 'GeoJSON geometry format'
  },
  { 
    id: 'gml', 
    label: 'GML', 
    description: 'Geography Markup Language'
  }
];

export function GoogleSheetsModal({ onClose }: GoogleSheetsModalProps) {
  const [url, setUrl] = useState('');
  const [sheetName, setSheetName] = useState('');
  const [geometryFormat, setGeometryFormat] = useState<GeometryFormat>('coordinates');
  const [geometryColumn, setGeometryColumn] = useState('');
  const [latColumn, setLatColumn] = useState('');
  const [lngColumn, setLngColumn] = useState('');
  const addLayer = useGoogleSheetsStore((state) => state.addLayer);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        throw new Error('Invalid Google Sheets URL');
      }

      const spreadsheetId = match[1];
      
      addLayer({
        id: crypto.randomUUID(),
        name: `Sheet Layer ${Date.now()}`,
        spreadsheetId,
        sheetName,
        geometryFormat,
        geometryColumn: geometryFormat === 'coordinates' ? undefined : geometryColumn,
        latColumn: geometryFormat === 'coordinates' ? latColumn : undefined,
        lngColumn: geometryFormat === 'coordinates' ? lngColumn : undefined,
        visible: true
      });

      addNotification('success', 'Google Sheet connected successfully');
      onClose();
    } catch (error) {
      addNotification('error', error instanceof Error ? error.message : 'Failed to connect Google Sheet');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold">Connect Google Sheet</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Before connecting:</p>
                <ol className="list-decimal ml-4 space-y-1">
                  <li>Make sure your Google Sheet is shared (View access)</li>
                  <li>The sheet should have geographic data in one of the supported formats</li>
                  <li>Data should be in a proper tabular format</li>
                </ol>
              </div>
            </div>
          </div>

          <form id="sheet-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Google Sheet URL
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sheet Name
              </label>
              <input
                type="text"
                required
                value={sheetName}
                onChange={(e) => setSheetName(e.target.value)}
                placeholder="e.g. Sheet1"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Geometry Format
              </label>
              <select
                value={geometryFormat}
                onChange={(e) => setGeometryFormat(e.target.value as GeometryFormat)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {geometryFormats.map(format => (
                  <option key={format.id} value={format.id}>
                    {format.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {geometryFormats.find(f => f.id === geometryFormat)?.description}
              </p>
            </div>

            {geometryFormat === 'coordinates' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude Column
                  </label>
                  <input
                    type="text"
                    required
                    value={latColumn}
                    onChange={(e) => setLatColumn(e.target.value)}
                    placeholder="e.g. A or Latitude"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude Column
                  </label>
                  <input
                    type="text"
                    required
                    value={lngColumn}
                    onChange={(e) => setLngColumn(e.target.value)}
                    placeholder="e.g. B or Longitude"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Geometry Column
                </label>
                <input
                  type="text"
                  required
                  value={geometryColumn}
                  onChange={(e) => setGeometryColumn(e.target.value)}
                  placeholder="e.g. A or Geometry"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </form>
        </div>

        <div className="p-4 border-t bg-gray-50 rounded-b-lg shrink-0">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="sheet-form"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Connect Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}