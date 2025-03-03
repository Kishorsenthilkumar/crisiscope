
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp, Filter } from 'lucide-react';
import { getTrendData } from '../utils/dataUtils';

export const TrendChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const trendData = getTrendData(parseInt(timeRange));
  
  // Color mapping for different indicators
  const colors = {
    'Risk Score': '#FF4A4A',
    'Economic Stress': '#FF9F45',
    'Social Unrest': '#3A86FF',
    'Resource Scarcity': '#2EC4B6',
  };
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-sm border border-border p-3 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <div className="space-y-1.5 mt-1.5">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="font-medium">{entry.name}: </span>
                <span>{entry.value.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="crisis-card p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Crisis Indicators Trend</h3>
        <div className="flex gap-2">
          <div className="glass-panel rounded-lg px-3 py-1.5 flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <select 
              className="bg-transparent border-none focus:outline-none text-sm appearance-none w-18"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="7">7 Days</option>
              <option value="14">14 Days</option>
              <option value="30">30 Days</option>
              <option value="90">90 Days</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={trendData}>
            <defs>
              {Object.entries(colors).map(([key, color]) => (
                <linearGradient key={key} id={`gradient-${key.replace(/\s+/g, '-').toLowerCase()}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={color} stopOpacity={0.1}/>
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
              stroke="rgba(255,255,255,0.5)"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 100]}
              stroke="rgba(255,255,255,0.5)"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {Object.entries(colors).map(([key, color]) => (
              <Area 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={color} 
                fillOpacity={1}
                fill={`url(#gradient-${key.replace(/\s+/g, '-').toLowerCase()})`} 
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 pt-3 border-t border-border flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Trend analysis from multiple data sources</span>
        <div className="flex items-center text-crisis-high">
          <TrendingUp size={16} className="mr-1" />
          <span>Rising risk indicators</span>
        </div>
      </div>
    </div>
  );
};
