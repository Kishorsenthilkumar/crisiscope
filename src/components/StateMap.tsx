
import React, { useState } from 'react';
import { getIndiaStatesData } from '../services/indiaDataService';
import { Search, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface StateMapProps {
  selectedStateId: string | undefined;
  onStateSelect: (stateId: string) => void;
}

export const StateMap: React.FC<StateMapProps> = ({ selectedStateId, onStateSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const states = getIndiaStatesData();
  
  const filteredStates = searchQuery 
    ? states.filter(state => 
        state.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : states;
  
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.6));
  };
  
  const handleReset = () => {
    setZoomLevel(1);
  };
  
  // Function to get a color for a state based on its risk score
  const getStateColor = (stateId: string) => {
    const state = states.find(s => s.id === stateId);
    if (!state) return 'rgba(107, 114, 128, 0.7)'; // Default gray
    
    const score = state.riskScore;
    if (score >= 60) return 'rgba(239, 68, 68, 0.7)'; // High risk (red)
    if (score >= 40) return 'rgba(249, 115, 22, 0.7)'; // Medium risk (orange)
    return 'rgba(34, 197, 94, 0.7)'; // Low risk (green)
  };
  
  // Function to determine if a state should be highlighted
  const isHighlighted = (stateId: string) => {
    if (selectedStateId) return stateId === selectedStateId;
    if (searchQuery) {
      const state = states.find(s => s.id === stateId);
      return state ? state.name.toLowerCase().includes(searchQuery.toLowerCase()) : false;
    }
    return false;
  };
  
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-md">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="h-8 w-8"
          >
            <ZoomIn size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="h-8 w-8"
          >
            <ZoomOut size={16} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="h-8 w-8"
          >
            <RefreshCw size={16} />
          </Button>
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
      <div 
        className="w-full h-full bg-slate-50 dark:bg-slate-900 relative overflow-hidden"
        style={{ 
          transform: `scale(${zoomLevel})`,
          transformOrigin: 'center',
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* This would be replaced with an actual SVG map of India */}
        <svg 
          viewBox="0 0 800 800" 
          className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%]"
        >
          {/* Simplified India map for demonstration */}
          <g>
            {/* Maharashtra */}
            <path
              d="M300,400 L370,380 L390,450 L330,480 L300,400"
              fill={getStateColor("MH")}
              stroke={isHighlighted("MH") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("MH") ? 3 : 1}
              onClick={() => onStateSelect("MH")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="330" y="430" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">MH</text>
            
            {/* Tamil Nadu */}
            <path 
              d="M350,550 L380,500 L420,520 L410,580 L350,550"
              fill={getStateColor("TN")}
              stroke={isHighlighted("TN") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("TN") ? 3 : 1}
              onClick={() => onStateSelect("TN")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="380" y="540" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">TN</text>
            
            {/* Gujarat */}
            <path 
              d="M200,330 L260,320 L270,370 L220,390 L200,330"
              fill={getStateColor("GJ")}
              stroke={isHighlighted("GJ") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("GJ") ? 3 : 1}
              onClick={() => onStateSelect("GJ")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="240" y="350" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">GJ</text>
            
            {/* Karnataka */}
            <path 
              d="M300,470 L370,450 L380,510 L320,520 L300,470"
              fill={getStateColor("KA")}
              stroke={isHighlighted("KA") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("KA") ? 3 : 1}
              onClick={() => onStateSelect("KA")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="340" y="490" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">KA</text>
            
            {/* Uttar Pradesh */}
            <path 
              d="M350,250 L450,270 L430,330 L330,310 L350,250"
              fill={getStateColor("UP")}
              stroke={isHighlighted("UP") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("UP") ? 3 : 1}
              onClick={() => onStateSelect("UP")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="390" y="290" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">UP</text>
            
            {/* West Bengal */}
            <path 
              d="M500,330 L540,310 L560,370 L520,390 L500,330"
              fill={getStateColor("WB")}
              stroke={isHighlighted("WB") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("WB") ? 3 : 1}
              onClick={() => onStateSelect("WB")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="530" y="350" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">WB</text>
            
            {/* Rajasthan */}
            <path 
              d="M250,270 L330,250 L340,310 L260,330 L250,270"
              fill={getStateColor("RJ")}
              stroke={isHighlighted("RJ") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("RJ") ? 3 : 1}
              onClick={() => onStateSelect("RJ")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="290" y="290" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">RJ</text>
            
            {/* Andhra Pradesh */}
            <path 
              d="M400,460 L450,440 L470,500 L420,520 L400,460"
              fill={getStateColor("AP")}
              stroke={isHighlighted("AP") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("AP") ? 3 : 1}
              onClick={() => onStateSelect("AP")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="430" y="480" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">AP</text>
            
            {/* Telangana */}
            <path 
              d="M380,420 L450,400 L450,440 L380,460 L380,420"
              fill={getStateColor("TS")}
              stroke={isHighlighted("TS") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("TS") ? 3 : 1}
              onClick={() => onStateSelect("TS")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="415" y="430" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">TS</text>
            
            {/* Kerala */}
            <path 
              d="M320,530 L360,520 L350,580 L310,570 L320,530"
              fill={getStateColor("KL")}
              stroke={isHighlighted("KL") ? "#ffffff" : "#000000"}
              strokeWidth={isHighlighted("KL") ? 3 : 1}
              onClick={() => onStateSelect("KL")}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
            <text x="335" y="550" fill="white" fontWeight="bold" fontSize="12" textAnchor="middle">KL</text>
          </g>
        </svg>
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
    </div>
  );
};
