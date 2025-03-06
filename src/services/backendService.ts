
import { twitterConfig, fredConfig, indiaDataConfig, mapboxConfig } from './apiConfig';

const API_BASE_URL = 'https://your-backend-api.com'; // Replace with your actual backend URL

// Interface for API keys stored on backend
export interface StoredAPIKeys {
  twitterBearerToken?: string;
  fredApiKey?: string;
  indiaDataApiKey?: string;
  mapboxToken?: string;
}

// Store API keys securely on the backend
export const storeAPIKeys = async (
  userId: string,
  keys: StoredAPIKeys
): Promise<boolean> => {
  try {
    console.log('Storing API keys to backend for user:', userId);
    
    // This would be an actual API call to your backend
    // const response = await fetch(`${API_BASE_URL}/api/store-keys`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${userAccessToken}` // For user authentication
    //   },
    //   body: JSON.stringify({
    //     userId,
    //     keys
    //   })
    // });
    // const data = await response.json();
    // return data.success;
    
    // For now, we'll simulate a successful API call
    // In a real implementation, remove this and uncomment the above code
    console.log('Keys that would be sent to backend:', keys);
    
    // Also update local config so the app works while we transition to backend
    if (keys.twitterBearerToken) {
      twitterConfig.bearerToken = keys.twitterBearerToken;
      localStorage.setItem('twitter_bearer_token', keys.twitterBearerToken);
    }
    
    if (keys.fredApiKey) {
      fredConfig.apiKey = keys.fredApiKey;
      localStorage.setItem('fred_api_key', keys.fredApiKey);
    }
    
    if (keys.indiaDataApiKey) {
      indiaDataConfig.apiKey = keys.indiaDataApiKey;
      localStorage.setItem('india_data_api_key', keys.indiaDataApiKey);
    }
    
    if (keys.mapboxToken) {
      mapboxConfig.accessToken = keys.mapboxToken;
      localStorage.setItem('mapbox_token', keys.mapboxToken);
    }
    
    return true;
  } catch (error) {
    console.error('Error storing API keys:', error);
    return false;
  }
};

// Fetch API keys from the backend
export const fetchAPIKeys = async (userId: string): Promise<StoredAPIKeys | null> => {
  try {
    console.log('Fetching API keys from backend for user:', userId);
    
    // This would be an actual API call to your backend
    // const response = await fetch(`${API_BASE_URL}/api/get-keys/${userId}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${userAccessToken}` // For user authentication
    //   }
    // });
    // const data = await response.json();
    // return data.keys;
    
    // For now, we'll simulate fetching keys from localStorage as a fallback
    // In a real implementation, remove this and uncomment the above code
    return {
      twitterBearerToken: localStorage.getItem('twitter_bearer_token') || '',
      fredApiKey: localStorage.getItem('fred_api_key') || '',
      indiaDataApiKey: localStorage.getItem('india_data_api_key') || '',
      mapboxToken: localStorage.getItem('mapbox_token') || '',
    };
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return null;
  }
};

// Utility functions to securely use API keys without exposing them to frontend
export const fetchWithTwitterAuth = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
  try {
    // This would be an actual API call to your backend that uses the stored Twitter key
    // const response = await fetch(`${API_BASE_URL}/api/twitter-proxy?endpoint=${encodeURIComponent(endpoint)}&${new URLSearchParams(params)}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${userAccessToken}` // For user authentication
    //   }
    // });
    // return await response.json();
    
    // For testing, we'll return mock data
    return {
      data: [
        { platform: 'Twitter', sentiment: -0.32, volume: 48500, change: -0.10 },
        { platform: 'Twitter Trends', sentiment: -0.25, volume: 35000, change: -0.07 },
      ]
    };
  } catch (error) {
    console.error('Error using Twitter API:', error);
    throw error;
  }
};

export const fetchWithFredAuth = async (seriesId: string, params: Record<string, string> = {}): Promise<any> => {
  try {
    // This would be an actual API call to your backend that uses the stored FRED key
    // const response = await fetch(`${API_BASE_URL}/api/fred-proxy?seriesId=${encodeURIComponent(seriesId)}&${new URLSearchParams(params)}`, {
    //   method: 'GET',
    //   headers: {
    //     'Authorization': `Bearer ${userAccessToken}` // For user authentication
    //   }
    // });
    // return await response.json();
    
    // For testing, we'll return mock data
    return {
      data: [
        { indicator: 'Unemployment', value: 7.9, change: 0.9, threshold: 6.5, status: 'high' },
        { indicator: 'Inflation', value: 5.3, change: 1.3, threshold: 4.0, status: 'high' },
        { indicator: 'Consumer Confidence', value: 67.5, change: -13.0, threshold: 75.0, status: 'medium' },
        { indicator: 'GDP Growth', value: 1.1, change: -0.8, threshold: 2.0, status: 'medium' },
      ]
    };
  } catch (error) {
    console.error('Error using FRED API:', error);
    throw error;
  }
};

// Generate a random user ID for demo purposes
// In a real app, this would come from authentication
export const getUserId = (): string => {
  // Check if we already have a user ID in localStorage
  let userId = localStorage.getItem('demo_user_id');
  
  // If not, create one and store it
  if (!userId) {
    userId = `user_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('demo_user_id', userId);
  }
  
  return userId;
};
