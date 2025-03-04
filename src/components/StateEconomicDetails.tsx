
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getEconomicCrisisIndicators, getStateGDPHistory } from '../services/indiaDataService';
import { BarChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, LineChart } from 'recharts';

interface StateEconomicDetailsProps {
  stateId: string;
  stateName: string;
}

export const StateEconomicDetails: React.FC<StateEconomicDetailsProps> = ({ stateId, stateName }) => {
  const [tab, setTab] = useState('indicators');
  const indicators = getEconomicCrisisIndicators(stateId);
  const gdpHistory = getStateGDPHistory(stateId);
  
  if (!indicators) {
    return <div>No data available</div>;
  }
  
  const indicatorsData = [
    { name: 'Unemployment', value: indicators.unemploymentIndicator },
    { name: 'Poverty', value: indicators.povertyIndicator },
    { name: 'GDP Growth', value: indicators.gdpGrowthIndicator },
    { name: 'Risk Score', value: indicators.riskScore },
  ];
  
  const getIndicatorColor = (name: string, value: number) => {
    // For GDP growth, higher is better (green)
    if (name === 'GDP Growth') {
      if (value >= 70) return '#22c55e';
      if (value >= 40) return '#f59e0b';
      return '#ef4444';
    }
    
    // For others, lower is better (green)
    if (value <= 30) return '#22c55e';
    if (value <= 60) return '#f59e0b';
    return '#ef4444';
  };
  
  return (
    <div>
      <div className="mb-4">
        <div className="text-sm text-muted-foreground">Overall Economic Health</div>
        <div className="flex items-center space-x-2">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{ 
              width: '100%',
              background: 'linear-gradient(to right, #22c55e, #f59e0b, #ef4444)'
            }}
          >
          </div>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span>Stable</span>
          <span>At Risk</span>
          <span>Crisis</span>
        </div>
        <div 
          className="h-5 w-5 bg-primary rounded-full mt-[-24px] transition-all duration-300 shadow-md relative"
          style={{ 
            marginLeft: `calc(${indicators.overallIndicator}% - 10px)`,
          }}
        >
          <div className="absolute top-[-24px] left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs rounded-md px-1.5 py-0.5 whitespace-nowrap">
            {indicators.overallIndicator}%
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="indicators" className="mt-6" onValueChange={setTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="indicators">Economic Indicators</TabsTrigger>
          <TabsTrigger value="trends">GDP Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="indicators" className="pt-4">
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={indicatorsData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value) => [`${value}%`, 'Value']} />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Indicator Value"
                  isAnimationActive={true}
                  animationDuration={1000}
                  radius={[4, 4, 0, 0]}
                >
                  {indicatorsData.map((entry, index) => (
                    <rect
                      key={`rect-${index}`}
                      fill={getIndicatorColor(entry.name, entry.value)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2">
            *Lower values for Unemployment and Poverty are better, higher values for GDP Growth are better
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="pt-4">
          <div className="h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={gdpHistory}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="period" 
                  tick={{ fontSize: 10 }}
                  interval={2}
                />
                <YAxis 
                  domain={['dataMin - 10', 'dataMax + 10']}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip formatter={(value) => [`${value} Billion USD`, 'GDP']} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="gdp"
                  name={`${stateName} GDP (Billion USD)`}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={true}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-xs text-muted-foreground text-center mt-2">
            Quarterly GSDP trend for {stateName} over the past 5 years
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
