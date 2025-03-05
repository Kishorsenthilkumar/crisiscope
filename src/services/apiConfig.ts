
// API configuration for external sources

// Load API keys from localStorage on initialization
const loadStoredKeys = () => {
  if (typeof window !== 'undefined') {
    const storedTwitterToken = localStorage.getItem('twitter_bearer_token');
    const storedFredKey = localStorage.getItem('fred_api_key');
    const storedIndiaDataKey = localStorage.getItem('india_data_api_key');
    const storedMapboxToken = localStorage.getItem('mapbox_token');
    
    return {
      twitterToken: storedTwitterToken || '',
      fredKey: storedFredKey || '',
      indiaDataKey: storedIndiaDataKey || '',
      mapboxToken: storedMapboxToken || '',
    };
  }
  return { twitterToken: '', fredKey: '', indiaDataKey: '', mapboxToken: '' };
};

const storedKeys = loadStoredKeys();

// Twitter API configuration
export const twitterConfig = {
  apiKey: import.meta.env.VITE_TWITTER_API_KEY || '',
  apiSecret: import.meta.env.VITE_TWITTER_API_SECRET || '',
  bearerToken: storedKeys.twitterToken || import.meta.env.VITE_TWITTER_BEARER_TOKEN || '',
  // Default to empty strings if not provided
};

// FRED (Federal Reserve Economic Data) API configuration
export const fredConfig = {
  apiKey: storedKeys.fredKey || import.meta.env.VITE_FRED_API_KEY || '',
  baseUrl: 'https://api.stlouisfed.org/fred',
};

// India Economic Data API configuration (for future implementation)
export const indiaDataConfig = {
  apiKey: storedKeys.indiaDataKey || import.meta.env.VITE_INDIA_DATA_API_KEY || '',
  baseUrl: 'https://api.example.com/india-economic-data',
};

// Mapbox configuration
export const mapboxConfig = {
  accessToken: storedKeys.mapboxToken || import.meta.env.VITE_MAPBOX_TOKEN || '',
};

// Check if API keys are configured
export const isTwitterConfigured = () => Boolean(twitterConfig.bearerToken);
export const isFredConfigured = () => Boolean(fredConfig.apiKey);
export const isIndiaDataConfigured = () => Boolean(indiaDataConfig.apiKey);
export const isMapboxConfigured = () => Boolean(mapboxConfig.accessToken);

// Helper function to set API keys at runtime
export const setAPIKeys = (keys: { 
  twitterBearerToken?: string; 
  fredApiKey?: string;
  indiaDataApiKey?: string;
  mapboxToken?: string;
}) => {
  if (keys.twitterBearerToken) {
    twitterConfig.bearerToken = keys.twitterBearerToken;
    // Store in localStorage
    localStorage.setItem('twitter_bearer_token', keys.twitterBearerToken);
    console.log('Twitter Bearer Token saved:', keys.twitterBearerToken.substring(0, 3) + '...');
  }
  
  if (keys.fredApiKey) {
    fredConfig.apiKey = keys.fredApiKey;
    // Store in localStorage
    localStorage.setItem('fred_api_key', keys.fredApiKey);
    console.log('FRED API Key saved:', keys.fredApiKey.substring(0, 3) + '...');
  }
  
  if (keys.indiaDataApiKey) {
    indiaDataConfig.apiKey = keys.indiaDataApiKey;
    // Store in localStorage
    localStorage.setItem('india_data_api_key', keys.indiaDataApiKey);
    console.log('India Data API Key saved:', keys.indiaDataApiKey.substring(0, 3) + '...');
  }
  
  if (keys.mapboxToken) {
    mapboxConfig.accessToken = keys.mapboxToken;
    // Store in localStorage
    localStorage.setItem('mapbox_token', keys.mapboxToken);
    console.log('Mapbox Token saved:', keys.mapboxToken.substring(0, 3) + '...');
  }
};
