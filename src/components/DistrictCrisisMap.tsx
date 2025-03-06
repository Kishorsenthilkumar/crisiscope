
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { getDistrictsByState } from '../services/indiaDataService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DistrictCrisisMapProps {
  stateId: string;
  selectedDistrictId: string | null;
}

export const DistrictCrisisMap: React.FC<DistrictCrisisMapProps> = ({ 
  stateId, 
  selectedDistrictId 
}) => {
  const districts = getDistrictsByState(stateId);
  
  if (districts.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>District Crisis Map</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No district data available</p>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate crisis severity levels for visualization
  const processedDistricts = districts.map(district => {
    let severity: 'high' | 'medium' | 'low';
    if (district.riskScore >= 60) severity = 'high';
    else if (district.riskScore >= 40) severity = 'medium';
    else severity = 'low';
    
    return {
      ...district,
      severity
    };
  });
  
  // Function to get color based on severity
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    if (severity === 'high') return 'bg-red-500';
    if (severity === 'medium') return 'bg-orange-500';
    return 'bg-green-500';
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center">
          <AlertCircle size={16} className="mr-2" />
          District Crisis Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-64 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
          {/* Simple visualization grid */}
          <div className="grid grid-cols-3 gap-2 p-4 absolute inset-0">
            {processedDistricts.map(district => (
              <div 
                key={district.id}
                className={`
                  relative rounded-md p-3 border-2 transition-all duration-300
                  ${selectedDistrictId === district.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}
                  hover:shadow-md cursor-pointer
                `}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col h-full">
                        <div className="font-medium text-sm truncate">{district.name}</div>
                        <div className="mt-1 flex items-center">
                          <div 
                            className={`w-3 h-3 rounded-full ${getSeverityColor(district.severity)} mr-2`}
                          />
                          <span className="text-xs text-muted-foreground">
                            Risk: {district.riskScore}/100
                          </span>
                        </div>
                        <div className="mt-auto pt-2 text-xs flex items-center">
                          {district.gdpGrowth > 0 ? (
                            <TrendingUp size={12} className="text-green-500 mr-1" />
                          ) : (
                            <TrendingDown size={12} className="text-red-500 mr-1" />
                          )}
                          <span>
                            GDP: ${district.gdp}B
                          </span>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{district.name} District</p>
                        <p>Risk Score: {district.riskScore}/100</p>
                        <p>GDP: ${district.gdp}B</p>
                        <p>GDP Growth: {district.gdpGrowth}%</p>
                        <p>Unemployment: {district.unemploymentRate}%</p>
                        <p>Population: {district.populationMillions}M</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {/* Crisis severity indicator overlay */}
                <div 
                  className={`absolute bottom-0 left-0 right-0 h-1 ${getSeverityColor(district.severity)}`}
                />
              </div>
            ))}
          </div>
          
          {/* Background grid lines */}
          <div className="absolute inset-0 grid grid-cols-6 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-r border-slate-200 dark:border-slate-700" />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-6 pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-b border-slate-200 dark:border-slate-700" />
            ))}
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-md text-xs">
            <div className="font-medium mb-1">Crisis Level</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Low</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
