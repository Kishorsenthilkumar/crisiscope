
import React from 'react';
import { AlertTriangle } from "lucide-react";

export const OfflineWarning: React.FC = () => {
  return (
    <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm flex items-center gap-2">
      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
      <span>You appear to be offline. Alerts can't be sent until your connection is restored.</span>
    </div>
  );
};
