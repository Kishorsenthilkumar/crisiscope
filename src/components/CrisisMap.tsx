
import React, { useState } from 'react';
import { Filter, Search, Map, BarChart3, AlertCircle } from 'lucide-react';

export const CrisisMap: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const filters = [
    { id: 'all', label: 'All Crises', icon: <Map size={16} /> },
    { id: 'economic', label: 'Economic', icon: <BarChart3 size={16} /> },
    { id: 'disasters', label: 'Disasters', icon: <AlertCircle size={16} /> },
  ];
  
  // Mock data for crisis points
  const crisisPoints = [
    { id: 1, lat: 25, lng: -80, type: 'economic', severity: 'high', region: 'North America' },
    { id: 2, lat: 10, lng: 20, type: 'disasters', severity: 'high', region: 'Africa' },
    { id: 3, lat: 35, lng: 139, type: 'economic', severity: 'medium', region: 'Asia' },
    { id: 4, lat: -33, lng: 151, type: 'disasters', severity: 'low', region: 'Australia' },
    { id: 5, lat: 52, lng: 13, type: 'economic', severity: 'medium', region: 'Europe' },
  ];
  
  // Filter crisis points
  const filteredPoints = activeFilter === 'all' 
    ? crisisPoints 
    : crisisPoints.filter(point => point.type === activeFilter);
  
  return (
    <div className="w-full h-full rounded-xl overflow-hidden bg-card/80 backdrop-blur-md border border-border/60 relative">
      {/* Map Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex justify-between items-center">
        <div className="text-lg font-medium">Crisis Heatmap</div>
        <div className="flex gap-2">
          {/* Search */}
          <div className="glass-panel rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Search size={16} className="text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search regions..." 
              className="bg-transparent border-none focus:outline-none text-sm w-36"
            />
          </div>
          
          {/* Filter */}
          <div className="glass-panel rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <select 
              className="bg-transparent border-none focus:outline-none text-sm appearance-none w-28"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              {filters.map(filter => (
                <option key={filter.id} value={filter.id}>{filter.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Map Display (mockup) */}
      <div className="w-full h-full bg-[#1c2333] overflow-hidden relative">
        {/* World map background (basic SVG for demo) */}
        <div className="absolute inset-0 opacity-50 flex items-center justify-center">
          <svg width="80%" height="80%" viewBox="0 0 1000 500" className="opacity-30">
            <path d="M250,100 Q400,50 600,100 T950,100 V400 Q800,350 600,400 T50,400 V100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            <path d="M50,250 H950" stroke="currentColor" strokeWidth="0.5" />
            <path d="M500,100 V400" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="500" cy="250" r="200" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <circle cx="500" cy="250" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        
        {/* Crisis points */}
        {filteredPoints.map(point => {
          // Convert geo coordinates to screen coordinates (simplified)
          const x = (point.lng + 180) / 360 * 100;
          const y = (90 - point.lat) / 180 * 100;
          
          let color = '#2EC4B6'; // low
          if (point.severity === 'high') color = '#FF4A4A';
          else if (point.severity === 'medium') color = '#FF9F45';
          
          return (
            <div 
              key={point.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse-gentle"
              style={{ 
                left: `${x}%`, 
                top: `${y}%`,
              }}
            >
              <div 
                className="w-4 h-4 rounded-full relative"
                style={{ backgroundColor: color }}
              >
                <div 
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{ 
                    backgroundColor: color,
                    animationDuration: '3s',
                    opacity: 0.4
                  }}
                />
              </div>
            </div>
          );
        })}
        
        {/* Map glow effects */}
        <div className="absolute inset-0 bg-gradient-to-t from-card/30 to-transparent pointer-events-none" />
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 glass-panel rounded-lg px-3 py-2 flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-crisis-high" />
          <span className="text-xs">High Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-crisis-medium" />
          <span className="text-xs">Medium Risk</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-crisis-low" />
          <span className="text-xs">Low Risk</span>
        </div>
      </div>
    </div>
  );
};
