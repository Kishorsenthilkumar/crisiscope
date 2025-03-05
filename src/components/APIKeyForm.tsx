
import React, { useState, useEffect } from 'react';
import { setAPIKeys, isTwitterConfigured, isFredConfigured, twitterConfig, fredConfig } from '../services/apiConfig';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { useToast } from './ui/use-toast';
import { Lock, Check } from 'lucide-react';

export const APIKeyForm: React.FC = () => {
  const [twitterKey, setTwitterKey] = useState('');
  const [fredKey, setFredKey] = useState('');
  const { toast } = useToast();
  
  // Load saved keys from config on component mount
  useEffect(() => {
    if (twitterConfig.bearerToken) {
      setTwitterKey(twitterConfig.bearerToken);
    }
    
    if (fredConfig.apiKey) {
      setFredKey(fredConfig.apiKey);
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setAPIKeys({
      twitterBearerToken: twitterKey,
      fredApiKey: fredKey,
    });
    
    toast({
      title: "API Keys Saved",
      description: "Your API keys have been saved permanently to localStorage.",
      duration: 3000,
    });
  };
  
  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Lock size={18} />
        <h2 className="text-lg font-medium">API Configuration</h2>
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
          />
        </div>
        
        <Button type="submit" className="w-full">
          Save API Keys
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          Your API keys are saved in your browser's localStorage and will persist between sessions.
          They are never sent to our servers.
        </p>
      </form>
    </Card>
  );
};
