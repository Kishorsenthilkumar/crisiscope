
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Wheat, TrendingUp, TrendingDown, AlertCircle, Droplet, Thermometer, Sprout, Filter, Loader2 } from 'lucide-react';
import { CropYieldPrediction, getCropYieldPredictions } from '../services/predictionService';
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";

interface CropYieldPredictionProps {
  stateId: string;
  districtId?: string;
}

export const CropYieldPredictionComponent: React.FC<CropYieldPredictionProps> = ({ 
  stateId,
  districtId 
}) => {
  const [selectedCropType, setSelectedCropType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'district' | 'yield' | 'risk'>('risk');
  const [predictions, setPredictions] = useState<CropYieldPrediction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load predictions on component mount or when stateId changes
  useEffect(() => {
    loadPredictions();
  }, [stateId]);
  
  // Function to load predictions
  const loadPredictions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getCropYieldPredictions(stateId);
      setPredictions(data);
    } catch (err) {
      console.error('Error loading crop yield predictions:', err);
      setError('Failed to load predictions. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load crop yield predictions.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Filter predictions based on selected crop type and district
  const filteredPredictions = predictions
    .filter(p => selectedCropType === 'all' || p.cropType === selectedCropType)
    .filter(p => !districtId || p.districtId === districtId);
  
  // Sort predictions based on selected criteria
  const sortedPredictions = [...filteredPredictions].sort((a, b) => {
    if (sortBy === 'district') return a.districtName.localeCompare(b.districtName);
    if (sortBy === 'yield') return b.yieldChangePercent - a.yieldChangePercent;
    return (b.riskLevel === 'high' ? 3 : b.riskLevel === 'medium' ? 2 : 1) - 
           (a.riskLevel === 'high' ? 3 : a.riskLevel === 'medium' ? 2 : 1);
  });
  
  // Get the unique crop types in the predictions
  const availableCropTypes = Array.from(new Set(predictions.map(p => p.cropType)));
  
  // Function to get risk color
  const getRiskColor = (riskLevel: 'low' | 'medium' | 'high') => {
    if (riskLevel === 'high') return 'text-red-500';
    if (riskLevel === 'medium') return 'text-orange-500';
    return 'text-green-500';
  };
  
  // Function to get yield change icon and color
  const getYieldChangeDisplay = (yieldChange: number) => {
    if (yieldChange > 0) {
      return { 
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
        color: 'text-green-500',
        label: `+${yieldChange.toFixed(1)}%`
      };
    } else if (yieldChange < 0) {
      return { 
        icon: <TrendingDown className="h-4 w-4 text-red-500" />,
        color: 'text-red-500',
        label: `${yieldChange.toFixed(1)}%`
      };
    } else {
      return { 
        icon: null,
        color: 'text-gray-500',
        label: '0%'
      };
    }
  };
  
  // Function to get crop icon
  const getCropIcon = (cropType: string) => {
    switch(cropType) {
      case 'wheat': return <Wheat className="h-4 w-4" />;
      case 'rice': return <Sprout className="h-4 w-4" />;
      case 'corn': return <Sprout className="h-4 w-4 rotate-45" />;
      default: return <Sprout className="h-4 w-4" />;
    }
  };
  
  // Function to refresh predictions
  const refreshPredictions = () => {
    loadPredictions();
    toast({
      title: "Refreshing data",
      description: "Getting latest crop yield predictions..."
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Wheat className="mr-2 h-5 w-5" />
            Crop Yield Prediction
          </CardTitle>
          <div className="flex space-x-2">
            <Tabs defaultValue="all" onValueChange={setSelectedCropType}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs px-2 h-6">All Crops</TabsTrigger>
                {availableCropTypes.map(type => (
                  <TabsTrigger key={type} value={type} className="text-xs px-2 h-6 capitalize">
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8"
              onClick={refreshPredictions}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-muted-foreground">
            Based on satellite data, IoT sensors, weather patterns
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
              variant={sortBy === 'yield' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSortBy('yield')}
              className="h-7 text-xs"
            >
              Yield
            </Button>
            <Button 
              variant={sortBy === 'risk' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSortBy('risk')}
              className="h-7 text-xs"
            >
              Risk
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[350px]">
            <Loader2 className="h-10 w-10 mb-4 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading crop yield predictions...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <AlertCircle className="h-10 w-10 mb-2 text-red-500" />
            <p className="text-red-500">{error}</p>
            <Button 
              variant="outline"
              size="sm"
              onClick={refreshPredictions}
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : sortedPredictions.length > 0 ? (
          <ScrollArea className="h-[350px] pr-4">
            <div className="space-y-3">
              {sortedPredictions.map((prediction, idx) => {
                const yieldChange = getYieldChangeDisplay(prediction.yieldChangePercent);
                
                return (
                  <div 
                    key={`${prediction.districtId}-${prediction.cropType}`}
                    className="rounded-lg border p-3 relative overflow-hidden"
                  >
                    {/* Risk level indicator */}
                    <div 
                      className={`absolute top-0 bottom-0 left-0 w-1 ${
                        prediction.riskLevel === 'high' ? 'bg-red-500' : 
                        prediction.riskLevel === 'medium' ? 'bg-orange-500' : 
                        'bg-green-500'
                      }`}
                    />
                    
                    <div className="grid grid-cols-12 gap-4">
                      <div className="col-span-7">
                        <div className="flex items-center mb-1">
                          {getCropIcon(prediction.cropType)}
                          <span className="font-medium ml-1 capitalize">{prediction.cropType}</span>
                          <Badge 
                            variant={prediction.riskLevel === 'high' ? 'destructive' : 'outline'} 
                            className="ml-2 text-xs"
                          >
                            {prediction.riskLevel === 'high' ? 'High Risk' : 
                             prediction.riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk'}
                          </Badge>
                        </div>
                        
                        <div className="text-sm">{prediction.districtName}</div>
                        
                        <div className="flex items-center mt-2 text-sm text-muted-foreground">
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center mr-3">
                                <Thermometer size={12} className="mr-1" />
                                {prediction.factors.temperature}°C
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Average Temperature</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center mr-3">
                                <Droplet size={12} className="mr-1" />
                                {prediction.factors.rainfall}mm
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Rainfall</p>
                            </TooltipContent>
                          </Tooltip>
                          
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                <div className="w-2 h-2 bg-yellow-700 rounded-full mr-1" />
                                {prediction.factors.soilMoisture}%
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Soil Moisture</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      
                      <div className="col-span-5">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-xs text-muted-foreground">Current Yield</div>
                            <div className="font-medium">{prediction.currentYield} t/ha</div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">Predicted</div>
                            <div className="font-medium">{prediction.predictedYield} t/ha</div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span>Predicted Change</span>
                            <span className={`flex items-center ${yieldChange.color}`}>
                              {yieldChange.icon}
                              <span className="ml-1">{yieldChange.label}</span>
                            </span>
                          </div>
                          
                          <Progress 
                            value={prediction.confidence} 
                            className="h-2" 
                          />
                          <div className="flex justify-end mt-1">
                            <span className="text-xs text-muted-foreground">
                              {prediction.confidence}% confidence
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {prediction.riskLevel === 'high' && prediction.yieldChangePercent < -15 && (
                      <div className="mt-2 text-xs flex items-center bg-red-50 dark:bg-red-900/20 p-2 rounded border border-red-100 dark:border-red-800">
                        <AlertCircle size={12} className="text-red-500 mr-1 flex-shrink-0" />
                        <span className="text-red-700 dark:text-red-400">
                          Alert: Significant yield drop predicted. Consider irrigation adjustments and drought-resistant varieties.
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
            <Wheat className="h-10 w-10 mb-2 opacity-20" />
            <p>No crop yield predictions available for the selected filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
