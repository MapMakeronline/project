import React from 'react';
import { Marker, Popup, CircleMarker } from 'react-leaflet';
import { useMapStore } from '../../../store/mapStore';
import { MARKER_STYLES } from '../constants';

export function SelectedPointMarker() {
  const clickedPoint = useMapStore((state) => state.clickedPoint);

  if (!clickedPoint) return null;

  return (
    <CircleMarker 
      center={[clickedPoint.lat, clickedPoint.lng]}
      {...MARKER_STYLES.selected}
    >
      <Popup>
        <div className="p-2">
          <p className="text-sm font-medium mb-2">Selected Location</p>
          <p className="text-sm">
            Lat: {clickedPoint.lat.toFixed(6)}<br />
            Lng: {clickedPoint.lng.toFixed(6)}
          </p>
          <button
            onClick={() => {
              // TODO: Implement plot check functionality
              console.log('Checking plot at:', clickedPoint);
            }}
            className="mt-2 w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Check Plot
          </button>
        </div>
      </Popup>
    </CircleMarker>
  );
}