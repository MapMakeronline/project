import React, { useState } from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import { MinimizeButton } from '../common/MinimizeButton';
import { SwipeHandler } from '../common/SwipeHandler';
import { AddDataButton } from './AddDataButton';

export function AttributesTable() {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedProperty = usePropertyStore((state) => state.selectedProperty);
  const setSelectedProperty = usePropertyStore((state) => state.setSelectedProperty);

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'up') {
      setIsExpanded(true);
    } else if (direction === 'down') {
      setIsExpanded(false);
    }
  };

  if (!selectedProperty) {
    return (
      <div className="fixed bottom-4 left-20 z-40">
        <AddDataButton />
      </div>
    );
  }

  return (
    <SwipeHandler onSwipe={handleSwipe}>
      <div className={`fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 transform z-40 ${
        isExpanded ? 'h-96' : 'h-12'
      }`}>
        <div className="px-4 py-2 flex items-center justify-between border-b sticky top-0 bg-white/90 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MinimizeButton
              direction="up"
              isMinimized={!isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
              className="!p-1"
            />
            <span className="font-medium">Property Details</span>
          </div>
          <button
            onClick={() => setSelectedProperty(null)}
            className="p-1 hover:bg-gray-100 rounded"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`overflow-auto transition-all duration-300 ${
          isExpanded ? 'h-[calc(100%-3rem)] opacity-100' : 'h-0 opacity-0'
        }`}>
          <div className="p-4">
            <table className="w-full">
              <tbody className="divide-y">
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Title</th>
                  <td className="py-2 px-4">{selectedProperty.title}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Plot Number</th>
                  <td className="py-2 px-4">{selectedProperty.plotNumber}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Area</th>
                  <td className="py-2 px-4">{selectedProperty.area} m²</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Price</th>
                  <td className="py-2 px-4">${selectedProperty.price.toLocaleString()}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Status</th>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      selectedProperty.status === 'available' ? 'bg-green-100 text-green-800' :
                      selectedProperty.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {selectedProperty.status}
                    </span>
                  </td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">District</th>
                  <td className="py-2 px-4">{selectedProperty.district}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Description</th>
                  <td className="py-2 px-4">{selectedProperty.description}</td>
                </tr>
                <tr>
                  <th className="py-2 px-4 text-left font-medium text-gray-600">Location</th>
                  <td className="py-2 px-4">
                    Lat: {selectedProperty.location.lat.toFixed(6)}<br />
                    Lng: {selectedProperty.location.lng.toFixed(6)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SwipeHandler>
  );
}