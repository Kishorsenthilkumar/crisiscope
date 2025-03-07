
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, Mail, FileText } from 'lucide-react';
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
  const [recipient, setRecipient] = useState<string>("");
  const [subject, setSubject] = useState<string>(`🚨 Drought Alert: ${stateName} Region`);
  const [message, setMessage] = useState<string>(`Dear NGO Team,

Our latest AI predictions indicate a potential drought risk in ${stateName}. Please find the attached report for detailed insights on affected districts, severity levels, and recommended actions.

This report is generated based on satellite imagery, weather patterns, and historical data analysis.

Best regards,
Drought Monitoring Team`);
  const [frequency, setFrequency] = useState<string>("weekly");
  const [includeExtreme, setIncludeExtreme] = useState<boolean>(true);
  const [includeHigh, setIncludeHigh] = useState<boolean>(true);
  const [includeMedium, setIncludeMedium] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Filter predictions based on current settings
  const filteredPredictions = predictions.filter(p => {
    if (p.severity === 'extreme' && includeExtreme) return true;
    if (p.severity === 'high' && includeHigh) return true;
    if (p.severity === 'medium' && includeMedium) return true;
    return false;
  });

  // Count districts by severity
  const extremeCount = predictions.filter(p => p.severity === 'extreme').length;
  const highCount = predictions.filter(p => p.severity === 'high').length;
  const mediumCount = predictions.filter(p => p.severity === 'medium').length;

  const handleSendEmail = async () => {
    if (!recipient) {
      toast({
        title: "Missing information",
        description: "Please provide a recipient email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // In a real implementation, this would send the data to a backend API
    // Here we're simulating the API call with a timeout
    setTimeout(() => {
      console.log("Email alert data:", {
        recipient,
        subject,
        message,
        frequency,
        includeExtreme,
        includeHigh,
        includeMedium,
        filteredPredictions,
        stateId,
      });

      toast({
        title: "Alert configured successfully",
        description: `Email alerts will be sent ${frequency} to ${recipient}`,
      });

      setLoading(false);
      onClose();
    }, 1500);
  };

  const handleGenerateReport = () => {
    // In a real implementation, this would generate a CSV or PDF file
    // Here we're simulating the download with a console log
    console.log("Generating report for predictions:", filteredPredictions);

    // Create a CSV string
    const headers = "District,Severity,Risk Score,Probability,Duration (months),Water Level,Rainfall Deficit\n";
    const rows = filteredPredictions.map(p => 
      `${p.districtName},${p.severity},${p.riskScore},${p.probabilityPercent}%,${p.durationMonths},${p.waterReservoirLevel}%,${p.rainfallDeficit}mm`
    ).join("\n");
    
    const csvContent = `data:text/csv;charset=utf-8,${headers}${rows}`;
    const encodedUri = encodeURI(csvContent);
    
    // Create a download link and trigger download
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `drought_report_${stateName.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Report downloaded",
      description: "Drought crisis report has been downloaded as CSV",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Configure Email Alerts
          </DialogTitle>
          <DialogDescription>
            Set up automated email alerts with drought crisis reports
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recipient" className="text-right">
              Recipient
            </Label>
            <Input
              id="recipient"
              placeholder="ngo@example.org"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subject" className="text-right">
              Subject
            </Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Message
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="col-span-3 min-h-[150px]"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="frequency" className="text-right">
              Frequency
            </Label>
            <Select
              value={frequency}
              onValueChange={setFrequency}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">
              Include
            </Label>
            <div className="col-span-3 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="extreme" 
                  checked={includeExtreme} 
                  onCheckedChange={setIncludeExtreme}
                />
                <Label htmlFor="extreme" className="font-normal">
                  Extreme severity ({extremeCount} districts)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="high" 
                  checked={includeHigh} 
                  onCheckedChange={setIncludeHigh}
                />
                <Label htmlFor="high" className="font-normal">
                  High severity ({highCount} districts)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="medium" 
                  checked={includeMedium} 
                  onCheckedChange={setIncludeMedium}
                />
                <Label htmlFor="medium" className="font-normal">
                  Medium severity ({mediumCount} districts)
                </Label>
              </div>
            </div>
          </div>

          {filteredPredictions.length === 0 && (
            <div className="col-span-4 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 p-3 rounded-md flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>No districts match your current severity selection.</span>
            </div>
          )}

          {filteredPredictions.length > 0 && (
            <div className="col-span-4 p-3 bg-muted rounded-md">
              <div className="text-sm font-medium mb-1">Report will include {filteredPredictions.length} districts:</div>
              <div className="text-xs text-muted-foreground">
                {filteredPredictions.slice(0, 5).map(p => p.districtName).join(", ")}
                {filteredPredictions.length > 5 && `, and ${filteredPredictions.length - 5} more...`}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={handleGenerateReport} 
            disabled={filteredPredictions.length === 0}
            className="sm:mr-auto gap-1"
          >
            <FileText className="h-4 w-4" />
            Download Report
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            disabled={loading || filteredPredictions.length === 0 || !recipient} 
            onClick={handleSendEmail}
            className="gap-1"
          >
            {loading ? "Configuring..." : "Configure Alert"}
            <Mail className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
