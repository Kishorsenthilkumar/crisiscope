
import React from 'react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { APIKeyForm } from '../components/APIKeyForm';
import { useAuth } from '../context/AuthContext';
import { Globe2, LogIn, ArrowRight } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Globe2 className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">
            <span className="text-primary">Crisis</span>
            <span>Scope</span>
          </h1>
        </div>
        
        {!user && (
          <Button asChild variant="outline">
            <Link to="/auth" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In / Sign Up
            </Link>
          </Button>
        )}
      </div>
      
      <p className="text-lg mb-8">
        A real-time monitoring and analysis platform for crisis situations worldwide.
        Track social sentiment, economic indicators, and predictive analytics.
      </p>
      
      {user ? (
        <>
          <APIKeyForm />
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/dashboard" className="flex items-center gap-2">
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      ) : (
        <div className="bg-card border rounded-lg p-6 text-center space-y-4">
          <h2 className="text-2xl font-semibold">Welcome to CrisisScope</h2>
          <p className="text-muted-foreground">
            Please sign in or create an account to access the dashboard and configure your API keys.
          </p>
          <Button asChild size="lg">
            <Link to="/auth" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In / Sign Up
            </Link>
          </Button>
        </div>
      )}
      
      <div className="mt-12 space-y-4">
        <h3 className="text-xl font-medium">Features</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Interactive global crisis map with real-time data</li>
          <li>Social media sentiment analysis using Twitter API</li>
          <li>Economic indicators monitoring via FRED API</li>
          <li>Anomaly detection for early warning</li>
          <li>AI-powered predictions for crisis development</li>
        </ul>
      </div>
    </div>
  );
};

export default Index;
