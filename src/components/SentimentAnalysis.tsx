
import React from 'react';
import { BarChart3, TrendingDown, Twitter, MessageCircle, Globe, Facebook } from 'lucide-react';
import { getSentimentData } from '../utils/dataUtils';

export const SentimentAnalysis: React.FC = () => {
  const sentimentData = getSentimentData();
  
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter': return <Twitter size={16} />;
      case 'reddit': return <MessageCircle size={16} />;
      case 'news media': return <Globe size={16} />;
      case 'facebook': return <Facebook size={16} />;
      default: return <Globe size={16} />;
    }
  };
  
  const getSentimentColor = (sentiment: number) => {
    if (sentiment < -0.3) return 'bg-crisis-high';
    if (sentiment < -0.15) return 'bg-crisis-medium';
    return 'bg-crisis-low';
  };
  
  return (
    <div className="crisis-card p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Social Media Sentiment</h3>
        <div className="flex items-center text-crisis-high">
          <TrendingDown size={16} className="mr-1" />
          <span className="text-sm">Declining</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {sentimentData.map((item) => (
          <div key={item.platform} className="space-y-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {getPlatformIcon(item.platform)}
                <span className="font-medium text-sm">{item.platform}</span>
              </div>
              <div className="text-sm">
                {item.sentiment.toFixed(2)} ({item.change > 0 ? '+' : ''}{item.change.toFixed(2)})
              </div>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getSentimentColor(item.sentiment)}`}
                style={{ width: `${Math.abs(item.sentiment) * 100}%` }}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Volume: {item.volume.toLocaleString()} posts
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border text-sm text-muted-foreground">
        <div>NLP analysis indicates rising negative sentiment</div>
      </div>
    </div>
  );
};
