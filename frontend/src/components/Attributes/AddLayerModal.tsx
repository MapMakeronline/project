import React, { useState } from 'react';
import { FileUp, X, Search } from 'lucide-react';

interface AddDataModalProps {
  onClose: () => void;
}

export function AddLayerModal({ onClose }: AddDataModalProps) {
  const [url, setUrl] = useState<string>(''); // URL input
  const [error, setError] = useState<string | null>(null); // Error message state
  const [layers, setLayers] = useState<any[]>([]); // Store the layers fetched from the WMS service
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  // Handle URL input change
  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
  };

  // Handle WMS GetCapabilities request to fetch layers
  const handleSearchFiles = async () => {
    if (!url) {
      setError('Please provide a valid WMS URL.');
      return;
    }

    setError(null);
    setLayers([]); // Reset layers list
    setLoading(true);

    try {
      // Construct a GetCapabilities request for the WMS service
      const response = await fetch(`${url}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetCapabilities`);

      if (!response.ok) {
        throw new Error('Failed to fetch WMS capabilities');
      }

      const xml = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, 'text/xml');

      // Parse layers from the WMS GetCapabilities XML response
      const layersArray = Array.from(xmlDoc.getElementsByTagName('Layer')).map((layer) => ({
        name: layer.getElementsByTagName('Name')[0]?.textContent || 'Unnamed Layer',
        title: layer.getElementsByTagName('Title')[0]?.textContent || 'No Title',
      }));

      setLayers(layersArray); // Set the layers in the state

    } catch (error) {
      console.error('Error searching for files:', error);
      setError('Error fetching WMS capabilities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission (upload URL)
  const handleUploadFromUrl = async () => {
    if (!url) {
      setError('Please provide a valid URL.');
      return;
    }

    try {
      // Send the URL to the backend for upload (example backend request)
      const response = await fetch('https://backend-1004166685896.europe-central2.run.app/api/upload-from-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      onClose();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Error uploading file. Please try again.');
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md h-[75vh] overflow-y-auto rounded-xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add WMS Data</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">WMS URL</label>
            <input
              type="text"
              value={url}
              onChange={handleUrlChange}
              placeholder="Enter WMS URL"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          {/* Button to search layers */}
          <button
            className={`w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg ${loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-100'}`}
            onClick={handleSearchFiles}
            disabled={loading}
          >
            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="font-medium">Search Layers</div>
              <div className="text-sm text-gray-600">Search for layers using the provided WMS URL</div>
            </div>
          </button>

          {/* Loading State */}
          {loading && <div className="flex justify-center mt-4"><div className="w-6 h-6 border-4 border-t-4 border-gray-500 border-t-transparent rounded-full animate-spin"></div></div>}

          {/* Display found layers */}
          {layers.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium text-lg">Found Layers</h3>
              <div className="h-64 overflow-y-auto overflow-x-hidden mt-2">
                <ul className="space-y-4">
                  {layers.map((layer, index) => (
                    <li key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition duration-300">
                      <span className="text-sm text-gray-700">{layer.title.length > 30 ? layer.title.substring(0, 30) + '...' : layer.title }</span>
                      <button
                        className="text-xs text-blue-500 hover:underline"
                        onClick={() => alert(`Layer ${layer.name} selected`)} // Example action
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
