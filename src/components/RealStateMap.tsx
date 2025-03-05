
import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';
import { getIndiaStatesData } from '../services/indiaDataService';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

interface RealStateMapProps {
  selectedStateId: string | undefined;
  onStateSelect: (stateId: string) => void;
}

export const RealStateMap: React.FC<RealStateMapProps> = ({ selectedStateId, onStateSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const states = getIndiaStatesData();
  
  const filteredStates = searchQuery 
    ? states.filter(state => 
        state.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : states;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Create vector source and layer for state markers
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({
      source: vectorSource,
    });

    // Initialize map
    map.current = new Map({
      target: mapContainer.current,
      layers: [
        // Base map layer (OpenStreetMap)
        new TileLayer({
          source: new OSM({
            attributions: 'OpenStreetMap contributors'
          })
        }),
        // Vector layer for state markers
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([78.9629, 20.5937]), // Center on India
        zoom: 4.5,
        maxZoom: 18,
        minZoom: 2
      }),
      controls: []
    });

    // Create popup overlay
    if (popupRef.current) {
      const popup = new Overlay({
        element: popupRef.current,
        positioning: 'bottom-center',
        stopEvent: false,
        offset: [0, -10]
      });
      map.current.addOverlay(popup);
    }

    // Add state markers
    states.forEach(state => {
      if (!state.coordinates) return;
      
      // Convert geo coordinates to OpenLayers format
      const coordinates = fromLonLat(state.coordinates);
      
      // Create feature
      const feature = new Feature({
        geometry: new Point(coordinates),
        stateId: state.id,
        stateName: state.name,
        gdp: state.gdp,
        riskScore: state.riskScore
      });
      
      // Set style based on risk score
      let fillColor = 'rgba(34, 197, 94, 0.7)'; // Low risk (green)
      if (state.riskScore >= 60) {
        fillColor = 'rgba(239, 68, 68, 0.7)'; // High risk (red)
      } else if (state.riskScore >= 40) {
        fillColor = 'rgba(249, 115, 22, 0.7)'; // Medium risk (orange)
      }
      
      // Highlight if selected
      const isSelected = selectedStateId === state.id;
      const radius = isSelected ? 10 : 8;
      const strokeWidth = isSelected ? 3 : 1;
      
      feature.setStyle(new Style({
        image: new CircleStyle({
          radius: radius,
          fill: new Fill({ color: fillColor }),
          stroke: new Stroke({ color: '#ffffff', width: strokeWidth })
        })
      }));
      
      vectorSource.addFeature(feature);
    });

    // Click handler for features
    map.current.on('click', (event) => {
      const feature = map.current?.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      
      if (feature) {
        const stateId = feature.get('stateId');
        if (stateId) {
          onStateSelect(stateId);
        }
      }
    });

    // Pointer cursor on hover
    map.current.on('pointermove', (event) => {
      const pixel = map.current?.getEventPixel(event.originalEvent);
      const hit = map.current?.hasFeatureAtPixel(pixel || [0, 0]);
      const target = map.current?.getTarget() as HTMLElement;
      target.style.cursor = hit ? 'pointer' : '';
      
      // Show popup on hover
      if (hit && popupRef.current && pixel) {
        const feature = map.current?.forEachFeatureAtPixel(pixel, (feature) => feature);
        if (feature) {
          const stateName = feature.get('stateName');
          const gdp = feature.get('gdp');
          const riskScore = feature.get('riskScore');
          
          if (stateName) {
            const coordinates = (feature.getGeometry() as Point).getCoordinates();
            
            // Update popup content
            if (popupRef.current.querySelector('.state-name')) {
              (popupRef.current.querySelector('.state-name') as HTMLElement).innerText = stateName;
              (popupRef.current.querySelector('.state-gdp') as HTMLElement).innerText = `GDP: $${gdp}B`;
              (popupRef.current.querySelector('.state-risk') as HTMLElement).innerText = `Risk Score: ${riskScore}/100`;
            }
            
            const overlay = map.current?.getOverlays().getArray()[0];
            overlay?.setPosition(coordinates);
            popupRef.current.style.display = 'block';
          }
        }
      } else if (popupRef.current) {
        popupRef.current.style.display = 'none';
      }
    });

    setMapLoaded(true);

    // Cleanup
    return () => {
      map.current?.dispose();
    };
  }, []);

  // When selected state changes, fly to it
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedStateId) return;
    
    const state = states.find(s => s.id === selectedStateId);
    if (state && state.coordinates) {
      const view = map.current.getView();
      view.animate({
        center: fromLonLat(state.coordinates),
        zoom: 6,
        duration: 1000
      });
    }
  }, [selectedStateId, mapLoaded, states]);

  // Handle zoom controls
  const handleZoomIn = () => {
    if (!map.current) return;
    const view = map.current.getView();
    const zoom = view.getZoom() || 0;
    view.animate({
      zoom: zoom + 1,
      duration: 250
    });
  };

  const handleZoomOut = () => {
    if (!map.current) return;
    const view = map.current.getView();
    const zoom = view.getZoom() || 0;
    view.animate({
      zoom: zoom - 1,
      duration: 250
    });
  };

  const handleReset = () => {
    if (!map.current) return;
    const view = map.current.getView();
    view.animate({
      center: fromLonLat([78.9629, 20.5937]), // Center on India
      zoom: 4.5,
      duration: 1000
    });
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-md">
          <button
            onClick={handleZoomIn}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            -
          </button>
          <button
            onClick={handleReset}
            className="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            ↻
          </button>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="absolute top-4 right-4 z-10">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search states..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 w-[200px] bg-background/80 backdrop-blur-sm"
          />
        </div>
      </div>
      
      {/* Map Container */}
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Popup for state info */}
      <div 
        ref={popupRef} 
        className="absolute bg-background/90 backdrop-blur-sm p-2 rounded-lg shadow-md z-20 hidden transform -translate-x-1/2 pointer-events-none"
      >
        <div className="text-sm font-medium state-name"></div>
        <div className="text-xs state-gdp"></div>
        <div className="text-xs state-risk"></div>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-md">
        <div className="text-xs font-medium mb-2">Economic Risk Level</div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-70"></div>
          <span className="text-xs">High Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-orange-500 opacity-70"></div>
          <span className="text-xs">Medium Risk</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-70"></div>
          <span className="text-xs">Low Risk</span>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && filteredStates.length > 0 && (
        <div className="absolute top-16 right-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-10 max-h-60 overflow-y-auto w-[200px]">
          {filteredStates.map(state => (
            <div 
              key={state.id}
              className="py-1.5 px-2 hover:bg-accent/50 rounded cursor-pointer text-sm"
              onClick={() => {
                onStateSelect(state.id);
                setSearchQuery('');
              }}
            >
              {state.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
