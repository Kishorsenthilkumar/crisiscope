
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';
import { Lock, Check, Server } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchAPIKeys, updateAPIKeys } from '@/services/apiKeysService';
import { twitterConfig, fredConfig, indiaDataConfig, mapboxConfig } from '@/services/apiConfig';

export const APIKeyForm: React.FC = () => {
  const [twitterKey, setTwitterKey] = useState('');
  const [fredKey, setFredKey] = useState('');
  const [indiaDataKey, setIndiaDataKey] = useState('');
  const [mapboxKey, setMapboxKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load saved keys on component mount
  useEffect(() => {
    const loadAPIKeys = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        const keys = await fetchAPIKeys();
        if (keys) {
          if (keys.twitter_bearer_token) {
            setTwitterKey(keys.twitter_bearer_token);
            twitterConfig.bearerToken = keys.twitter_bearer_token;
          }
          
          if (keys.fred_api_key) {
            setFredKey(keys.fred_api_key);
            fredConfig.apiKey = keys.fred_api_key;
          }
          
          if (keys.india_data_api_key) {
            setIndiaDataKey(keys.india_data_api_key);
            indiaDataConfig.apiKey = keys.india_data_api_key;
          }
          
          if (keys.mapbox_token) {
            setMapboxKey(keys.mapbox_token);
            mapboxConfig.accessToken = keys.mapbox_token;
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
    
    loadAPIKeys();
  }, [user, toast]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save API keys.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const apiKeys = {
        twitter_bearer_token: twitterKey,
        fred_api_key: fredKey,
        india_data_api_key: indiaDataKey,
        mapbox_token: mapboxKey,
      };
      
      const success = await updateAPIKeys(apiKeys);
      
      if (success) {
        // Update the local config so the app can use the keys
        if (twitterKey) {
          twitterConfig.bearerToken = twitterKey;
        }
        
        if (fredKey) {
          fredConfig.apiKey = fredKey;
        }
        
        if (indiaDataKey) {
          indiaDataConfig.apiKey = indiaDataKey;
        }
        
        if (mapboxKey) {
          mapboxConfig.accessToken = mapboxKey;
        }
        
        toast({
          title: "API Keys Saved",
          description: "Your API keys have been securely stored.",
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
  
  const isTwitterConfigured = () => Boolean(twitterKey);
  const isFredConfigured = () => Boolean(fredKey);
  const isIndiaDataConfigured = () => Boolean(indiaDataKey);
  const isMapboxConfigured = () => Boolean(mapboxKey);
  
  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Server size={18} />
        <h2 className="text-lg font-medium">API Configuration</h2>
        <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-0.5 rounded-full">Secure Storage</span>
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
        
        <div className="space-y-2">
          <Label htmlFor="india-data-key">
            India Data API Key {isIndiaDataConfigured() && 
              <span className="text-green-500 text-xs ml-2 flex items-center">
                <Check size={12} className="mr-1" /> Configured
              </span>
            }
          </Label>
          <Input
            id="india-data-key"
            type="password"
            value={indiaDataKey}
            onChange={(e) => setIndiaDataKey(e.target.value)}
            placeholder="Enter your India Data API Key"
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mapbox-key">
            Mapbox Token {isMapboxConfigured() && 
              <span className="text-green-500 text-xs ml-2 flex items-center">
                <Check size={12} className="mr-1" /> Configured
              </span>
            }
          </Label>
          <Input
            id="mapbox-key"
            type="password"
            value={mapboxKey}
            onChange={(e) => setMapboxKey(e.target.value)}
            placeholder="Enter your Mapbox Token"
            disabled={isLoading}
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save API Keys'}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          Your API keys are securely stored and protected by row-level security.
          Only you can access your own API keys.
        </p>
      </form>
    </Card>
  );
};
