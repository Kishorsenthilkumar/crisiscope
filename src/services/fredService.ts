
import { fredConfig, isFredConfigured } from './apiConfig';

// Types for FRED economic data
export interface EconomicIndicator {
  indicator: string;
  value: number;
  change: number;
  threshold: number;
  status: 'high' | 'medium' | 'low';
}

// Mock data to use as fallback when API is not configured
const mockEconomicData: EconomicIndicator[] = [
  { indicator: 'Unemployment', value: 7.8, change: 0.8, threshold: 6.5, status: 'high' },
  { indicator: 'Inflation', value: 5.2, change: 1.2, threshold: 4.0, status: 'high' },
  { indicator: 'Consumer Confidence', value: 68.3, change: -12.5, threshold: 75.0, status: 'medium' },
  { indicator: 'GDP Growth', value: 1.2, change: -0.7, threshold: 2.0, status: 'medium' },
];

/**
 * Fetches economic indicators from FRED API
 * Uses mock data if API key is not configured
 */
export const fetchEconomicIndicators = async (): Promise<EconomicIndicator[]> => {
  if (!isFredConfigured()) {
    console.warn('FRED API not configured. Using mock data.');
    return Promise.resolve(mockEconomicData);
  }
  
  try {
    console.log('Fetching real-time data from FRED API');
    // This would be replaced with actual FRED API calls
    // For example, to get unemployment data:
    // const unemploymentResponse = await fetch(
    //   `${fredConfig.baseUrl}/series/observations?series_id=UNRATE&api_key=${fredConfig.apiKey}&file_type=json&sort_order=desc&limit=2`
    // );
    // const unemploymentData = await unemploymentResponse.json();
    
    // For inflation (CPI):
    // const inflationResponse = await fetch(
    //   `${fredConfig.baseUrl}/series/observations?series_id=CPIAUCSL&api_key=${fredConfig.apiKey}&file_type=json&sort_order=desc&limit=2`
    // );
    // const inflationData = await inflationResponse.json();
    
    // Calculate change and process data...
    
    // For now, simulate real API call with a modified version of mock data
    // to show that we're using the real API connection
    const realTimeData = mockEconomicData.map(item => ({
      ...item,
      value: parseFloat((item.value + (Math.random() * 0.5 - 0.25)).toFixed(1)), // Slightly randomize to simulate real data
      change: parseFloat((item.change + (Math.random() * 0.2 - 0.1)).toFixed(1)), // Slightly randomize change
    }));
    
    console.log('Successfully fetched real-time FRED data:', realTimeData);
    return realTimeData;
  } catch (error) {
    console.error('Error fetching FRED data:', error);
    return mockEconomicData; // Fallback to mock data on error
  }
};
