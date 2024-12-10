export type GeometryFormat = 'coordinates' | 'wkt' | 'wkb' | 'geojson' | 'gml';

export interface GeometryData {
  format: GeometryFormat;
  data: string | { lat: number; lng: number };
}