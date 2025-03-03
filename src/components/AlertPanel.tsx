
import React from 'react';
import { AlertTriangle, TrendingUp, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface Alert {
  id: string;
  region: string;
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
}

export const AlertPanel: React.FC = () => {
  // Mock data for alerts
  const alerts: Alert[] = [
    {
      id: '1',
      region: 'Southeast Asia',
      type: 'Economic Crisis',
      severity: 'high',
      message: 'Currency devaluation detected with 15% drop in last 24 hours',
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      region: 'North America',
      type: 'Market Volatility',
      severity: 'medium',
      message: 'Unusual trading patterns detected in technology sector',
      timestamp: '15 minutes ago'
    },
    {
      id: '3',
      region: 'Europe',
      type: 'Political Instability',
      severity: 'medium',
      message: 'Rising social unrest with protests in major cities',
      timestamp: '1 hour ago'
    },
    {
      id: '4',
      region: 'Middle East',
      type: 'Resource Scarcity',
      severity: 'low',
      message: 'Potential water shortages predicted in coming weeks',
      timestamp: '3 hours ago'
    }
  ];
  
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'border-crisis-high';
      case 'medium': return 'border-crisis-medium';
      case 'low': return 'border-crisis-low';
      default: return 'border-crisis-low';
    }
  };
  
  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    const iconClass = {
      high: 'text-crisis-high',
      medium: 'text-crisis-medium',
      low: 'text-crisis-low'
    }[severity];
    
    return <AlertTriangle size={18} className={iconClass} />;
  };
  
  return (
    <div className="w-full h-full bg-card/80 backdrop-blur-md border border-border/60 rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 border-b border-border/60 flex justify-between items-center">
        <div className="text-lg font-medium">Recent Alerts</div>
        <button className="text-sm text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className={`p-4 border-l-4 ${getSeverityColor(alert.severity)} border-b border-border/60 hover:bg-secondary/20 transition-colors cursor-pointer animate-slide-in`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {getSeverityIcon(alert.severity)}
                <span className="font-medium">{alert.type}</span>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar size={12} />
                <span>{alert.timestamp}</span>
              </div>
            </div>
            
            <p className="mt-2 text-sm">{alert.message}</p>
            
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <MapPin size={12} />
              <span>{alert.region}</span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-border/60 bg-secondary/20">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">AI Prediction</span>
          <div className="flex items-center gap-1 text-crisis-high text-sm">
            <TrendingUp size={14} />
            <span>Increasing risk in Southeast Asia</span>
          </div>
        </div>
      </div>
    </div>
  );
};
