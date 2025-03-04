
// API configuration for external data sources

// Twitter API configuration
export const twitterConfig = {
  apiKey: process.env.TWITTER_API_KEY || '',
  apiSecret: process.env.TWITTER_API_SECRET || '',
  bearerToken: process.env.TWITTER_BEARER_TOKEN || '',
  // Default to empty strings if not provided
};

// FRED (Federal Reserve Economic Data) API configuration
export const fredConfig = {
  apiKey: process.env.FRED_API_KEY || '',
  baseUrl: 'https://api.stlouisfed.org/fred',
};

// Check if API keys are configured
export const isTwitterConfigured = () => Boolean(twitterConfig.bearerToken);
export const isFredConfigured = () => Boolean(fredConfig.apiKey);

// Helper function to set API keys at runtime
export const setAPIKeys = (keys: { 
  twitterBearerToken?: string; 
  fredApiKey?: string;
}) => {
  if (keys.twitterBearerToken) {
    // @ts-ignore - Allow runtime setting of environment variable
    twitterConfig.bearerToken = keys.twitterBearerToken;
  }
  
  if (keys.fredApiKey) {
    // @ts-ignore - Allow runtime setting of environment variable
    fredConfig.apiKey = keys.fredApiKey;
  }
};
