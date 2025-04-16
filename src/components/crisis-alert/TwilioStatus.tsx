
import React from 'react';
import { Info, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

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
  
  // Show different message based on error type
  const isCredentialError = errorMessage && 
    (errorMessage.includes('Authentication') || 
     errorMessage.includes('authenticate') ||
     errorMessage.includes('credentials') ||
     errorMessage.includes('invalid') || 
     errorMessage.includes('Invalid'));
     
  const isMissingError = errorMessage &&
    errorMessage.includes('missing');
  
  return (
    <div className={`p-3 ${isCredentialError ? 'bg-red-50 text-red-800 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200'} border rounded-md text-sm flex items-center gap-2`}>
      {isCredentialError ? (
        <XCircle className="h-4 w-4 flex-shrink-0" />
      ) : errorMessage ? (
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
