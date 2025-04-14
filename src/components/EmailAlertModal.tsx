
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, FileDown, Bell, Loader2, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { DroughtPrediction } from '../services/predictionService';
import { useAuth } from "@/context/AuthContext";
import { supabase } from '@/integrations/supabase/client';

interface EmailAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  predictions: DroughtPrediction[];
  stateId: string;
  stateName: string;
}

export const EmailAlertModal: React.FC<EmailAlertModalProps> = ({
  isOpen,
  onClose,
  predictions,
  stateId,
  stateName
}) => {
  const { isOnline } = useAuth();
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [includeHighRisk, setIncludeHighRisk] = useState(true);
  const [includeExtremeRisk, setIncludeExtremeRisk] = useState(true);
  const [includeMediumRisk, setIncludeMediumRisk] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'immediate'>('weekly');
  const [isLoading, setIsLoading] = useState(false);

  // Email validation function
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailValid(validateEmail(newEmail));
  };

  // Handle subscribe button click
  const handleSubscribe = async () => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Cannot send emails while offline. Please check your connection.",
        variant: "destructive"
      });
      return;
    }
    
    if (!email || !emailValid) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Filter predictions based on selected risk levels
      const filteredPredictions = predictions.filter(p => {
        if (p.severity === 'extreme' && includeExtremeRisk) return true;
        if (p.severity === 'high' && includeHighRisk) return true;
        if (p.severity === 'medium' && includeMediumRisk) return true;
        return false;
      });
      
      // Create prediction summary for email
      const highRiskDistricts = filteredPredictions
        .filter(p => p.severity === 'high' || p.severity === 'extreme')
        .map(p => p.districtName)
        .join(', ');
      
      // Create email message
      const subject = `Drought Alert Subscription: ${stateName} - ${frequency.charAt(0).toUpperCase() + frequency.slice(1)} Updates`;
      
      const message = `You have subscribed to ${frequency} drought alert updates for ${stateName}.
      
Risk Levels Included:
${includeExtremeRisk ? '- Extreme Risk Districts' : ''}
${includeHighRisk ? '- High Risk Districts' : ''}
${includeMediumRisk ? '- Medium Risk Districts' : ''}

Current High Risk Areas: ${highRiskDistricts || 'None'}

You will receive ${frequency} updates about changing drought conditions in this region.`;

      // Send subscription confirmation email
      const { data, error } = await supabase.functions.invoke('send-crisis-alert', {
        body: {
          email,
          subject,
          message,
          recipients: {
            authorities: false,
            ngos: false,
            media: false
          },
          crisisType: 'drought',
          regionName: stateName,
          severity: 'medium'
        }
      });
      
      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      
      console.log("Subscription Email Response:", data);
      
      // Show success toast
      toast({
        title: "Subscription successful!",
        description: `You will receive ${frequency} drought alerts for ${stateName} at ${email}`,
      });

      // Close the modal
      onClose();
    } catch (error) {
      console.error('Error subscribing to alerts:', error);
      toast({
        title: "Subscription failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate CSV for download
  const handleDownloadCSV = () => {
    // Filter predictions based on selected risk levels
    const filteredPredictions = predictions.filter(p => {
      if (p.severity === 'extreme' && includeExtremeRisk) return true;
      if (p.severity === 'high' && includeHighRisk) return true;
      if (p.severity === 'medium' && includeMediumRisk) return true;
      return false;
    });

    // Create CSV header
    let csvContent = "District,Severity,Probability,Duration,Risk Score,Reservoir Level,Rainfall Deficit\n";
    
    // Add data rows
    filteredPredictions.forEach(p => {
      csvContent += `${p.districtName},${p.severity},${p.probabilityPercent}%,${p.durationMonths} months,${p.riskScore},${p.waterReservoirLevel}%,${p.rainfallDeficit}mm\n`;
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${stateName}_drought_predictions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Report downloaded",
      description: `${stateName} drought predictions saved as CSV`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Drought Alert Subscription
          </DialogTitle>
          <DialogDescription>
            Receive email alerts when drought risk increases in {stateName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={handleEmailChange}
              className={!emailValid && email ? "border-red-500" : ""}
            />
            {!emailValid && email && (
              <p className="text-xs text-red-500">Please enter a valid email</p>
            )}
          </div>
          
          <div className="space-y-4">
            <Label>Risk Levels to Include</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="extreme" 
                checked={includeExtremeRisk}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setIncludeExtremeRisk(checked);
                  }
                }}
              />
              <Label htmlFor="extreme" className="text-sm font-normal cursor-pointer">
                Extreme Risk Districts
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="high" 
                checked={includeHighRisk}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setIncludeHighRisk(checked);
                  }
                }}
              />
              <Label htmlFor="high" className="text-sm font-normal cursor-pointer">
                High Risk Districts
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="medium" 
                checked={includeMediumRisk}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setIncludeMediumRisk(checked);
                  }
                }}
              />
              <Label htmlFor="medium" className="text-sm font-normal cursor-pointer">
                Medium Risk Districts
              </Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Alert Frequency</Label>
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant={frequency === "immediate" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFrequency("immediate")}
                className="flex-1"
              >
                <Bell className="h-4 w-4 mr-1" />
                Immediate
              </Button>
              <Button 
                type="button" 
                variant={frequency === "daily" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFrequency("daily")}
                className="flex-1"
              >
                Daily
              </Button>
              <Button 
                type="button" 
                variant={frequency === "weekly" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFrequency("weekly")}
                className="flex-1"
              >
                Weekly
              </Button>
            </div>
          </div>
          
          {!isOnline && (
            <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>You appear to be offline. Email alerts can't be sent until your connection is restored.</span>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleDownloadCSV}
            className="sm:mr-auto"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button 
            onClick={handleSubscribe} 
            disabled={isLoading || !isOnline}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
