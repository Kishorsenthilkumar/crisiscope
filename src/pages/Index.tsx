
import React from 'react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { APIKeyForm } from '../components/APIKeyForm';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Crisis Management Dashboard</h1>
      <p className="text-lg mb-8">
        A real-time monitoring and analysis platform for crisis situations worldwide.
        Track social sentiment, economic indicators, and predictive analytics.
      </p>
      
      <APIKeyForm />
      
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <Button asChild className="w-full sm:w-auto">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        
        <div className="mt-8 space-y-4">
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
    </div>
  );
};

export default Index;
