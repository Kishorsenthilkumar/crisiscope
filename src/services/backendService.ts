import { supabase } from '@/integrations/supabase/client';
import { twitterConfig, fredConfig, indiaDataConfig, mapboxConfig } from './apiConfig';
import { fetchAPIKeys as fetchStoredAPIKeys } from './apiKeysService';

// Interface for API keys stored on backend
export interface StoredAPIKeys {
  twitterBearerToken?: string;
  fredApiKey?: string;
  indiaDataApiKey?: string;
  mapboxToken?: string;
}

// Store API keys securely in Supabase
export const storeAPIKeys = async (keys: StoredAPIKeys): Promise<boolean> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('No authenticated user found');
    }

    // Format keys according to Supabase schema
    const apiKeys = {
      user_id: user.user.id,
      twitter_bearer_token: keys.twitterBearerToken,
      fred_api_key: keys.fredApiKey,
      india_data_api_key: keys.indiaDataApiKey,
      mapbox_token: keys.mapboxToken,
      updated_at: new Date().toISOString(),
    };

    // Check if there's an existing record
    const { data: existing } = await supabase
      .from('api_keys')
      .select('id')
      .eq('user_id', user.user.id)
      .maybeSingle();

    if (existing?.id) {
      // Update existing record
      const { error } = await supabase
        .from('api_keys')
        .update(apiKeys)
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating API keys:', error);
        return false;
      }
    } else {
      // Insert new record
      const { error } = await supabase
        .from('api_keys')
        .insert([apiKeys]);

      if (error) {
        console.error('Error inserting API keys:', error);
        return false;
      }
    }
    
    // Also update local config so the app works immediately
    if (keys.twitterBearerToken) {
      twitterConfig.bearerToken = keys.twitterBearerToken;
    }
    
    if (keys.fredApiKey) {
      fredConfig.apiKey = keys.fredApiKey;
    }
    
    if (keys.indiaDataApiKey) {
      indiaDataConfig.apiKey = keys.indiaDataApiKey;
    }
    
    if (keys.mapboxToken) {
      mapboxConfig.accessToken = keys.mapboxToken;
    }
    
    return true;
  } catch (error) {
    console.error('Error storing API keys:', error);
    return false;
  }
};

// Fetch API keys from Supabase
export const getFormattedAPIKeys = async (): Promise<StoredAPIKeys | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      console.error('No authenticated user found');
      return null;
    }
    
    const keys = await fetchStoredAPIKeys();
    
    if (!keys) {
      return null;
    }
    
    return {
      twitterBearerToken: keys.twitter_bearer_token || '',
      fredApiKey: keys.fred_api_key || '',
      indiaDataApiKey: keys.india_data_api_key || '',
      mapboxToken: keys.mapbox_token || '',
    };
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return null;
  }
};

// Utility functions for API proxying remain unchanged
export const fetchWithTwitterAuth = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
  try {
    // This would be an actual API call to your backend that uses the stored Twitter key
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
