
import React from 'react';
import { Info } from "lucide-react";

interface TwilioStatusProps {
  isConfigured: boolean;
}

export const TwilioStatus: React.FC<TwilioStatusProps> = ({ isConfigured }) => {
  if (isConfigured) return null;
  
  return (
    <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-sm flex items-center gap-2">
      <Info className="h-4 w-4 flex-shrink-0" />
      <span>
        SMS functionality is disabled because Twilio is not configured. 
        Emails will still be sent.
      </span>
    </div>
  );
};
