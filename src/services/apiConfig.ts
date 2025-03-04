
// API configuration for external data sources

// Twitter API configuration
export const twitterConfig = {
  apiKey: import.meta.env.VITE_TWITTER_API_KEY || '',
  apiSecret: import.meta.env.VITE_TWITTER_API_SECRET || '',
  bearerToken: import.meta.env.VITE_TWITTER_BEARER_TOKEN || '',
  // Default to empty strings if not provided
};

// FRED (Federal Reserve Economic Data) API configuration
export const fredConfig = {
  apiKey: import.meta.env.VITE_FRED_API_KEY || '',
  baseUrl: 'https://api.stlouisfed.org/fred',
};

// India Economic Data API configuration (for future implementation)
export const indiaDataConfig = {
  apiKey: import.meta.env.VITE_INDIA_DATA_API_KEY || '',
  baseUrl: 'https://api.example.com/india-economic-data',
};

// Check if API keys are configured
export const isTwitterConfigured = () => Boolean(twitterConfig.bearerToken);
export const isFredConfigured = () => Boolean(fredConfig.apiKey);
export const isIndiaDataConfigured = () => Boolean(indiaDataConfig.apiKey);

// Helper function to set API keys at runtime
export const setAPIKeys = (keys: { 
  twitterBearerToken?: string; 
  fredApiKey?: string;
  indiaDataApiKey?: string;
}) => {
  if (keys.twitterBearerToken) {
    twitterConfig.bearerToken = keys.twitterBearerToken;
  }
  
  if (keys.fredApiKey) {
    fredConfig.apiKey = keys.fredApiKey;
  }
  
  if (keys.indiaDataApiKey) {
    indiaDataConfig.apiKey = keys.indiaDataApiKey;
  }
};
