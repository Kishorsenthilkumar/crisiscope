
import { isTwitterConfigured } from './apiConfig';
import { fetchWithTwitterAuth } from './backendService';

// Types for Twitter data
export interface TwitterSentiment {
  platform: string;
  sentiment: number;
  volume: number;
  change: number;
}

// Mock data to use as fallback when API is not configured
const mockTwitterData: TwitterSentiment[] = [
  { platform: 'Twitter', sentiment: -0.35, volume: 45000, change: -0.12 },
  { platform: 'Twitter Trends', sentiment: -0.28, volume: 32000, change: -0.09 },
];

/**
 * Fetches sentiment data from Twitter API via secure backend
 * Uses mock data if API keys are not configured
 */
export const fetchTwitterSentiment = async (): Promise<TwitterSentiment[]> => {
  // Log the Twitter API key status for debugging
  console.log('Twitter API Key Status:', isTwitterConfigured() ? 'Configured' : 'Not Configured');
  
  if (!isTwitterConfigured()) {
    console.warn('Twitter API not configured. Using mock data.');
    return Promise.resolve(mockTwitterData);
  }
  
  try {
    console.log('Fetching real-time data from Twitter API via backend');
    
    // Use our backend proxy to fetch Twitter data
    // This prevents API keys from being exposed to the client
    const response = await fetchWithTwitterAuth('search/recent', {
      query: 'crisis OR economic OR disaster',
      max_results: '100'
    });
    
    if (response && response.data) {
      console.log('Successfully fetched real-time Twitter data:', response.data);
      return response.data;
    }
    
    throw new Error('Invalid response from Twitter API');
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return mockTwitterData; // Fallback to mock data on error
  }
};
