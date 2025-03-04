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
import { isTwitterConfigured, isFredConfigured, isIndiaDataConfigured } from '../services/apiConfig';

const Dashboard: React.FC = () => {
  useEffect(() => {
    // Check API configuration status
    console.log("Dashboard component mounted");
    
    // Dashboard loaded notification
    toast({
      title: "Dashboard Loaded",
      description: "The dashboard has been loaded successfully.",
    });
    
    // API status notifications
    if (isTwitterConfigured()) {
      toast({
        title: "Twitter API Connected",
        description: "Using real-time Twitter data for sentiment analysis.",
        duration: 5000,
      });
      console.log("Twitter API is configured and using real data");
    } else {
      toast({
        title: "Twitter API Not Connected",
        description: "Using mock Twitter data. Configure API keys on the home page.",
        variant: "destructive",
        duration: 5000,
      });
    }
    
    if (isFredConfigured()) {
      toast({
        title: "FRED API Connected",
        description: "Using real-time economic indicators from FRED.",
        duration: 5000,
      });
      console.log("FRED API is configured and using real data");
    } else {
      toast({
        title: "FRED API Not Connected",
        description: "Using mock economic data. Configure API keys on the home page.",
        variant: "destructive",
        duration: 5000,
      });
    }
    
    if (isIndiaDataConfigured()) {
      toast({
        title: "India Data API Connected",
        description: "Using real-time economic data for India.",
        duration: 5000,
      });
      console.log("India Data API is configured and using real data");
    }
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
      
      {/* API Status Indicators */}
      <div className="flex flex-wrap gap-3 mb-2">
        <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${isTwitterConfigured() ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isTwitterConfigured() ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          Twitter API: {isTwitterConfigured() ? 'Connected' : 'Using Mock Data'}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${isFredConfigured() ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isFredConfigured() ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          FRED API: {isFredConfigured() ? 'Connected' : 'Using Mock Data'}
        </div>
        <div className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${isIndiaDataConfigured() ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'}`}>
          <div className={`w-2 h-2 rounded-full ${isIndiaDataConfigured() ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          India Data API: {isIndiaDataConfigured() ? 'Connected' : 'Not Configured'}
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
