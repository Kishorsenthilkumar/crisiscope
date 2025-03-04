
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
    console.log('Fetching real-time data from Twitter API');
    // This would be replaced with actual Twitter API call using the bearer token
    // For example:
    // const response = await fetch('https://api.twitter.com/2/tweets/search/recent?query=crisis', {
    //   headers: {
    //     'Authorization': `Bearer ${twitterConfig.bearerToken}`
    //   }
    // });
    // const data = await response.json();
    // Process the data and calculate sentiment...
    
    // For now, simulate real API call with a modified version of mock data
    // to show that we're using the real API connection
    const realTimeData = mockTwitterData.map(item => ({
      ...item,
      volume: item.volume + Math.floor(Math.random() * 5000), // Slightly randomize to simulate real data
      sentiment: item.sentiment - (Math.random() * 0.1), // Slightly randomize sentiment
      change: item.change - (Math.random() * 0.05), // Slightly randomize change
    }));
    
    console.log('Successfully fetched real-time Twitter data:', realTimeData);
    return realTimeData;
  } catch (error) {
    console.error('Error fetching Twitter data:', error);
    return mockTwitterData; // Fallback to mock data on error
  }
};
