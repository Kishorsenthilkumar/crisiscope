
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame, Droplet, SunDim, AlertTriangle, MapPin, Waves, Filter, Cloud, CloudRain } from 'lucide-react';
import { DroughtPrediction, getDroughtPredictions } from '../services/predictionService';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface DroughtCrisisPredictionProps {
  stateId: string;
  districtId?: string;
}

export const DroughtCrisisPrediction: React.FC<DroughtCrisisPredictionProps> = ({ 
  stateId,
  districtId 
}) => {
  const [filter, setFilter] = useState<'all' | 'high' | 'extreme'>('all');
  const [sortBy, setSortBy] = useState<'district' | 'risk' | 'probability'>('risk');
  const [predictions, setPredictions] = useState<DroughtPrediction[]>(() => getDroughtPredictions(stateId));
  
  // Filter predictions based on selected severity and district
  const filteredPredictions = predictions
    .filter(p => {
      if (filter === 'all') return true;
      if (filter === 'high') return p.severity === 'high' || p.severity === 'extreme';
      return p.severity === 'extreme';
    })
    .filter(p => !districtId || p.districtId === districtId);
  
  // Sort predictions based on selected criteria
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    if (sortBy === 'district') return a.districtName.localeCompare(b.districtName);
    if (sortBy === 'probability') return b.probabilityPercent - a.probabilityPercent;
    // Sort by severity, then risk score
    const severityA = a.severity === 'extreme' ? 4 : a.severity === 'high' ? 3 : 
                       a.severity === 'medium' ? 2 : 1;
    const severityB = b.severity === 'extreme' ? 4 : b.severity === 'high' ? 3 : 
                       b.severity === 'medium' ? 2 : 1;
    
    if (severityA !== severityB) return severityB - severityA;
    return b.riskScore - a.riskScore;
  });
  
  // Function to get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'text-red-600 dark:text-red-400';
      case 'high': return 'text-red-500';
      case 'medium': return 'text-orange-500';
      default: return 'text-green-500';
    }
  };
  
  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-600';
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-green-500';
    }
  };
  
  // Function to get badge variant based on severity
  const getBadgeVariant = (severity: string): "default" | "destructive" | "outline" => {
    switch (severity) {
      case 'extreme': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'outline';
    }
  };
  
  // Function to refresh predictions
  const refreshPredictions = () => {
    setPredictions(getDroughtPredictions(stateId));
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Flame className="mr-2 h-5 w-5 text-red-500" />
            Drought Crisis Prediction
          </CardTitle>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-4 w-4 mr-1" />
                  {filter === 'all' ? 'All Risks' : 
                   filter === 'high' ? 'High & Extreme' : 'Extreme Only'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  All Risk Levels
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('high')}>
                  High & Extreme Risk
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('extreme')}>
                  Extreme Risk Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={refreshPredictions}
            >
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Based on climate data, satellite imagery, and historical patterns
          </div>
          <div className="flex gap-2">
            <Button 
              variant={sortBy === 'district' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSortBy('district')}
              className="h-7 text-xs"
            >
              District
            </Button>
            <Button 
              variant={sortBy === 'probability' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSortBy('probability')}
              className="h-7 text-xs"
            >
              Probability
            </Button>
            <Button 
              variant={sortBy === 'risk' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSortBy('risk')}
              className="h-7 text-xs"
            >
              Severity
            </Button>
          </div>
        </div>
        
        {sortedPredictions.length > 0 ? (
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-3">
              {sortedPredictions.map((prediction, idx) => (
                <div 
                  key={prediction.districtId}
                  className="rounded-lg border p-3 relative overflow-hidden"
                >
                  {/* Severity indicator */}
                  <div 
                    className={`absolute top-0 bottom-0 left-0 w-1 ${getSeverityBgColor(prediction.severity)}`}
                  />
                  
                  <div className="pl-2">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="font-medium">{prediction.districtName}</span>
                          <Badge 
                            variant={getBadgeVariant(prediction.severity)}
                            className="ml-2 text-xs capitalize"
                          >
                            {prediction.severity} Risk
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Projected duration: {prediction.durationMonths} months
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Probability</div>
                        <div className="font-medium text-lg">
                          {prediction.probabilityPercent}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-3">
                      <div className="col-span-7">
                        <div className="mb-2">
                          <div className="text-xs text-muted-foreground mb-1">Risk Assessment</div>
                          <div className={`relative w-full h-2 bg-secondary rounded-full overflow-hidden`}>
                            <div
                              className={`h-full ${getSeverityBgColor(prediction.severity)} transition-all`}
                              style={{ width: `${prediction.riskScore}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-1 text-xs">
                            <span>Low</span>
                            <span>Score: {prediction.riskScore}</span>
                            <span>High</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-4 mt-3">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex flex-col items-center">
                                <Droplet className="h-4 w-4 text-blue-500" />
                                <span className="text-xs mt-1">{prediction.waterReservoirLevel}%</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Water Reservoir Level</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex flex-col items-center">
                                <CloudRain className="h-4 w-4 text-blue-400" />
                                <span className="text-xs mt-1">-{prediction.rainfallDeficit}mm</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Rainfall Deficit</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex flex-col items-center">
                                <SunDim className="h-4 w-4 text-yellow-500" />
                                <span className="text-xs mt-1">{prediction.evaporationRate}mm/day</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Evaporation Rate</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger className="flex flex-col items-center">
                                <Waves className="h-4 w-4 text-green-500" />
                                <span className="text-xs mt-1">{prediction.vegetationHealthIndex}</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Vegetation Health Index</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                      
                      <div className="col-span-5 flex flex-col">
                        <div>
                          <div className="text-xs text-muted-foreground">Agriculture Impact</div>
                          <div className={`text-xs mt-1 ${
                            prediction.severity === 'extreme' || prediction.severity === 'high' 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-muted-foreground'
                          }`}>
                            {prediction.agricultureImpact}
                          </div>
                        </div>
                        
                        {(prediction.severity === 'extreme' || prediction.severity === 'high') && (
                          <div className="mt-auto">
                            <div className="flex items-center text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-800 mt-2">
                              <AlertTriangle size={12} className="mr-1 flex-shrink-0" />
                              <span>Immediate water conservation measures recommended</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <Droplet className="h-10 w-10 mb-2 opacity-20" />
            <p>No drought predictions available for the selected filters</p>
          </div>
        )}
        
        <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div>
            <span>Extreme</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
            <span>High</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
            <span>Low</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
