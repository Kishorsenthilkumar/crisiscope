
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StateMap } from '../components/StateMap';
import { StateEconomicDetails } from '../components/StateEconomicDetails';
import { DistrictList } from '../components/DistrictList';
import { getIndiaStatesData, IndiaStateData } from '../services/indiaDataService';
import { StateSummaryCards } from '../components/StateSummaryCards';

const IndiaMap: React.FC = () => {
  const [selectedState, setSelectedState] = useState<IndiaStateData | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
  
  const handleStateSelect = (stateId: string) => {
    const states = getIndiaStatesData();
    const state = states.find(s => s.id === stateId);
    setSelectedState(state || null);
    setSelectedDistrictId(null);
  };
  
  const handleDistrictSelect = (districtId: string) => {
    setSelectedDistrictId(districtId);
  };
  
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">India Economic Map</h1>
      <p className="text-muted-foreground">
        Explore economic data across Indian states and districts. Click on a state to view detailed information.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>
                {selectedState ? `${selectedState.name} State Map` : 'India State Map'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <StateMap 
                selectedStateId={selectedState?.id} 
                onStateSelect={handleStateSelect} 
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col space-y-6">
          {selectedState ? (
            <>
              <StateSummaryCards state={selectedState} />
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Economic Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <StateEconomicDetails 
                    stateId={selectedState.id} 
                    stateName={selectedState.name}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Districts</CardTitle>
                </CardHeader>
                <CardContent>
                  <DistrictList 
                    stateId={selectedState.id} 
                    selectedDistrictId={selectedDistrictId}
                    onDistrictSelect={handleDistrictSelect}
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>India Economic Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Click on a state in the map to view detailed economic indicators and district information.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">GDP (2023)</h3>
                    <p className="text-2xl font-bold">$3.3 Trillion</p>
                  </div>
                  <div>
                    <h3 className="font-medium">GDP Growth Rate</h3>
                    <p className="text-2xl font-bold">7.2%</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Unemployment Rate</h3>
                    <p className="text-2xl font-bold">8.1%</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Top Performing States</h3>
                    <ul className="list-disc pl-5 mt-2">
                      <li>Maharashtra (GDP: $422.4B)</li>
                      <li>Tamil Nadu (GDP: $254.3B)</li>
                      <li>Gujarat (GDP: $222.8B)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default IndiaMap;
