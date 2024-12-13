import React, { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { useMapStore } from '../../../store/mapStore';
import proj4 from 'proj4';
import { Feature, Geometry } from 'geojson';

interface ParcelInfo {
  id: string;
  voivodeship: string;
  county: string;
  commune: string;
  region: string;
  parcel: string;
}

type GeoJSONFeature = Feature<Geometry>;

export function SelectedPointMarker() {
  const clickedPoint = useMapStore((state) => state.clickedPoint);
  const [parcelInfo, setParcelInfo] = useState<ParcelInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONFeature | null>(null);

  const wgs84ToPUWG1992 = (lat: number, lon: number) => {
    const a = 6378137.0;
    const e2 = 0.00669438002290;
    const m0 = 0.9993;
    const L0 = 19 * Math.PI / 180;
    const fi = lat * Math.PI / 180;
    const lambda = lon * Math.PI / 180;
    const b2 = a * a * (1 - e2);
    const ep2 = (a * a - b2) / b2;
    const t = Math.tan(fi);
    const n2 = ep2 * Math.pow(Math.cos(fi), 2);
    const N = a / Math.sqrt(1 - e2 * Math.pow(Math.sin(fi), 2));
    const dL = lambda - L0;
    const dL2 = dL * dL;
    const dL4 = dL2 * dL2;
    
    const xgk = N * Math.cos(fi) * dL * (1 + (dL2 * Math.pow(Math.cos(fi), 2) * (1 - t * t + n2)) / 6 + 
      (dL4 * Math.pow(Math.cos(fi), 4) * (5 - 18 * t * t + t * t * t * t + 14 * n2 - 58 * n2 * t * t)) / 120);
    
    const ygk = meridianArc(fi) + (N * Math.sin(fi) * Math.cos(fi) * dL2 / 2) * 
      (1 + (dL2 * Math.pow(Math.cos(fi), 2) * (5 - t * t + 9 * n2 + 4 * n2 * n2)) / 24 + 
      (dL4 * Math.pow(Math.cos(fi), 4) * (61 - 58 * t * t + t * t * t * t + 270 * n2 - 330 * n2 * t * t)) / 720);
    
    const y92 = xgk * m0 + 500000;
    const x92 = ygk * m0 - 5300000;
    
    return { x: x92.toFixed(2), y: y92.toFixed(2) };
  };

  const meridianArc = (fi: number) => {
    const a = 6378137.0;
    const e2 = 0.00669438002290;
    const e4 = e2 * e2;
    const e6 = e4 * e2;
    const e8 = e6 * e2;
    const A0 = 1 - e2 / 4 - 3 * e4 / 64 - 5 * e6 / 256 - 175 * e8 / 16384;
    const A2 = 3 / 8 * (e2 + e4 / 4 + 15 * e6 / 128 - 455 * e8 / 4096);
    const A4 = 15 / 256 * (e4 + 3 * e6 / 4 - 77 * e8 / 128);
    const A6 = 35 / 3072 * (e6 + 59 * e8 / 16);
    const A8 = 315 / 131072 * e8;
    return a * (A0 * fi - A2 * Math.sin(2 * fi) + A4 * Math.sin(4 * fi) - A6 * Math.sin(6 * fi) + A8 * Math.sin(8 * fi));
  };

  const wktToGeoJSON = (wktString: string): GeoJSONFeature | null => {
    try {
      proj4.defs("EPSG:2180", "+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");

      const parseCoordinateString = (coordString: string) => {
        return coordString.split(',').map(point => {
          const [x, y] = point.trim().split(' ').map(Number);
          const transformed = proj4('EPSG:2180', 'EPSG:4326', [x, y]);
          return transformed;
        });
      };

      let rings: string[] = [];
      if (wktString.includes("POLYGON")) {
        const polygonContent = wktString.match(/POLYGON\s*\(\((.*?)\)\)/s);
        if (polygonContent) {
          rings = polygonContent[1].split('),(').map(ring => ring.replace(/^\(|\)$/g, ''));
        } else {
          const sridContent = wktString.match(/SRID=\d+;POLYGON\s*\(\((.*?)\)\)/s);
          if (sridContent) {
            rings = sridContent[1].split('),(').map(ring => ring.replace(/^\(|\)$/g, ''));
          }
        }
      } else {
        rings = [wktString];
      }

      const coordinates = rings.map(ring => {
        const points = parseCoordinateString(ring);
        if (points.length > 0 && 
            (points[0][0] !== points[points.length-1][0] || 
             points[0][1] !== points[points.length-1][1])) {
          points.push(points[0]);
        }
        return points;
      });

      return {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [coordinates[0]] // Take first ring as main polygon
        }
      };
    } catch (error) {
      console.error('Error converting WKT to GeoJSON:', error);
      return null;
    }
  };

  const checkPlot = async () => {
    if (!clickedPoint) return;
    
    setLoading(true);
    setError(null);
    setGeoJsonData(null); // Clear previous plot boundary
    
    try {
      const converted = wgs84ToPUWG1992(clickedPoint.lat, clickedPoint.lng);
      const response = await fetch(
        `https://uldk.gugik.gov.pl/?request=GetParcelByXY&xy=${converted.y},${converted.x}&result=id,voivodeship,county,commune,region,parcel,geom_wkt&srid=2180`
      );
      
      const data = await response.text();
      
      if (data.includes("ERROR")) {
        setError("No plot found at this location");
        setParcelInfo(null);
        return;
      }
      
      const parts = data.split('|');
      if (parts.length >= 7) {
        const parcelData: ParcelInfo = {
          id: parts[0].replace(/^0+/, ''),
          voivodeship: parts[1],
          county: parts[2],
          commune: parts[3],
          region: parts[4],
          parcel: parts[5]
        };
        
        setParcelInfo(parcelData);
        
        const geoJSON = wktToGeoJSON(parts[6]);
        if (geoJSON) {
          setGeoJsonData(geoJSON);
        }
      }
    } catch (err) {
      setError("Error fetching plot information");
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch plot data immediately when clickedPoint changes
  useEffect(() => {
    checkPlot();
  }, [clickedPoint]);

  if (!clickedPoint) return null;

  return geoJsonData ? (
    <GeoJSON 
      key={`${clickedPoint.lat}-${clickedPoint.lng}`}
      data={geoJsonData}
      style={{
        color: '#0066FF',
        weight: 2,
        opacity: 1,
        fillColor: '#0066FF',
        fillOpacity: 0.3
      }}
    />
  ) : null;
}
