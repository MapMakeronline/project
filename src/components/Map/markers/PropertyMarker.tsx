import React from 'react';
import { CircleMarker, Popup } from 'react-leaflet';
import { Property } from '../../../types/property';
import { MARKER_STYLES } from '../constants';

interface PropertyMarkerProps {
  property: Property;
  onSelect: (property: Property) => void;
}

export function PropertyMarker({ property, onSelect }: PropertyMarkerProps) {
  return (
    <CircleMarker
      center={[property.location.lat, property.location.lng]}
      {...MARKER_STYLES.property}
      eventHandlers={{
        click: () => onSelect(property),
      }}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-bold">{property.title}</h3>
          <p className="text-sm">{property.area} m²</p>
          <p className="text-sm font-semibold">${property.price.toLocaleString()}</p>
        </div>
      </Popup>
    </CircleMarker>
  );
}