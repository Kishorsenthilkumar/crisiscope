
import { twitterConfig, isTwitterConfigured } from './apiConfig';

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
 * Fetches sentiment data from Twitter API
 * Uses mock data if API keys are not configured
 */
export const fetchTwitterSentiment = async (): Promise<TwitterSentiment[]> => {
  if (!isTwitterConfigured()) {
    console.warn('Twitter API not configured. Using mock data.');
    return Promise.resolve(mockTwitterData);
  }
  
  try {
    // This would be replaced with actual Twitter API call using the bearer token
    // For example:
    // const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=crisis', {
    //   headers: {
    //     'Authorization': `Bearer ${twitterConfig.bearerToken}`
    //   }
    // });
    // const data = await response.json();
    // Process the data and calculate sentiment...
    
    // For now, return mock data until API is configured
    return mockTwitterData;
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return mockTwitterData; // Fallback to mock data on error
  }
};
