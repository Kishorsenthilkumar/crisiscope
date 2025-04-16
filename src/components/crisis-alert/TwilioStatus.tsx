
import React from 'react';
import { Info, AlertTriangle, CheckCircle } from "lucide-react";

interface TwilioStatusProps {
  isConfigured: boolean;
  errorMessage?: string;
}

export const TwilioStatus: React.FC<TwilioStatusProps> = ({ isConfigured, errorMessage }) => {
  if (isConfigured && !errorMessage) {
    return (
      <div className="p-3 bg-green-50 text-green-800 border border-green-200 rounded-md text-sm flex items-center gap-2">
        <CheckCircle className="h-4 w-4 flex-shrink-0" />
        <span>Twilio is configured and ready to send SMS alerts.</span>
      </div>
    );
  }
  
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
