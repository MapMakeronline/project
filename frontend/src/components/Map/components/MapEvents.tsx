import React from 'react';
import { useMapEvents } from 'react-leaflet';
import { useNotificationStore } from '../../../store/notificationStore';
import { useMapStore } from '../../../store/mapStore';
import { useMapSettingsStore } from '../../../store/mapSettingsStore';
import { useToolStore } from '../../../store/toolStore';
import { PLOT_ZOOM_LEVEL } from '../constants';

export function MapEvents() {
  const setActiveLabel = useNotificationStore((state) => state.setActiveLabel);
  const { clickedPoint, setClickedPoint } = useMapStore();
  const settings = useMapSettingsStore((state) => state.settings);
  const activeTool = useToolStore((state) => state.activeTool);

  const map = useMapEvents({
    mousemove: (e) => {
      if (!clickedPoint) {
        const { lat, lng } = e.latlng;
        setActiveLabel(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      }
    },
    mouseout: () => {
      if (!clickedPoint) {
        setActiveLabel(null);
      }
    },
    click: (e) => {
      const { lat, lng } = e.latlng;
      
      // If identify tool is active, handle identification
      if (activeTool === 'identify') {
        setClickedPoint({ lat, lng });
        setActiveLabel(`Selected point: Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
        return;
      }

      // Handle single click zoom
      if (settings.singleClickZoom && !activeTool) {
        setClickedPoint({ lat, lng });
        setActiveLabel(`Selected point: Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
        map.setView([lat, lng], settings.singleClickZoomLevel, {
          animate: settings.zoomAnimation
        });
      }
    },
    dblclick: (e) => {
      // Only handle double click if no tool is active
      if (!activeTool && settings.doubleClickZoom) {
        const { lat, lng } = e.latlng;
        setClickedPoint({ lat, lng });
        setActiveLabel(`Selected point: Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
        map.setView([lat, lng], settings.doubleClickZoomLevel, {
          animate: settings.zoomAnimation
        });
      }
    }
  });

  return null;
}