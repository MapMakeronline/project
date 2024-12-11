import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLayerStore } from '../../../store/layerStore';
import { baseLayers } from '../constants';

export function BaseLayerManager() {
  const map = useMap();
  const activeBaseLayer = useLayerStore((state) => state.activeBaseLayer);
  
  useEffect(() => {
    const layer = baseLayers.find(l => l.id === activeBaseLayer);
    if (!layer) return;

    let tileLayer: L.TileLayer;

    if (layer.type === 'google') {
      tileLayer = L.tileLayer(
        `https://mt1.google.com/vt/lyrs=${
          layer.googleType === 'satellite' ? 's' :
          layer.googleType === 'hybrid' ? 'y' :
          layer.googleType === 'terrain' ? 'p' :
          'm'
        }&x={x}&y={y}&z={z}`,
        {
          maxZoom: 20,
          minZoom: 0,
          attribution: '&copy; Google Maps'
        }
      );
    } else {
      tileLayer = L.tileLayer(
        layer.url!,
        {
          attribution: layer.attribution,
          maxZoom: 19
        }
      );
    }

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, activeBaseLayer]);

  return null;
}