
import React from 'react';
import { ChevronUp, ChevronDown, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react';

interface CrisisCardProps {
  title: string;
  value: string | number;
  change?: number;
  status?: 'high' | 'medium' | 'low' | 'info';
  icon?: React.ReactNode;
  className?: string;
}

export const CrisisCard: React.FC<CrisisCardProps> = ({
  title,
  value,
  change,
  status = 'info',
  icon,
  className = '',
}) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'high': return 'crisis-badge-high';
      case 'medium': return 'crisis-badge-medium';
      case 'low': return 'crisis-badge-low';
      default: return 'crisis-badge-info';
    }
  };
  
  const getIcon = () => {
    if (icon) return icon;
    
    switch (status) {
      case 'high': return <AlertTriangle size={16} className="text-crisis-high" />;
      case 'medium': return <AlertTriangle size={16} className="text-crisis-medium" />;
      case 'low': return <AlertTriangle size={16} className="text-crisis-low" />;
      default: return <AlertTriangle size={16} className="text-crisis-info" />;
    }
  };
  
  const getChangeIndicator = () => {
    if (change === undefined) return null;
    
    const isPositive = change >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const textColor = isPositive ? 'text-crisis-low' : 'text-crisis-high';
    
    return (
      <div className={`flex items-center ${textColor}`}>
        <Icon size={16} className="mr-1" />
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };
  
  return (
    <div className={`crisis-card p-4 ${className}`}>
      <div className="flex justify-between items-start mb-2">
        <div className={getBadgeClass()}>
          {getIcon()}
          <span className="ml-1">{title}</span>
        </div>
        {getChangeIndicator()}
      </div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  );
};
