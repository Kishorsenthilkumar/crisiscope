
import { isTwitterConfigured } from './apiConfig';
import { fetchWithTwitterAuth } from './backendService';

// Types for Twitter data
export interface TwitterSentiment {
  platform: string;
  sentiment: number;
  volume: number;
  change: number;
}

export interface Tweet {
  id: string;
  text: string;
  user: string;
  userHandle: string;
  timestamp: string;
  location?: string;
  hashtags: string[];
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    emotions: {
      angry: number;
      urgent: number;
      fearful: number;
    };
  };
  retweets: number;
  likes: number;
  isGeoTagged: boolean;
  district?: string;
}

export interface TwitterTrend {
  hashtag: string;
  volume: number;
  sentiment: number;
  hourlyChange: number;
  relatedTerms: string[];
}

export interface TwitterAnalysis {
  districtId: string;
  districtName: string;
  tweetVolume: number;
  sentimentScore: number;
  sentimentChange: number; 
  protestRiskScore: number;
  topHashtags: { tag: string; count: number }[];
  topEmotions: { emotion: string; intensity: number }[];
  recentTweets: Tweet[];
  trends: TwitterTrend[];
  lastUpdated: string;
}

// Mock data to use as fallback when API is not configured
const mockTwitterData: TwitterSentiment[] = [
  { platform: 'Twitter', sentiment: -0.35, volume: 45000, change: -0.12 },
  { platform: 'Twitter Trends', sentiment: -0.28, volume: 32000, change: -0.09 },
];

// Mock tweets data for demonstrations
const generateMockTweets = (district: string, count: number): Tweet[] => {
  const tweets: Tweet[] = [];
  
  const sentiments = ['positive', 'negative', 'neutral'];
  const hashtags = [
    '#Protest', '#Strike', '#RallyForChange', '#Demonstration', 
    '#CivilUnrest', '#Reform', '#Justice', '#Rights',
    '#Unemployment', '#Inflation', '#FuelPrices', '#FoodShortage'
  ];
  
  for (let i = 0; i < count; i++) {
    const sentimentType = Math.random() > 0.7 ? 'negative' : (Math.random() > 0.5 ? 'neutral' : 'positive');
    const sentimentScore = sentimentType === 'positive' 
      ? Math.random() * 0.5 + 0.5 
      : (sentimentType === 'negative' ? -1 * (Math.random() * 0.5 + 0.5) : Math.random() * 0.3 - 0.15);
    
    const isAngry = sentimentType === 'negative' && Math.random() > 0.6;
    const isUrgent = Math.random() > 0.7;
    
    // Select 1-3 random hashtags
    const tweetHashtags = [];
    const hashtagCount = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < hashtagCount; j++) {
      const tag = hashtags[Math.floor(Math.random() * hashtags.length)];
      if (!tweetHashtags.includes(tag)) {
        tweetHashtags.push(tag);
      }
    }
    
    // Create mock tweet text
    let tweetText = "";
    if (sentimentType === 'negative') {
      tweetText = `Extremely frustrated with the situation in ${district}. ${isAngry ? 'Angry at authorities for inaction!' : 'We need change now.'} ${tweetHashtags.join(' ')}`;
    } else if (sentimentType === 'positive') {
      tweetText = `Great to see progress in ${district} with the new initiatives. ${tweetHashtags.join(' ')}`;
    } else {
      tweetText = `Updates from ${district}: The situation continues to develop. ${tweetHashtags.join(' ')}`;
    }
    
    // Generate a random timestamp within the last 24 hours
    const now = new Date();
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);
    now.setHours(now.getHours() - hoursAgo);
    now.setMinutes(now.getMinutes() - minutesAgo);
    
    tweets.push({
      id: `tweet_${district}_${i}`,
      text: tweetText,
      user: `User ${Math.floor(Math.random() * 1000)}`,
      userHandle: `@user${Math.floor(Math.random() * 10000)}`,
      timestamp: now.toISOString(),
      location: Math.random() > 0.3 ? district : undefined,
      hashtags: tweetHashtags,
      sentiment: {
        score: sentimentScore,
        label: sentimentType as 'positive' | 'negative' | 'neutral',
        emotions: {
          angry: isAngry ? Math.random() * 0.5 + 0.5 : Math.random() * 0.2,
          urgent: isUrgent ? Math.random() * 0.5 + 0.5 : Math.random() * 0.2,
          fearful: sentimentType === 'negative' ? Math.random() * 0.4 : Math.random() * 0.1,
        }
      },
      retweets: Math.floor(Math.random() * 100),
      likes: Math.floor(Math.random() * 200),
      isGeoTagged: Math.random() > 0.3,
      district: Math.random() > 0.3 ? district : undefined,
    });
  }
  
  return tweets;
};

// Mock trend data
const generateMockTrends = (district: string): TwitterTrend[] => {
  const trends: TwitterTrend[] = [];
  
  const trendHashtags = [
    '#Protest', '#Strike', '#RallyForChange', '#Demonstration', 
    '#CivilUnrest', '#Reform', '#Justice', '#Rights',
    '#Unemployment', '#Inflation', '#FuelPrices', '#FoodShortage',
    `#${district}Protest`, `#${district}Strike`, `#${district}Reform`
  ];
  
  // Get 5 random hashtags
  const selectedHashtags = [...trendHashtags].sort(() => 0.5 - Math.random()).slice(0, 5);
  
  selectedHashtags.forEach(hashtag => {
    trends.push({
      hashtag,
      volume: Math.floor(Math.random() * 5000) + 500,
      sentiment: Math.random() * 2 - 1, // -1 to 1
      hourlyChange: Math.random() * 20 - 10, // -10% to +10%
      relatedTerms: trendHashtags
        .filter(tag => tag !== hashtag)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
    });
  });
  
  return trends;
};

// Generate mock district analysis data
const generateMockDistrictAnalysis = (districtId: string, districtName: string): TwitterAnalysis => {
  // Generate risk score based on districtId (for demo purposes)
  // Using the last character to determine risk level to ensure consistency
  const lastChar = districtId.charAt(districtId.length - 1);
  const baseRiskScore = parseInt(lastChar, 16) % 10; // Convert to number 0-9
  const riskScore = 30 + (baseRiskScore * 7); // Scale to 30-93
  
  // Generate sentiment score correlated with risk score
  const sentimentScore = -0.1 - (riskScore / 100); // Higher risk means more negative sentiment
  
  // Generate mock tweets
  const tweets = generateMockTweets(districtName, 10);
  
  // Generate mock trends
  const trends = generateMockTrends(districtName);
  
  // Extract top hashtags from tweets
  const hashtagCounts: Record<string, number> = {};
  tweets.forEach(tweet => {
    tweet.hashtags.forEach(tag => {
      hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
    });
  });
  
  const topHashtags = Object.entries(hashtagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  
  // Generate top emotions
  const emotions = [
    { emotion: 'Angry', intensity: 0.2 + (riskScore / 200) },
    { emotion: 'Fearful', intensity: 0.1 + (riskScore / 300) },
    { emotion: 'Urgent', intensity: 0.15 + (riskScore / 250) },
    { emotion: 'Hopeful', intensity: 0.5 - (riskScore / 200) },
    { emotion: 'Supportive', intensity: 0.4 - (riskScore / 300) }
  ];
  
  return {
    districtId,
    districtName,
    tweetVolume: Math.floor(Math.random() * 10000) + 1000,
    sentimentScore,
    sentimentChange: Math.random() * 0.4 - 0.2, // -0.2 to +0.2
    protestRiskScore: riskScore,
    topHashtags,
    topEmotions: emotions,
    recentTweets: tweets,
    trends,
    lastUpdated: new Date().toISOString()
  };
};

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

/**
 * Fetches Twitter analysis for a specific district
 * Uses mock data if API keys are not configured
 */
export const fetchDistrictTwitterAnalysis = async (
  districtId: string,
  districtName: string
): Promise<TwitterAnalysis> => {
  // Log the Twitter API key status for debugging
  console.log('Twitter API Key Status:', isTwitterConfigured() ? 'Configured' : 'Not Configured');
  
  if (!isTwitterConfigured()) {
    console.warn('Twitter API not configured. Using mock data for district analysis.');
    return Promise.resolve(generateMockDistrictAnalysis(districtId, districtName));
  }
  
  try {
    console.log(`Fetching real-time Twitter data for district ${districtId}`);
    
    // Use our backend proxy to fetch Twitter data for specific district
    const response = await fetchWithTwitterAuth('search/recent', {
      query: `place:${districtName} OR ${districtName} protest OR strike OR rally OR demonstration`,
      max_results: '100'
    });
    
    if (response && response.data) {
      console.log(`Successfully fetched real-time Twitter data for district ${districtId}:`, response.data);
      return response.data;
    }
    
    throw new Error('Invalid response from Twitter API');
  } catch (error) {
    console.error(`Error fetching Twitter data for district ${districtId}:`, error);
    return generateMockDistrictAnalysis(districtId, districtName); // Fallback to mock data on error
  }
};
