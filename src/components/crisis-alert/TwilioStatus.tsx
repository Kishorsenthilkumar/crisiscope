
import React from 'react';
import { Info, AlertTriangle } from "lucide-react";

interface TwilioStatusProps {
  isConfigured: boolean;
  errorMessage?: string;
}

export const TwilioStatus: React.FC<TwilioStatusProps> = ({ isConfigured, errorMessage }) => {
  if (isConfigured) return null;
  
  return (
    <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm flex items-center gap-2">
      {errorMessage ? (
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      ) : (
        <Info className="h-4 w-4 flex-shrink-0" />
      )}
      <span>
        {errorMessage || 
          "SMS functionality is disabled because Twilio is not configured. Emails will still be sent."}
      </span>
    </div>
  );
};
