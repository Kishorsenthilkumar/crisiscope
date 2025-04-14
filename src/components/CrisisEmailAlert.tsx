
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, AlertTriangle, Send, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from '@/integrations/supabase/client';

interface CrisisEmailAlertProps {
  crisisType?: 'drought' | 'economic' | 'political' | 'social' | 'other';
  regionName?: string;
  severity?: 'low' | 'medium' | 'high' | 'extreme';
}

export const CrisisEmailAlert: React.FC<CrisisEmailAlertProps> = ({ 
  crisisType = 'drought',
  regionName = 'Selected Region',
  severity = 'medium'
}) => {
  const { isOnline } = useAuth();
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState(`${severity.toUpperCase()} ${crisisType} Crisis Alert for ${regionName}`);
  const [message, setMessage] = useState(`This is an automated alert regarding the ${severity} level ${crisisType} crisis situation developing in ${regionName}. Please take appropriate action.`);
  const [sendToAuthorities, setSendToAuthorities] = useState(true);
  const [sendToNGOs, setSendToNGOs] = useState(false);
  const [sendToMedia, setSendToMedia] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  
  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(true); // Don't show error when empty
    }
  };
  
  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-orange-500 text-white';
      default: return 'bg-green-500 text-white';
    }
  };
  
  // Handle send alert
  const handleSendAlert = async () => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Cannot send emails while offline. Please check your connection.",
        variant: "destructive"
      });
      return;
    }
    
    if (!email || !validateEmail(email)) {
      setEmailValid(false);
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    if (!subject || !message) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message for the alert",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Send the email using the Supabase edge function
      const { data, error } = await supabase.functions.invoke('send-crisis-alert', {
        body: {
          email,
          subject,
          message,
          recipients: {
            authorities: sendToAuthorities,
            ngos: sendToNGOs,
            media: sendToMedia
          },
          crisisType,
          regionName,
          severity
        }
      });
      
      if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
      }
      
      console.log('Crisis Alert Email Response:', data);
      
      // Show success message
      toast({
        title: "Alert sent successfully",
        description: `Crisis alert has been dispatched to ${email}`,
      });
      
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        title: "Failed to send alert",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="shadow-md w-full max-w-lg mx-auto">
      <CardHeader className={`${getSeverityColor(severity)}`}>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Send Crisis Alert Email
          <div className="ml-auto px-2 py-0.5 text-xs rounded-full bg-white/20">
            {severity.toUpperCase()}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">
            Recipient Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={handleEmailChange}
            className={!emailValid ? "border-red-500" : ""}
          />
          {!emailValid && (
            <p className="text-xs text-red-500">Please enter a valid email address</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Alert Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
        </div>
        
        <div className="pt-2">
          <Label className="text-sm font-medium mb-2 block">
            Additional Recipients
          </Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="authorities" 
                checked={sendToAuthorities}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setSendToAuthorities(checked);
                  }
                }}
              />
              <Label htmlFor="authorities" className="text-sm font-normal cursor-pointer">
                Local Authorities
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ngos" 
                checked={sendToNGOs}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setSendToNGOs(checked);
                  }
                }}
              />
              <Label htmlFor="ngos" className="text-sm font-normal cursor-pointer">
                Relief NGOs
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="media" 
                checked={sendToMedia}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    setSendToMedia(checked);
                  }
                }}
              />
              <Label htmlFor="media" className="text-sm font-normal cursor-pointer">
                Media Outlets
              </Label>
            </div>
          </div>
        </div>
        
        {!isOnline && (
          <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>You appear to be offline. Email alerts can't be sent until your connection is restored.</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-4 pb-3">
        <div className="text-sm text-muted-foreground flex items-center">
          <Mail className="h-4 w-4 mr-1 opacity-70" />
          {crisisType.charAt(0).toUpperCase() + crisisType.slice(1)} crisis alert
        </div>
        <Button
          onClick={handleSendAlert}
          disabled={isLoading || !isOnline}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Alert
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
