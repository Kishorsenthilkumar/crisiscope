
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, ShoppingCart, BarChart, Users } from 'lucide-react';
import { getEconomicIndicators } from '../utils/dataUtils';

export const EconomicIndicators: React.FC = () => {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEconomicIndicators();
        setIndicators(data);
      } catch (error) {
        console.error('Error fetching economic indicators:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const getIndicatorIcon = (indicator: string) => {
    switch (indicator.toLowerCase()) {
      case 'unemployment': return <Users size={16} />;
      case 'inflation': return <Percent size={16} />;
      case 'consumer confidence': return <ShoppingCart size={16} />;
      case 'gdp growth': return <BarChart size={16} />;
      default: return <DollarSign size={16} />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high': return 'bg-crisis-high';
      case 'medium': return 'bg-crisis-medium';
      case 'low': return 'bg-crisis-low';
      default: return 'bg-crisis-low';
    }
  };
  
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} className="mr-1" />;
    return <TrendingDown size={16} className="mr-1" />;
  };
  
  const getTrendClass = (name: string, change: number) => {
    // For indicators where higher is worse (unemployment, inflation)
    if (['Unemployment', 'Inflation'].includes(name)) {
      return change > 0 ? 'text-crisis-high' : 'text-crisis-low';
    } 
    // For indicators where lower is worse (consumer confidence, GDP)
    return change < 0 ? 'text-crisis-high' : 'text-crisis-low';
  };
  
  if (isLoading) {
    return (
      <div className="crisis-card p-4">
        <div className="text-lg font-medium mb-4">Economic Indicators</div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="h-4 bg-secondary rounded w-full"></div>
              <div className="h-2 bg-secondary rounded w-full"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-secondary rounded w-1/4"></div>
                <div className="h-3 bg-secondary rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="crisis-card p-4">
      <div className="text-lg font-medium mb-4">Economic Indicators</div>
      <div className="space-y-4">
        {indicators.map(indicator => (
          <div key={indicator.indicator} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getIndicatorIcon(indicator.indicator)}
                <span className="font-medium text-sm">{indicator.indicator}</span>
              </div>
              <div className={`flex items-center ${getTrendClass(indicator.indicator, indicator.change)}`}>
                {getTrendIcon(indicator.change)}
                <span>{Math.abs(indicator.change).toFixed(1)}%</span>
              </div>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getStatusColor(indicator.status)}`}
                style={{ width: `${(indicator.value / (indicator.threshold * 2)) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Current: {indicator.value.toFixed(1)}</span>
              <span className="text-muted-foreground">Threshold: {indicator.threshold.toFixed(1)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-border text-sm text-muted-foreground">
        <div>Data sources: FRED API, Central Bank, Labor Bureau</div>
      </div>
    </div>
  );
};
