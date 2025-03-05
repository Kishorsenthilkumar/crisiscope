
import React from 'react';
import { IndiaStateData } from '../services/indiaDataService';
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Building } from 'lucide-react';

interface StateSummaryCardsProps {
  state: IndiaStateData;
}

export const StateSummaryCards: React.FC<StateSummaryCardsProps> = ({ state }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">GSDP</p>
            <h3 className="text-xl font-bold">${state.gdp}B</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <DollarSign size={16} className="text-primary" />
          </div>
        </div>
        <div className="flex items-center mt-2">
          {state.gdpGrowth > 0 ? (
            <TrendingUp size={14} className="text-green-500 mr-1" />
          ) : (
            <TrendingDown size={14} className="text-red-500 mr-1" />
          )}
          <span className={state.gdpGrowth > 0 ? 'text-green-500' : 'text-red-500'}>
            {state.gdpGrowth > 0 ? '+' : ''}{state.gdpGrowth}%
          </span>
        </div>
      </div>
      
      <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Unemployment</p>
            <h3 className="text-xl font-bold">{state.unemploymentRate}%</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Users size={16} className="text-primary" />
          </div>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              state.unemploymentRate > 6 ? 'bg-red-500' : 
              state.unemploymentRate > 4 ? 'bg-orange-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(100, state.unemploymentRate * 10)}%` }}
          />
        </div>
      </div>
      
      <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Risk Score</p>
            <h3 className="text-xl font-bold">{state.riskScore}/100</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Activity size={16} className="text-primary" />
          </div>
        </div>
        <div className="w-full h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
          <div 
            className={`h-full rounded-full ${
              state.riskScore > 60 ? 'bg-red-500' : 
              state.riskScore > 40 ? 'bg-orange-500' : 
              'bg-green-500'
            }`}
            style={{ width: `${state.riskScore}%` }}
          />
        </div>
      </div>
      
      <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Population</p>
            <h3 className="text-xl font-bold">{state.populationMillions}M</h3>
          </div>
          <div className="bg-primary/10 p-2 rounded-full">
            <Building size={16} className="text-primary" />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="text-xs text-muted-foreground mt-1">
            Literacy: {state.literacyRate}%
          </div>
        </div>
      </div>
    </div>
  );
};
