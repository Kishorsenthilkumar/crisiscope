
import { isFredConfigured } from './apiConfig';
import { fetchWithFredAuth } from './backendService';

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
 * Fetches economic indicators from FRED API via secure backend
 * Uses mock data if API key is not configured
 */
export const fetchEconomicIndicators = async (): Promise<EconomicIndicator[]> => {
  console.log('FRED API Key Status:', isFredConfigured() ? 'Configured' : 'Not Configured');
  
  if (!isFredConfigured()) {
    console.warn('FRED API not configured. Using mock data.');
    return Promise.resolve(mockEconomicData);
  }
  
  try {
    console.log('Fetching real-time data from FRED API via backend');
    
    // Use our backend proxy to fetch economic data
    // This prevents API keys from being exposed to the client
    const response = await fetchWithFredAuth('UNRATE', {
      observation_start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 90 days
      observation_end: new Date().toISOString().split('T')[0], // Today
    });
    
    if (response && response.data) {
      console.log('Successfully fetched real-time FRED data:', response.data);
      return response.data;
    }
    
    throw new Error('Invalid response from FRED API');
  } catch (error) {
    console.error('Error fetching FRED data:', error);
    return mockEconomicData; // Fallback to mock data on error
  }
};
