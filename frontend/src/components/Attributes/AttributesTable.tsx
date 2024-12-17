import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { usePropertyStore } from '../../store/propertyStore';
import { useAttributesTableStore } from '../../store/attributesTableStore';
import { MinimizeButton } from '../common/MinimizeButton';
import { SwipeHandler } from '../common/SwipeHandler';
import { AddDataButton } from './AddDataButton';
import { BaseLayers } from '../LayerTree/BaseLayers';
import { useCustomSectionsStore } from '../../store/customSectionsStore';

export function AttributesTable() {
  const [isExpanded, setIsExpanded] = useState(false);
  const selectedProperty = usePropertyStore((state) => state.selectedProperty);
  const setSelectedProperty = usePropertyStore((state) => state.setSelectedProperty);
  const { isVisible, selectedLayerId, selectedSectionId, hideAttributesTable } = useAttributesTableStore();
  const sections = useCustomSectionsStore((state) => state.sections);

  useEffect(() => {
    console.log('AttributesTable state:', {
      isVisible,
      selectedLayerId,
      selectedSectionId,
      hasSelectedProperty: !!selectedProperty
    });
  }, [isVisible, selectedLayerId, selectedSectionId, selectedProperty]);

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (direction === 'up') {
      setIsExpanded(true);
    } else if (direction === 'down') {
      setIsExpanded(false);
    }
  };

  if (isVisible && selectedLayerId && selectedSectionId) {
    console.log('Rendering layer attributes view');
    const section = sections.find(s => s.id === selectedSectionId);
    const layer = section?.layers.find(l => l.id === selectedLayerId);

    if (section && layer) {
      return (
        <SwipeHandler onSwipe={handleSwipe}>
          <div 
            className={`fixed bottom-0 left-0 right-0 bg-white shadow-xl transition-all duration-300 transform z-50 ${
              isExpanded ? 'h-96' : 'h-12'
            }`}
          >
            <div className="px-4 py-2 flex items-center justify-between border-b border-gray-300 sticky top-0 bg-white">
              <div className="flex items-center gap-2">
                <MinimizeButton
                  direction="up"
                  isMinimized={!isExpanded}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="!p-1"
                />
                <span className="font-semibold text-gray-800">{layer.name} Attributes</span>
              </div>
              <button
                onClick={hideAttributesTable}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`overflow-auto transition-all duration-300 ${
              isExpanded ? 'h-[calc(100%-3rem)] opacity-100' : 'h-0 opacity-0'
            }`}>
              <div className="p-0">
                <table className="w-full border-collapse [border-spacing:0]" style={{ border: '1px solid #d1d5db' }}>
                  <tbody>
                    <tr>
                      <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Layer Name</th>
                      <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">{layer.name}</td>
                    </tr>
                    <tr>
                      <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Section</th>
                      <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">{section.name}</td>
                    </tr>
                    <tr>
                      <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Visibility</th>
                      <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">{layer.visible ? 'Visible' : 'Hidden'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </SwipeHandler>
      );
    }
  }

  if (selectedProperty) {
    console.log('Rendering property details view');
    return (
      <SwipeHandler onSwipe={handleSwipe}>
        <div className={`fixed bottom-0 left-0 right-0 bg-white shadow-xl transition-all duration-300 transform z-50 ${
          isExpanded ? 'h-96' : 'h-12'
        }`}>
          <div className="px-4 py-2 flex items-center justify-between border-b border-gray-300 sticky top-0 bg-white">
            <div className="flex items-center gap-2">
              <MinimizeButton
                direction="up"
                isMinimized={!isExpanded}
                onClick={() => setIsExpanded(!isExpanded)}
                className="!p-1"
              />
              <span className="font-semibold text-gray-800">Property Details</span>
            </div>
            <button
              onClick={() => setSelectedProperty(null)}
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className={`overflow-auto transition-all duration-300 ${
            isExpanded ? 'h-[calc(100%-3rem)] opacity-100' : 'h-0 opacity-0'
          }`}>
            <div className="p-4">
              <table className="w-full border-collapse [border-spacing:0]" style={{ border: '1px solid #d1d5db' }}>
                <tbody>
                  <tr>
                    <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Title</th>
                    <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">{selectedProperty.title}</td>
                  </tr>
                  <tr>
                    <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Plot Number</th>
                    <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">{selectedProperty.plotNumber}</td>
                  </tr>
                  <tr>
                    <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Area</th>
                    <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">{selectedProperty.area} m²</td>
                  </tr>
                  <tr>
                    <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Price</th>
                    <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">${selectedProperty.price.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Status</th>
                    <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">
                      <span className={`px-2 py-0.5 rounded text-sm ${
                        selectedProperty.status === 'available' ? 'bg-green-100 text-green-800' :
                        selectedProperty.status === 'reserved' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {selectedProperty.status}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">District</th>
                    <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">{selectedProperty.district}</td>
                  </tr>
                  <tr>
                    <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Description</th>
                    <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">{selectedProperty.description}</td>
                  </tr>
                  <tr>
                    <th className="py-1.5 px-3 text-left font-medium border border-gray-300 bg-white w-1/2">Location</th>
                    <td className="py-1.5 px-3 border border-gray-300 bg-white w-1/2">
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

  console.log('Rendering default view');
  return (
    <div className="fixed bottom-4 left-20 z-40">
      <AddDataButton />
      <BaseLayers />
    </div>
  );
}
