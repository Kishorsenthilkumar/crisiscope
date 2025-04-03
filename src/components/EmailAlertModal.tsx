
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
import { Mail, FileDown, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DroughtPrediction } from '../services/predictionService';

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
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [includeHighRisk, setIncludeHighRisk] = useState(true);
  const [includeExtremeRisk, setIncludeExtremeRisk] = useState(true);
  const [includeMediumRisk, setIncludeMediumRisk] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'immediate'>('weekly');

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
  const handleSubscribe = () => {
    if (!email || !emailValid) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Log the subscription details
    console.log("Email Alert Subscription:", {
      email,
      stateId,
      stateName,
      includeHighRisk,
      includeExtremeRisk,
      includeMediumRisk,
      frequency
    });

    // Show success toast
    toast({
      title: "Subscription successful!",
      description: `You will receive ${frequency} drought alerts for ${stateName} at ${email}`,
    });

    // Close the modal
    onClose();
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
          <Button onClick={handleSubscribe} type="submit">
            <Mail className="mr-2 h-4 w-4" />
            Subscribe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
