// Zoom level suitable for viewing individual plots
export const PLOT_ZOOM_LEVEL = 18;

export const MARKER_STYLES = {
  selected: {
    color: '#2563eb', // Blue-600
    fillColor: '#2563eb',
    fillOpacity: 0.6,
    weight: 2,
    radius: 8
  },
  property: {
    color: '#2563eb',
    fillColor: '#2563eb',
    fillOpacity: 0.4,
    weight: 1,
    radius: 6
  }
};

export interface BaseLayer {
  id: string;
  name: string;
  type: 'osm' | 'google';
  googleType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  url?: string;
  attribution?: string;
}

export const baseLayers: BaseLayer[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    type: 'osm',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  {
    id: 'google-roadmap',
    name: 'Google Maps',
    type: 'google',
    googleType: 'roadmap'
  },
  {
    id: 'google-satellite',
    name: 'Satellite',
    type: 'google',
    googleType: 'satellite'
  },
  {
    id: 'google-hybrid',
    name: 'Hybrid',
    type: 'google',
    googleType: 'hybrid'
  },
  {
    id: 'google-terrain',
    name: 'Terrain',
    type: 'google',
    googleType: 'terrain'
  }
];