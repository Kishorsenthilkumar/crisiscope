import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, AlertTriangle, BarChart3 } from 'lucide-react';
import { TwitterMonitor } from './TwitterMonitor';

interface District {
  id: string;
  name: string;
  riskScore: number;
  econRiskLevel: 'high' | 'medium' | 'low';
  unemploymentRate: number;
  inflation: number;
  gdpGrowth: number;
  consumerConfidence: number;
}

export interface DistrictCrisisMapProps {
  stateId: string;
  selectedDistrictId: string | null;
}

export const DistrictCrisisMap: React.FC<DistrictCrisisMapProps> = ({
  stateId,
  selectedDistrictId
}) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const generateDistricts = () => {
      const districtCount = 8;
      const mockDistricts: District[] = [];
      
      for (let i = 1; i <= districtCount; i++) {
        const id = `${stateId}-${i.toString().padStart(2, '0')}`;
        const riskScore = Math.floor(Math.random() * 100);
        let riskLevel: 'high' | 'medium' | 'low';
        
        if (riskScore >= 70) riskLevel = 'high';
        else if (riskScore >= 40) riskLevel = 'medium';
        else riskLevel = 'low';
        
        mockDistricts.push({
          id,
          name: `${stateId} District ${i}`,
          riskScore,
          econRiskLevel: riskLevel,
          unemploymentRate: 4 + Math.random() * 8,
          inflation: 3 + Math.random() * 7,
          gdpGrowth: -2 + Math.random() * 6,
          consumerConfidence: 40 + Math.random() * 40
        });
      }
      
      return mockDistricts.sort((a, b) => b.riskScore - a.riskScore);
    };
    
    setDistricts(generateDistricts());
  }, [stateId]);
  
  useEffect(() => {
    if (districts.length === 0) return;
    
    if (selectedDistrictId) {
      const district = districts.find(d => d.id === selectedDistrictId);
      if (district) {
        setSelectedDistrict(district);
        return;
      }
    }
    
    setSelectedDistrict(districts[0]);
  }, [districts, selectedDistrictId]);
  
  const getRiskColorClass = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };
  
  const downloadJson = () => {
    const dataStr = JSON.stringify(districts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${stateId}_districts_data.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const downloadCsv = () => {
    const headers = ['id', 'name', 'riskScore', 'econRiskLevel', 'unemploymentRate', 'inflation', 'gdpGrowth', 'consumerConfidence'];
    let csvContent = headers.join(',') + '\n';
    
    districts.forEach(district => {
      const row = [
        district.id,
        district.name,
        district.riskScore,
        district.econRiskLevel,
        district.unemploymentRate,
        district.inflation,
        district.gdpGrowth,
        district.consumerConfidence
      ];
      csvContent += row.join(',') + '\n';
    });
    
    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
    const exportFileDefaultName = `${stateId}_districts_data.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle size={18} />
              District Crisis Report
            </CardTitle>
            
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={downloadJson} className="h-8">
                <Download size={14} className="mr-1" />
                JSON
              </Button>
              <Button size="sm" variant="outline" onClick={downloadCsv} className="h-8">
                <Download size={14} className="mr-1" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="border-b">
            <div className="grid grid-cols-4 text-xs text-muted-foreground p-2 border-b">
              <div>District Name</div>
              <div>Risk Score</div>
              <div>Risk Level</div>
              <div className="text-right">Key Indicators</div>
            </div>
            
            <div className="max-h-[240px] overflow-y-auto">
              {districts.map(district => (
                <div 
                  key={district.id}
                  className={`grid grid-cols-4 p-2 border-b text-sm cursor-pointer transition-colors hover:bg-secondary/20 ${
                    selectedDistrict?.id === district.id ? 'bg-secondary/40' : ''
                  }`}
                  onClick={() => setSelectedDistrict(district)}
                >
                  <div>{district.name}</div>
                  <div>{district.riskScore}</div>
                  <div>
                    <Badge variant={district.econRiskLevel === 'high' ? 'high' : (district.econRiskLevel === 'medium' ? 'medium' : 'low')}>
                      {district.econRiskLevel === 'high' ? 'High' : 
                       district.econRiskLevel === 'medium' ? 'Medium' : 'Low'} Risk
                    </Badge>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">Unemp.</div>
                      <div className={district.unemploymentRate > 8 ? 'text-red-500' : 'text-foreground'}>
                        {district.unemploymentRate.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">Infl.</div>
                      <div className={district.inflation > 6 ? 'text-red-500' : 'text-foreground'}>
                        {district.inflation.toFixed(1)}%
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="text-xs text-muted-foreground">GDP</div>
                      <div className={district.gdpGrowth < 0 ? 'text-red-500' : 'text-green-500'}>
                        {district.gdpGrowth > 0 ? '+' : ''}{district.gdpGrowth.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {selectedDistrict && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-secondary/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Overall Risk Score</div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{selectedDistrict.riskScore}</div>
                    <Badge variant={selectedDistrict.econRiskLevel === 'high' ? 'high' : (selectedDistrict.econRiskLevel === 'medium' ? 'medium' : 'low')}>
                      {selectedDistrict.econRiskLevel === 'high' ? 'High' : 
                       selectedDistrict.econRiskLevel === 'medium' ? 'Medium' : 'Low'} Risk
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Unemployment Rate</div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{selectedDistrict.unemploymentRate.toFixed(1)}%</div>
                    <Badge variant={selectedDistrict.unemploymentRate > 8 ? 'negative' : (selectedDistrict.unemploymentRate > 5 ? 'neutral' : 'positive')}>
                      {selectedDistrict.unemploymentRate > 8 ? 'High' : 
                       selectedDistrict.unemploymentRate > 5 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">Inflation Rate</div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{selectedDistrict.inflation.toFixed(1)}%</div>
                    <Badge variant={selectedDistrict.inflation > 6 ? 'negative' : (selectedDistrict.inflation > 4 ? 'neutral' : 'positive')}>
                      {selectedDistrict.inflation > 6 ? 'High' : 
                       selectedDistrict.inflation > 4 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-secondary/30 rounded-lg p-3">
                  <div className="text-xs text-muted-foreground mb-1">GDP Growth</div>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {selectedDistrict.gdpGrowth > 0 ? '+' : ''}{selectedDistrict.gdpGrowth.toFixed(1)}%
                    </div>
                    <Badge variant={selectedDistrict.gdpGrowth < 0 ? 'negative' : (selectedDistrict.gdpGrowth < 2 ? 'neutral' : 'positive')}>
                      {selectedDistrict.gdpGrowth < 0 ? 'Contraction' : 
                       selectedDistrict.gdpGrowth < 2 ? 'Slow' : 'Growth'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <TwitterMonitor 
                  districtId={selectedDistrict.id}
                  districtName={selectedDistrict.name}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
