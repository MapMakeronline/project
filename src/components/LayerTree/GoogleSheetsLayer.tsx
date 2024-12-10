import React, { useState } from 'react';
import { Table, ChevronRight, ChevronDown, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useGoogleSheetsStore } from '../../store/googleSheetsStore';

interface GoogleSheetsLayerProps {
  layer: {
    id: string;
    name: string;
    spreadsheetId: string;
    sheetName: string;
    visible: boolean;
  };
}

export function GoogleSheetsLayer({ layer }: GoogleSheetsLayerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleLayerVisibility = useGoogleSheetsStore((state) => state.toggleLayerVisibility);

  return (
    <div className="rounded-lg border border-gray-100">
      <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-0.5 hover:bg-gray-100 rounded"
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </button>
        
        <button
          onClick={() => toggleLayerVisibility(layer.id)}
          className="p-0.5 hover:bg-gray-100 rounded"
          title={layer.visible ? 'Hide layer' : 'Show layer'}
        >
          {layer.visible ? (
            <Eye className="w-4 h-4 text-blue-500" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </button>

        <Table className="w-4 h-4 text-gray-400" />
        
        <div className="flex-1">
          <span className="text-sm text-gray-700">{layer.name}</span>
          <p className="text-xs text-gray-500">{layer.sheetName}</p>
        </div>

        <a
          href={`https://docs.google.com/spreadsheets/d/${layer.spreadsheetId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 hover:bg-gray-100 rounded"
          title="Open in Google Sheets"
        >
          <ExternalLink className="w-4 h-4 text-gray-400" />
        </a>
      </div>

      {isExpanded && (
        <div className="px-8 py-2 border-t">
          <div className="max-h-48 overflow-y-auto rounded border">
            <SheetPreview spreadsheetId={layer.spreadsheetId} sheetName={layer.sheetName} />
          </div>
        </div>
      )}
    </div>
  );
}

function SheetPreview({ spreadsheetId, sheetName }: { spreadsheetId: string; sheetName: string }) {
  const [data, setData] = useState<any[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    // TODO: Implement actual Google Sheets API call
    // For now, showing mock data
    setData([
      ['Name', 'Latitude', 'Longitude', 'Description'],
      ['Point A', '52.237049', '21.017532', 'Location A description'],
      ['Point B', '52.239049', '21.019532', 'Location B description'],
      ['Point C', '52.238049', '21.018532', 'Location C description'],
      ['Point D', '52.236049', '21.016532', 'Location D description'],
      ['Point E', '52.235049', '21.015532', 'Location E description'],
    ]);
    setLoading(false);
  }, [spreadsheetId, sheetName]);

  if (loading) {
    return (
      <div className="p-4 text-center text-sm text-gray-500">
        Loading sheet data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-gray-50 sticky top-0">
        <tr>
          {data[0]?.map((header, i) => (
            <th
              key={i}
              className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {data.slice(1).map((row, i) => (
          <tr key={i} className="hover:bg-gray-50">
            {row.map((cell, j) => (
              <td key={j} className="px-3 py-2 whitespace-nowrap text-gray-600">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}