
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, Smile, Frown, Meh, AlertTriangle, 
  TrendingUp, Twitter, Hash, Map, MessageCircle, 
  RefreshCw, Filter, Search, User, Repeat
} from 'lucide-react';
import { 
  fetchDistrictTwitterAnalysis, 
  TwitterAnalysis,
  Tweet
} from '../services/twitterService';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface TwitterMonitorProps {
  districtId: string;
  districtName: string;
}

export const TwitterMonitor: React.FC<TwitterMonitorProps> = ({ 
  districtId,
  districtName
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [analysis, setAnalysis] = useState<TwitterAnalysis | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTweets, setFilteredTweets] = useState<Tweet[]>([]);
  
  // Fetch Twitter data for the district
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDistrictTwitterAnalysis(districtId, districtName);
        setAnalysis(data);
        setFilteredTweets(data.recentTweets);
      } catch (error) {
        console.error('Error fetching Twitter analysis:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [districtId, districtName]);
  
  // Handle search query changes
  useEffect(() => {
    if (!analysis) return;
    
    if (!searchQuery.trim()) {
      setFilteredTweets(analysis.recentTweets);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = analysis.recentTweets.filter(tweet => 
      tweet.text.toLowerCase().includes(query) || 
      tweet.user.toLowerCase().includes(query) ||
      tweet.userHandle.toLowerCase().includes(query) ||
      tweet.hashtags.some(tag => tag.toLowerCase().includes(query))
    );
    
    setFilteredTweets(filtered);
  }, [searchQuery, analysis]);
  
  // Helper to get sentiment badge color
  const getSentimentBadge = (sentiment: number) => {
    if (sentiment > 0.2) return 'positive';
    if (sentiment < -0.2) return 'negative';
    return 'neutral';
  };
  
  // Helper to get risk level badge
  const getRiskBadge = (score: number) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };
  
  // Format date for display
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };
  
  // Get sentiment icon
  const getSentimentIcon = (sentiment: number) => {
    if (sentiment > 0.2) return <Smile className="text-green-500" size={16} />;
    if (sentiment < -0.2) return <Frown className="text-red-500" size={16} />;
    return <Meh className="text-yellow-500" size={16} />;
  };
  
  // Refresh data
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDistrictTwitterAnalysis(districtId, districtName);
      setAnalysis(data);
      setFilteredTweets(data.recentTweets);
    } catch (error) {
      console.error('Error refreshing Twitter analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading && !analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter size={18} />
            Twitter Monitor
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <RefreshCw className="animate-spin mb-2" />
            <p>Loading Twitter data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Twitter size={18} />
            Twitter Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            No Twitter data available for this district.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Twitter size={18} />
            Twitter Monitor: {districtName}
          </CardTitle>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin mr-2" : "mr-2"} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="overview" onValueChange={setActiveTab} value={activeTab}>
        <div className="px-6 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="overview" className="flex-1">
              <BarChart size={14} className="mr-1" /> Overview
            </TabsTrigger>
            <TabsTrigger value="tweets" className="flex-1">
              <MessageCircle size={14} className="mr-1" /> Tweets
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex-1">
              <TrendingUp size={14} className="mr-1" /> Trends
            </TabsTrigger>
            <TabsTrigger value="map" className="flex-1">
              <Map size={14} className="mr-1" /> Risk Map
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="p-0">
          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="p-6 mt-0 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Protest Risk Score */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Protest Risk Score</div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-3xl font-bold">{analysis.protestRiskScore}</div>
                  <Badge variant={getRiskBadge(analysis.protestRiskScore)}>
                    {analysis.protestRiskScore >= 70 ? 'High Risk' : 
                     analysis.protestRiskScore >= 40 ? 'Medium Risk' : 'Low Risk'}
                  </Badge>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 mb-2">
                  <div 
                    className={`h-full rounded-full ${
                      analysis.protestRiskScore >= 70 ? 'bg-red-500' : 
                      analysis.protestRiskScore >= 40 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${analysis.protestRiskScore}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground flex justify-between">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>
              
              {/* Tweet Volume */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Tweet Volume</div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-3xl font-bold">{analysis.tweetVolume.toLocaleString()}</div>
                  <TrendingUp 
                    size={24} 
                    className={analysis.sentimentChange > 0 ? "text-red-500" : "text-green-500"}
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  Last 24 hours
                </div>
              </div>
              
              {/* Sentiment */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-1">Overall Sentiment</div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-3xl font-bold">{analysis.sentimentScore.toFixed(2)}</div>
                  <Badge variant={getSentimentBadge(analysis.sentimentScore)}>
                    {analysis.sentimentScore > 0.2 ? 'Positive' : 
                     analysis.sentimentScore < -0.2 ? 'Negative' : 'Neutral'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {getSentimentIcon(analysis.sentimentScore)}
                  <span className={`${
                    analysis.sentimentChange > 0 ? "text-green-500" : 
                    analysis.sentimentChange < 0 ? "text-red-500" : ""
                  }`}>
                    {analysis.sentimentChange > 0 ? '+' : ''}{analysis.sentimentChange.toFixed(2)} change
                  </span>
                </div>
              </div>
            </div>
            
            {/* Top Hashtags and Emotions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Top Hashtags */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="text-sm font-medium mb-3">Top Hashtags</div>
                <div className="space-y-2">
                  {analysis.topHashtags.map((hashtag, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Hash size={14} className="text-primary" />
                        <span className="text-sm">{hashtag.tag}</span>
                      </div>
                      <Badge variant="secondary">{hashtag.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Top Emotions */}
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="text-sm font-medium mb-3">Emotional Analysis</div>
                <div className="space-y-2">
                  {analysis.topEmotions.map((emotion, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{emotion.emotion}</span>
                        <span className="text-xs">{(emotion.intensity * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div 
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${emotion.intensity * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Last Updated */}
            <div className="text-xs text-muted-foreground">
              Last updated: {formatDate(analysis.lastUpdated)}
            </div>
          </TabsContent>
          
          {/* TWEETS TAB */}
          <TabsContent value="tweets" className="mt-0">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input
                  type="text"
                  placeholder="Search tweets by text, user, or hashtag..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="max-h-[400px] overflow-y-auto">
              {filteredTweets.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No tweets match your search.
                </div>
              ) : (
                filteredTweets.map(tweet => (
                  <div key={tweet.id} className="p-4 border-b hover:bg-secondary/10 transition-colors">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-primary" />
                        <span className="font-medium">{tweet.user}</span>
                        <span className="text-sm text-muted-foreground">{tweet.userHandle}</span>
                      </div>
                      <Badge variant={getSentimentBadge(tweet.sentiment.score)}>
                        {tweet.sentiment.score > 0.2 ? 'Positive' : 
                         tweet.sentiment.score < -0.2 ? 'Negative' : 'Neutral'}
                      </Badge>
                    </div>
                    
                    <p className="mb-2">{tweet.text}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-2">
                      {tweet.hashtags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Repeat size={12} />
                          <span>{tweet.retweets}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle size={12} />
                          <span>{tweet.likes}</span>
                        </div>
                        {tweet.isGeoTagged && (
                          <div className="flex items-center gap-1">
                            <Map size={12} />
                            <span>{tweet.district || 'Geotagged'}</span>
                          </div>
                        )}
                      </div>
                      <span>{new Date(tweet.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          {/* TRENDS TAB */}
          <TabsContent value="trends" className="p-6 mt-0">
            <div className="space-y-6">
              {analysis.trends.map((trend, index) => (
                <div key={index} className="bg-secondary/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <Hash size={18} className="text-primary" />
                      <span className="font-medium">{trend.hashtag}</span>
                    </div>
                    <Badge variant={getSentimentBadge(trend.sentiment)}>
                      {trend.sentiment > 0.2 ? 'Positive' : 
                       trend.sentiment < -0.2 ? 'Negative' : 'Neutral'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Volume</div>
                      <div className="text-lg font-medium">{trend.volume.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Hourly Change</div>
                      <div className={`text-lg font-medium ${
                        trend.hourlyChange > 0 ? "text-green-500" : 
                        trend.hourlyChange < 0 ? "text-red-500" : ""
                      }`}>
                        {trend.hourlyChange > 0 ? '+' : ''}{trend.hourlyChange.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Related Terms</div>
                    <div className="flex flex-wrap gap-2">
                      {trend.relatedTerms.map((term, idx) => (
                        <Badge key={idx} variant="outline">{term}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          {/* RISK MAP TAB */}
          <TabsContent value="map" className="mt-0">
            <div className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                District-level risk heatmap will be implemented in the next phase.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Protest Risk Level</div>
                  <div className="flex items-center justify-center gap-2">
                    <AlertTriangle className={
                      analysis.protestRiskScore >= 70 ? "text-red-500" : 
                      analysis.protestRiskScore >= 40 ? "text-orange-500" : "text-green-500"
                    } />
                    <span className="font-medium">
                      {analysis.protestRiskScore >= 70 ? 'High' : 
                       analysis.protestRiskScore >= 40 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                </div>
                <div className="bg-secondary/30 rounded-lg p-4">
                  <div className="text-sm text-muted-foreground mb-1">Potential Hotspots</div>
                  <div className="font-medium">
                    {districtName}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default TwitterMonitor;
