
import React from 'react';
import { Brain, AlertTriangle, Clock, MapPin, ArrowRight, ChevronRight } from 'lucide-react';
import { getPredictions } from '../utils/dataUtils';

export const AIPredictions: React.FC = () => {
  const predictions = getPredictions();
  
  return (
    <div className="crisis-card p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-primary" />
          <h3 className="text-lg font-medium">AI Crisis Predictions</h3>
        </div>
        <button className="text-sm text-primary flex items-center gap-1 hover:text-primary/80 transition-colors">
          <span>View All</span>
          <ArrowRight size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {predictions.map((prediction, index) => (
          <div 
            key={index} 
            className="rounded-lg border border-border/60 p-3 hover:bg-secondary/10 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="font-medium">{prediction.indicator}</div>
              <div className={`px-2 py-0.5 rounded text-xs ${prediction.probability > 0.7 ? 'bg-crisis-high/20 text-crisis-high' : 'bg-crisis-medium/20 text-crisis-medium'}`}>
                {(prediction.probability * 100).toFixed(0)}% probability
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <MapPin size={12} />
              <span>{prediction.region}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Clock size={12} />
              <span>Expected within {prediction.timeframe}</span>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-1">
              {prediction.factors.map((factor, i) => (
                <div key={i} className="text-xs bg-secondary/30 px-2 py-0.5 rounded-full">
                  {factor}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-border text-sm flex justify-between items-center">
        <span className="text-muted-foreground">Based on multiple AI models and data sources</span>
        <button className="flex items-center text-primary text-xs hover:underline">
          <span>Model details</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};
