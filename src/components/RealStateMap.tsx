
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getIndiaStatesData } from '../services/indiaDataService';
import { Search } from 'lucide-react';
import { Input } from './ui/input';

// Store the Mapbox token in a variable for easy updating
const MAPBOX_TOKEN = ''; // You'll need to add your Mapbox token here

interface RealStateMapProps {
  selectedStateId: string | undefined;
  onStateSelect: (stateId: string) => void;
}

export const RealStateMap: React.FC<RealStateMapProps> = ({ selectedStateId, onStateSelect }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState(MAPBOX_TOKEN || localStorage.getItem('mapbox_token') || '');
  
  const states = getIndiaStatesData();
  
  const filteredStates = searchQuery 
    ? states.filter(state => 
        state.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : states;

  // Handle token input change
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = e.target.value;
    setMapboxToken(token);
    localStorage.setItem('mapbox_token', token);
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        zoom: 4,
        center: [78.9629, 20.5937], // Center on India
        pitch: 0,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Add state boundaries - this would be replaced with actual GeoJSON data of India states
        if (map.current) {
          addStateBoundaries();
        }
      });

      // Cleanup
      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }, [mapboxToken]);

  // When selected state changes, fly to it
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedStateId) return;
    
    const state = states.find(s => s.id === selectedStateId);
    if (state && state.coordinates) {
      map.current.flyTo({
        center: state.coordinates,
        zoom: 6,
        duration: 1500
      });
    }
  }, [selectedStateId, mapLoaded, states]);

  // Add state boundaries to the map
  const addStateBoundaries = () => {
    if (!map.current) return;
    
    // For each state in our data, add a marker
    states.forEach(state => {
      if (!state.coordinates) return;
      
      // Create state marker element
      const el = document.createElement('div');
      el.className = 'state-marker';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      
      // Set color based on risk score
      if (state.riskScore >= 60) {
        el.style.backgroundColor = 'rgba(239, 68, 68, 0.7)'; // High risk (red)
      } else if (state.riskScore >= 40) {
        el.style.backgroundColor = 'rgba(249, 115, 22, 0.7)'; // Medium risk (orange)
      } else {
        el.style.backgroundColor = 'rgba(34, 197, 94, 0.7)'; // Low risk (green)
      }
      
      // Highlight if selected
      if (selectedStateId === state.id) {
        el.style.boxShadow = '0 0 0 3px #ffffff';
        el.style.width = '25px';
        el.style.height = '25px';
      }
      
      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat(state.coordinates)
        .addTo(map.current);
        
      // Add popup with basic info
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="font-family: system-ui, sans-serif; padding: 8px;">
            <h3 style="margin: 0 0 8px; font-weight: 600;">${state.name}</h3>
            <p style="margin: 0; font-size: 12px;">GDP: $${state.gdp}B</p>
            <p style="margin: 4px 0 0; font-size: 12px;">Risk Score: ${state.riskScore}/100</p>
          </div>
        `);
      
      // Add click handler
      el.addEventListener('click', () => {
        onStateSelect(state.id);
      });
      
      // Show popup on hover
      el.addEventListener('mouseenter', () => {
        marker.setPopup(popup);
        popup.addTo(map.current!);
      });
      
      el.addEventListener('mouseleave', () => {
        popup.remove();
      });
    });
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Token Input (if not provided) */}
      {!mapboxToken && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-20 p-4">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Mapbox Token Required</h3>
            <p className="text-muted-foreground mb-4">
              To use the interactive map, please enter your Mapbox public access token.
              You can get one for free at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>.
            </p>
            <Input
              type="text"
              placeholder="Enter your Mapbox token"
              value={mapboxToken}
              onChange={handleTokenChange}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              Your token will be saved in your browser's local storage.
            </p>
          </div>
        </div>
      )}
      
      {/* Search Bar */}
      <div className="absolute top-4 left-4 z-10">
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
        <div className="absolute top-16 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-10 max-h-60 overflow-y-auto w-[200px]">
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
