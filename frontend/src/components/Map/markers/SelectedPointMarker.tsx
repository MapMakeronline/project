import React, { useState, useEffect } from 'react';
import { GeoJSON, Popup } from 'react-leaflet';
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
  const [MPZP,setMPZP] = useState<string | null>('Brak danych');
  const [SUiKZP,setSUiKZP] = useState<string | null>('Brak danych');
  const [POG,setPOG] = useState<string | null>('Brak danych');
  const [EMiA,setEMiA] =useState<string | null>('Brak danych');

  function transformId(id) {
    id = id.trim();
    id = id.slice(0, 8);
  
    const lastChar = id.slice(-1);
    
    if (lastChar === '8' || lastChar === '9') {
      return id.slice(0, -4) + '01_1';
    }
  
    return id.slice(0, 6);
  }

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
          coordinates: [coordinates[0]]
        }
      };
    } catch (error) {
      console.error('Error converting WKT to GeoJSON:', error);
      return null;
    }
  };

  const resetStates = () => {
    setMPZP('Brak danych');
    setSUiKZP('Brak danych');
    setPOG('Brak danych');
    setEMiA('Brak danych');
  };
  

  const fetchCollectionLinks = async (parcelId: string) => {
    const CONFIG = {
      "Zbiór danych przestrzennych dla miejscowych planów zagospodarowania przestrzennego": {
        setter: setMPZP,
        defaultText: 'Link do MPZP'
      },
      "Studium uwarunkowań i kierunków zagospodarowania przestrzennego": {
        setter: setSUiKZP,
        defaultText: 'Link do SUiKZP'
      },
      "Zbiór danych przestrzennych dla planu ogólnego gminy": {
        setter: setPOG,
        defaultText: 'Link do POG'
      },
      "Ewidencja Miejscowości Ulic i Adresów": {
        setter: setEMiA,
        defaultText: 'Link do EMiA'
      }
    };
  
    try {
      let urlId= transformId(parcelId)
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = encodeURIComponent(`https://integracja.gugik.gov.pl/eziudp/index.php?teryt=${urlId}`);
      const response = await fetch(`${proxyUrl}${targetUrl}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml',
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      
      Array.from(doc.querySelectorAll('table tr'))
        .slice(1)
        .forEach(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          if (cells.length < 6) return;
  
          const cell3Text = cells[2].textContent?.trim() || '';
          const cell6Link = cells[5].querySelector('a');
  
  
          const config = CONFIG[cell3Text];
          if (config && cell6Link) {
            config.setter(
              <a 
                href={cell6Link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline"
              >
                {cell6Link.textContent || config.defaultText}
              </a>
            );
          }
        });
    } catch (error) {
      console.error('Error fetching collections:', error);
      throw error;
    }
  };

  const checkPlot = async () => {
    if (!clickedPoint) return;
    
    setLoading(true);
    setError(null);
    setGeoJsonData(null);
    
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
        await fetchCollectionLinks(parcelData.id);
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

  useEffect(() => {
    resetStates();
    checkPlot();
  }, [clickedPoint]);

  if (!clickedPoint) return null;

  return geoJsonData ? (
    <>
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
      {parcelInfo && (
        <Popup position={[clickedPoint.lat, clickedPoint.lng]} maxWidth={400} >
          <div className="w-full max-w-md p-3">
            <h3 className="font-semibold text-lg mb-3 border-b pb-2">Informacje o działce</h3>
            <div className="grid grid-cols-[120px_1fr] gap-2 text-sm">
              <span className="font-medium text-gray-700">ID:</span>
              <span className="text-gray-900">{parcelInfo.id}</span>
              
              <span className="font-medium text-gray-700">Województwo:</span>
              <span className="text-gray-900">{parcelInfo.voivodeship}</span>
              
              <span className="font-medium text-gray-700">Powiat:</span>
              <span className="text-gray-900">{parcelInfo.county}</span>
              
              <span className="font-medium text-gray-700">Gmina:</span>
              <span className="text-gray-900">{parcelInfo.commune}</span>
              
              <span className="font-medium text-gray-700">Obręb:</span>
              <span className="text-gray-900">{parcelInfo.region}</span>
              
              <span className="font-medium text-gray-700">Nr działki:</span>
              <span className="text-gray-900">{parcelInfo.parcel}</span>

              <div className="col-span-2 mt-2 border-t pt-2">
                <div className="flex flex-col gap-2">
                  <div className="p-2 bg-gray-50 rounded overflow-auto">
                    <span className="font-medium text-gray-700">MPZP</span>
                    <span className="block text-xs text-gray-500">{MPZP}</span>
                  </div>

                  <div className="p-2 bg-gray-50 rounded overflow-auto">
                    <span className="font-medium text-gray-700">SUiKZP</span>
                    <span className="block text-xs text-gray-500">{SUiKZP}</span>
                  </div>

                  <div className="p-2 bg-gray-50 rounded overflow-auto">
                    <span className="font-medium text-gray-700">POG</span>
                    <span className="block text-xs text-gray-500">{POG}</span>
                  </div>

                  <div className="p-2 bg-gray-50 rounded overflow-auto">
                    <span className="font-medium text-gray-700">EMiA</span>
                    <span className="block text-xs text-gray-500">{EMiA}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </>
  ) : null;
}
