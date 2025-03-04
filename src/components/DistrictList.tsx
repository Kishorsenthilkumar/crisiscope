
import React, { useState } from 'react';
import { getDistrictsByState } from '../services/indiaDataService';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DistrictListProps {
  stateId: string;
  selectedDistrictId: string | null;
  onDistrictSelect: (districtId: string) => void;
}

export const DistrictList: React.FC<DistrictListProps> = ({ 
  stateId, 
  selectedDistrictId,
  onDistrictSelect 
}) => {
  const districts = getDistrictsByState(stateId);
  const [expandedDistrict, setExpandedDistrict] = useState<string | null>(null);
  
  const handleDistrictClick = (districtId: string) => {
    onDistrictSelect(districtId);
    
    if (expandedDistrict === districtId) {
      setExpandedDistrict(null);
    } else {
      setExpandedDistrict(districtId);
    }
  };
  
  if (districts.length === 0) {
    return <div className="text-muted-foreground text-sm">No district data available</div>;
  }
  
  return (
    <div className="space-y-2">
      {districts.map(district => {
        const isExpanded = expandedDistrict === district.id;
        
        return (
          <div 
            key={district.id}
            className={`bg-card/50 border border-border/80 rounded-lg overflow-hidden transition-all duration-300 ${
              isExpanded ? 'shadow-md' : ''
            }`}
          >
            <div 
              className={`flex items-center justify-between p-2.5 cursor-pointer hover:bg-accent/30 ${
                selectedDistrictId === district.id ? 'bg-accent/50' : ''
              }`}
              onClick={() => handleDistrictClick(district.id)}
            >
              <div>
                <div className="font-medium">{district.name}</div>
                <div className="text-xs text-muted-foreground">
                  GDP: ${district.gdp}B
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center bg-background/80 px-2 py-1 rounded-full text-xs">
                        {district.gdpGrowth > 0 ? (
                          <TrendingUp size={12} className="text-green-500 mr-1" />
                        ) : (
                          <TrendingDown size={12} className="text-red-500 mr-1" />
                        )}
                        <span className={district.gdpGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                          {district.gdpGrowth > 0 ? '+' : ''}{district.gdpGrowth}%
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>GDP Growth Rate</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <ChevronRight 
                  size={16} 
                  className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
                />
              </div>
            </div>
            
            {isExpanded && (
              <div className="px-4 py-3 border-t border-border/30 bg-accent/20 text-sm">
                <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                  <div>
                    <div className="text-muted-foreground">Population:</div>
                    <div>{district.populationMillions}M</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Unemployment:</div>
                    <div>{district.unemploymentRate}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Risk Score:</div>
                    <div 
                      className={
                        district.riskScore > 60 ? 'text-red-500' : 
                        district.riskScore > 40 ? 'text-orange-500' : 
                        'text-green-500'
                      }
                    >
                      {district.riskScore}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">GDP Growth:</div>
                    <div className={district.gdpGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
                      {district.gdpGrowth > 0 ? '+' : ''}{district.gdpGrowth}%
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-muted-foreground mb-1">Economic Health:</div>
                  <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        district.riskScore > 60 ? 'bg-red-500' : 
                        district.riskScore > 40 ? 'bg-orange-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${100 - district.riskScore}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
