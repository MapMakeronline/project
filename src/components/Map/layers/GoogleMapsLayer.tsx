import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface GoogleMapsLayerProps {
  type?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
}

export function GoogleMapsLayer({ type = 'roadmap' }: GoogleMapsLayerProps) {
  const map = useMap();

  useEffect(() => {
    const googleLayer = L.tileLayer(
      `https://mt1.google.com/vt/lyrs=${
        type === 'satellite' ? 's' :
        type === 'hybrid' ? 'y' :
        type === 'terrain' ? 'p' :
        'm'
      }&x={x}&y={y}&z={z}`,
      {
        maxZoom: 20,
        minZoom: 0,
        attribution: '&copy; Google Maps'
      }
    );

    map.addLayer(googleLayer);

    return () => {
      map.removeLayer(googleLayer);
    };
  }, [map, type]);

  return null;
}