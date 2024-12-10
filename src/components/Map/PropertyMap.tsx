import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { usePropertyStore } from '../../store/propertyStore';
import { useMapSettingsStore } from '../../store/mapSettingsStore';
import { MapEvents } from './components/MapEvents';
import { BaseLayerManager } from './components/BaseLayerManager';
import { MapSettings } from './components/MapSettings';
import { SelectedPointMarker } from './markers/SelectedPointMarker';
import { PropertyMarker } from './markers/PropertyMarker';
import 'leaflet/dist/leaflet.css';

export function PropertyMap() {
  const properties = usePropertyStore((state) => state.properties);
  const setSelectedProperty = usePropertyStore((state) => state.setSelectedProperty);
  const mapSettings = useMapSettingsStore((state) => state.settings);

  return (
    <MapContainer
      center={[52.237049, 21.017532]}
      zoom={13}
      className="w-full h-full"
      zoomControl={false}
      doubleClickZoom={false}
      {...mapSettings}
    >
      <BaseLayerManager />
      <MapEvents />
      <MapSettings />
      <SelectedPointMarker />
      
      {properties.map((property) => (
        <PropertyMarker
          key={property.id}
          property={property}
          onSelect={setSelectedProperty}
        />
      ))}
    </MapContainer>
  );
}