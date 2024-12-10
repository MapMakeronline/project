import React from 'react';
import { useMap } from 'react-leaflet';
import { useMapSettingsStore } from '../../../store/mapSettingsStore';

export function MapSettings() {
  const map = useMap();
  const settings = useMapSettingsStore((state) => state.settings);

  React.useEffect(() => {
    // Apply zoom behavior settings
    map.options.zoomDelta = settings.zoomDelta;
    map.options.zoomSnap = settings.zoomSnap;
    map.options.wheelDebounceTime = settings.wheelDebounceTime;
    map.options.wheelPxPerZoomLevel = settings.wheelPxPerZoomLevel;

    // Apply zoom limits
    map.setMinZoom(settings.minZoom);
    map.setMaxZoom(settings.maxZoom);

    // Apply animation settings
    map.options.zoomAnimation = settings.zoomAnimation;
    map.options.fadeAnimation = settings.fadeAnimation;
    map.options.markerZoomAnimation = settings.markerZoomAnimation;

    // Apply performance settings
    map.options.preferCanvas = settings.preferCanvas;
    map.options.updateWhenZooming = settings.updateWhenZooming;
    map.options.updateWhenIdle = settings.updateWhenIdle;

    // Enable smooth zoom animation if needed
    if (settings.smoothZoom) {
      map.options.zoom = map.getZoom();
      map.setZoom(map.getZoom());
    }
  }, [map, settings]);

  return null;
}