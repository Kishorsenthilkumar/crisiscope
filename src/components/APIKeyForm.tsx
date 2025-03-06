
import React, { useState, useEffect } from 'react';
import { isTwitterConfigured, isFredConfigured, twitterConfig, fredConfig } from '../services/apiConfig';
import { storeAPIKeys, fetchAPIKeys, getUserId } from '../services/backendService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';
import { Lock, Check, Server } from 'lucide-react';

export const APIKeyForm: React.FC = () => {
  const [twitterKey, setTwitterKey] = useState('');
  const [fredKey, setFredKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const { toast } = useToast();
  
  // Load saved keys on component mount
  useEffect(() => {
    const fetchKeys = async () => {
      setIsLoading(true);
      const currentUserId = getUserId();
      setUserId(currentUserId);
      
      try {
        const keys = await fetchAPIKeys(currentUserId);
        if (keys) {
          if (keys.twitterBearerToken) {
            setTwitterKey(keys.twitterBearerToken);
          }
          
          if (keys.fredApiKey) {
            setFredKey(keys.fredApiKey);
          }
        }
      } catch (error) {
        console.error('Error loading API keys:', error);
        toast({
          title: "Error Loading Keys",
          description: "There was a problem loading your saved API keys.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchKeys();
  }, [toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await storeAPIKeys(userId, {
        twitterBearerToken: twitterKey,
        fredApiKey: fredKey,
      });
      
      if (success) {
        toast({
          title: "API Keys Saved",
          description: "Your API keys have been securely stored on our server.",
          duration: 3000,
        });
      } else {
        throw new Error('Failed to store keys');
      }
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Error Saving Keys",
        description: "There was a problem saving your API keys.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Server size={18} />
        <h2 className="text-lg font-medium">API Configuration</h2>
        <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full">Secure Backend Storage</span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="twitter-key">
            Twitter Bearer Token {isTwitterConfigured() && 
              <span className="text-green-500 text-xs ml-2 flex items-center">
                <Check size={12} className="mr-1" /> Configured
              </span>
            }
          </Label>
          <Input
            id="twitter-key"
            type="password"
            value={twitterKey}
            onChange={(e) => setTwitterKey(e.target.value)}
            placeholder="Enter your Twitter API Bearer Token"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fred-key">
            FRED API Key {isFredConfigured() && 
              <span className="text-green-500 text-xs ml-2 flex items-center">
                <Check size={12} className="mr-1" /> Configured
              </span>
            }
          </Label>
          <Input
            id="fred-key"
            type="password"
            value={fredKey}
            onChange={(e) => setFredKey(e.target.value)}
            placeholder="Enter your FRED API Key"
            disabled={isLoading}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save API Keys'}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          Your API keys are securely stored on our servers and are never exposed to the client.
          We use these keys to fetch real-time data on your behalf.
        </p>
        
        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          <Lock size={12} />
          <span>Your unique user ID: {userId.substring(0, 8)}...</span>
        </div>
      </form>
    </Card>
  );
};
