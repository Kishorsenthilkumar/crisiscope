
import React, { useEffect } from 'react';
import { CrisisMap } from '../components/CrisisMap';
import { CrisisCard } from '../components/CrisisCard';
import { AlertPanel } from '../components/AlertPanel';
import { SentimentAnalysis } from '../components/SentimentAnalysis';
import { TrendChart } from '../components/TrendChart';
import { EconomicIndicators } from '../components/EconomicIndicators';
import { AIPredictions } from '../components/AIPredictions';
import { AnomalyDetection } from '../components/AnomalyDetection';
import { BarChart3, TrendingDown, TrendingUp, AlertCircle, Users, Globe } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

const Dashboard: React.FC = () => {
  useEffect(() => {
    // Debug information notification
    console.log("Dashboard component mounted");
    toast({
      title: "Dashboard Loaded",
      description: "The dashboard has been loaded successfully.",
    });
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Crisis Management Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CrisisCard 
          title="Global Risk Score" 
          value="68.5" 
          change={4.2} 
          status="high" 
          icon={<Globe size={16} className="text-crisis-high" />}
        />
        <CrisisCard 
          title="Economic Stability" 
          value="43.2%" 
          change={-2.8} 
          status="medium" 
          icon={<BarChart3 size={16} className="text-crisis-medium" />}
        />
        <CrisisCard 
          title="Active Alerts" 
          value="28" 
          change={12} 
          status="high" 
          icon={<AlertCircle size={16} className="text-crisis-high" />}
        />
        <CrisisCard 
          title="Population at Risk" 
          value="127.3M" 
          change={3.7} 
          status="medium" 
          icon={<Users size={16} className="text-crisis-medium" />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <div className="lg:col-span-2">
          <CrisisMap />
        </div>
        <div className="lg:col-span-1">
          <AlertPanel />
        </div>
      </div>
      
      {/* New AI & Data Analysis Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TrendChart />
        <SentimentAnalysis />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <EconomicIndicators />
        <AIPredictions />
        <AnomalyDetection />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="crisis-card p-4">
          <div className="text-lg font-medium mb-4">Regional Risk Breakdown</div>
          <div className="space-y-3">
            {[
              { region: 'Southeast Asia', risk: 78, change: 5.2, trend: 'up' },
              { region: 'Middle East', risk: 72, change: 1.8, trend: 'up' },
              { region: 'Western Europe', risk: 45, change: -2.3, trend: 'down' },
              { region: 'North America', risk: 38, change: 0.5, trend: 'up' },
              { region: 'South America', risk: 52, change: -1.2, trend: 'down' },
            ].map(item => (
              <div key={item.region} className="flex items-center justify-between">
                <div className="font-medium">{item.region}</div>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-32 h-2 rounded-full bg-secondary overflow-hidden"
                  >
                    <div 
                      className="h-full rounded-full"
                      style={{
                        width: `${item.risk}%`,
                        backgroundColor: item.risk > 70 ? '#FF4A4A' : item.risk > 50 ? '#FF9F45' : '#2EC4B6'
                      }}
                    />
                  </div>
                  <div className="w-10 flex items-center">
                    {item.trend === 'up' ? (
                      <TrendingUp size={14} className="text-crisis-high mr-1" />
                    ) : (
                      <TrendingDown size={14} className="text-crisis-low mr-1" />
                    )}
                    <span className={item.trend === 'up' ? 'text-crisis-high' : 'text-crisis-low'}>
                      {Math.abs(item.change)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="crisis-card p-4">
          <div className="text-lg font-medium mb-4">Crisis Type Distribution</div>
          <div className="flex flex-col h-full justify-center">
            {[
              { type: 'Economic', percentage: 35, color: '#3A86FF' },
              { type: 'Political', percentage: 28, color: '#FF9F45' },
              { type: 'Environmental', percentage: 22, color: '#2EC4B6' },
              { type: 'Social Unrest', percentage: 15, color: '#FF4A4A' },
            ].map(item => (
              <div key={item.type} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span>{item.type}</span>
                  <span>{item.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
