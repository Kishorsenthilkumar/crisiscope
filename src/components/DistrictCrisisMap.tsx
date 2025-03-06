
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, TrendingUp, TrendingDown, AlertCircle, FileText, Filter } from 'lucide-react';
import { getDistrictsByState } from '../services/indiaDataService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DistrictCrisisMapProps {
  stateId: string;
  selectedDistrictId: string | null;
}

export const DistrictCrisisMap: React.FC<DistrictCrisisMapProps> = ({ 
  stateId, 
  selectedDistrictId 
}) => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = React.useState<'name' | 'riskScore' | 'gdp'>('riskScore');
  const districts = getDistrictsByState(stateId);
  
  if (districts.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>District Crisis Report</CardTitle>
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
  
  // Sort districts based on selected criteria
  let sortedDistricts = [...processedDistricts];
  if (sortBy === 'name') {
    sortedDistricts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'riskScore') {
    sortedDistricts.sort((a, b) => b.riskScore - a.riskScore);
  } else if (sortBy === 'gdp') {
    sortedDistricts.sort((a, b) => b.gdp - a.gdp);
  }
  
  // Function to get color based on severity
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    if (severity === 'high') return 'bg-red-500';
    if (severity === 'medium') return 'bg-orange-500';
    return 'bg-green-500';
  };
  
  const getSeverityTextColor = (severity: 'high' | 'medium' | 'low') => {
    if (severity === 'high') return 'text-red-500';
    if (severity === 'medium') return 'text-orange-500';
    return 'text-green-500';
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText size={16} className="mr-2" />
            District Crisis Report
          </CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex items-center rounded-md border p-1">
              <Button 
                variant={sortBy === 'name' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSortBy('name')}
                className="text-xs h-7"
              >
                Name
              </Button>
              <Button 
                variant={sortBy === 'riskScore' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSortBy('riskScore')}
                className="text-xs h-7"
              >
                Risk
              </Button>
              <Button 
                variant={sortBy === 'gdp' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setSortBy('gdp')}
                className="text-xs h-7"
              >
                GDP
              </Button>
            </div>
            <div className="flex items-center rounded-md border p-1">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('grid')}
                className="text-xs px-2 h-7"
              >
                Grid
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setViewMode('list')}
                className="text-xs px-2 h-7"
              >
                List
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[350px] pr-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {sortedDistricts.map(district => (
                <TooltipProvider key={district.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div 
                        className={`
                          relative rounded-md p-3 border-2 transition-all duration-300 hover:shadow-md cursor-pointer
                          ${selectedDistrictId === district.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'}
                        `}
                      >
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
                        
                        {/* Crisis severity indicator overlay */}
                        <div 
                          className={`absolute bottom-0 left-0 right-0 h-1 ${getSeverityColor(district.severity)}`}
                        />
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
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground pb-2 border-b">
                <div className="col-span-4">District</div>
                <div className="col-span-2 text-right">Risk Score</div>
                <div className="col-span-2 text-right">GDP ($B)</div>
                <div className="col-span-2 text-right">Growth</div>
                <div className="col-span-2 text-right">Unemployment</div>
              </div>
              {sortedDistricts.map(district => (
                <div 
                  key={district.id}
                  className={`grid grid-cols-12 text-sm py-2 px-2 rounded-md hover:bg-accent/50 cursor-pointer transition-colors
                    ${selectedDistrictId === district.id ? 'bg-accent' : ''}
                  `}
                >
                  <div className="col-span-4 font-medium flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(district.severity)} mr-2`}></div>
                    {district.name}
                  </div>
                  <div className={`col-span-2 text-right ${getSeverityTextColor(district.severity)} font-medium`}>
                    {district.riskScore}
                  </div>
                  <div className="col-span-2 text-right">{district.gdp}</div>
                  <div className={`col-span-2 text-right ${district.gdpGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {district.gdpGrowth > 0 ? '+' : ''}{district.gdpGrowth}%
                  </div>
                  <div className="col-span-2 text-right">{district.unemploymentRate}%</div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {/* Legend for grid view */}
        {viewMode === 'grid' && (
          <div className="flex items-center justify-end mt-4 space-x-4 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span>High Risk</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-orange-500"></div>
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Low Risk</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
