
// Utility functions for data processing and analysis
import { fetchTwitterSentiment, TwitterSentiment } from '../services/twitterService';
import { fetchEconomicIndicators, EconomicIndicator } from '../services/fredService';

// Cache for API responses
let sentimentCache: TwitterSentiment[] | null = null;
let economicCache: EconomicIndicator[] | null = null;

// Simulated sentiment analysis scores from social media
export const getSentimentData = async () => {
  if (!sentimentCache) {
    const twitterData = await fetchTwitterSentiment();
    
    // Combine Twitter data with other platforms
    sentimentCache = [
      ...twitterData,
      { platform: 'Reddit', sentiment: -0.22, volume: 28000, change: -0.05 },
      { platform: 'News Media', sentiment: -0.18, volume: 12000, change: 0.03 },
      { platform: 'Facebook', sentiment: -0.28, volume: 36000, change: -0.08 },
    ];
  }
  return sentimentCache;
};

// Economic indicators data from FRED API
export const getEconomicIndicators = async () => {
  if (!economicCache) {
    economicCache = await fetchEconomicIndicators();
  }
  return economicCache;
};

// Generate trend data for crisis indicators
export const getTrendData = (days = 30) => {
  const result = [];
  
  // Base values for different indicators
  const indicators = [
    { name: 'Risk Score', base: 50, volatility: 15, trend: 0.8 },
    { name: 'Economic Stress', base: 45, volatility: 10, trend: 0.5 },
    { name: 'Social Unrest', base: 30, volatility: 20, trend: 1.2 },
    { name: 'Resource Scarcity', base: 25, volatility: 8, trend: 0.3 },
  ];
  
  // Generate daily data points
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const dataPoint: any = {
      date: date.toISOString().split('T')[0],
    };
    
    // Calculate values for each indicator
    indicators.forEach(indicator => {
      // Add some randomness but maintain the trend
      const randomFactor = Math.random() * indicator.volatility - (indicator.volatility / 2);
      const trendFactor = (days - i) * (indicator.trend / 10);
      
      dataPoint[indicator.name] = Math.max(
        0, 
        Math.min(
          100, 
          indicator.base + randomFactor + trendFactor
        )
      );
    });
    
    result.push(dataPoint);
  }
  
  return result;
};

// Anomaly detection (simplified mock implementation)
export const detectAnomalies = (data: any[]) => {
  if (!data || data.length === 0) return [];
  
  // Just a simple example - in real life this would use more sophisticated algorithms
  const anomalies = [];
  const latestData = data[data.length - 1];
  
  // Check for significant spikes in the latest data point
  Object.keys(latestData).forEach(key => {
    if (key === 'date') return;
    
    const previousValue = data[data.length - 2][key];
    const currentValue = latestData[key];
    
    // If there's a significant change, mark it as an anomaly
    if (Math.abs(currentValue - previousValue) > 8) {
      anomalies.push({
        indicator: key,
        value: currentValue,
        change: currentValue - previousValue,
        date: latestData.date,
        severity: Math.abs(currentValue - previousValue) > 12 ? 'high' : 'medium'
      });
    }
  });
  
  return anomalies;
};

// AI prediction model (simplified mock)
export const getPredictions = () => {
  return [
    { region: 'Southeast Asia', indicator: 'Economic Crisis', probability: 0.78, timeframe: '2-4 weeks', factors: ['currency devaluation', 'trade disputes', 'inflation'] },
    { region: 'North Africa', indicator: 'Resource Scarcity', probability: 0.65, timeframe: '1-2 months', factors: ['drought conditions', 'supply chain disruption'] },
    { region: 'Eastern Europe', indicator: 'Social Unrest', probability: 0.72, timeframe: '3-5 weeks', factors: ['unemployment spike', 'political tension', 'inflation'] },
  ];
};
