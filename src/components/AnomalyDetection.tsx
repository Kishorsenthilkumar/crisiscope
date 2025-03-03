
import React, { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { getTrendData, detectAnomalies } from '../utils/dataUtils';

export const AnomalyDetection: React.FC = () => {
  const [trendData, setTrendData] = useState<any[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load trend data and detect anomalies
    const data = getTrendData(30);
    setTrendData(data);
    setAnomalies(detectAnomalies(data));
    setIsLoading(false);
  }, []);
  
  if (isLoading) {
    return (
      <div className="crisis-card p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle size={20} className="text-crisis-high" />
            <h3 className="text-lg font-medium">Anomaly Detection</h3>
          </div>
          <div className="animate-pulse h-4 w-24 bg-secondary rounded"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-2 border-l-4 border-l-crisis-medium border-border/60 p-3">
              <div className="h-4 bg-secondary rounded w-full"></div>
              <div className="h-3 bg-secondary rounded w-3/4"></div>
              <div className="h-3 bg-secondary rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="crisis-card p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-crisis-high" />
          <h3 className="text-lg font-medium">Anomaly Detection</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {anomalies.length} detected
        </div>
      </div>
      
      {anomalies.length > 0 ? (
        <div className="space-y-3">
          {anomalies.map((anomaly, index) => (
            <div 
              key={index}
              className={`rounded-lg border-l-4 ${
                anomaly.severity === 'high' ? 'border-l-crisis-high' : 'border-l-crisis-medium'
              } border-border/60 p-3`}
            >
              <div className="flex justify-between items-start">
                <div className="font-medium">{anomaly.indicator}</div>
                <div className="flex items-center gap-1 text-crisis-high">
                  <TrendingUp size={14} />
                  <span className="text-sm">
                    {anomaly.change > 0 ? '+' : ''}{anomaly.change.toFixed(1)}
                  </span>
                </div>
              </div>
              
              <div className="text-sm mt-1">
                Significant spike detected on {anomaly.date}
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                Current value: {anomaly.value.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Info size={40} className="mb-3 opacity-50" />
          <p className="text-sm">No significant anomalies detected in the current data.</p>
        </div>
      )}
      
      <div className="mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
        Anomaly detection algorithm monitors deviations from established baselines
      </div>
    </div>
  );
};
