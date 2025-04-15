
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  AlertTriangle, 
  Send, 
  Loader2, 
  MessageSquare,
  Phone,
  Plus,
  X 
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from '@/integrations/supabase/client';
import { Switch } from "@/components/ui/switch";

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
  
  // SMS related states
  const [enableSms, setEnableSms] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
  const [smsSendToAuthorities, setSmsSendToAuthorities] = useState(true);
  const [smsSendToNGOs, setSmsSendToNGOs] = useState(false);
  const [smsSendToMedia, setSmsSendToMedia] = useState(false);
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  
  // Email validation
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Phone validation 
  const validatePhone = (phone: string) => {
    // Basic validation for international phone numbers
    const re = /^\+?[1-9]\d{1,14}$/;
    return re.test(phone);
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
  
  // Handle phone number change
  const handlePhoneChange = (index: number, value: string) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };
  
  // Add new phone number field
  const addPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, '']);
  };
  
  // Remove phone number field
  const removePhoneNumber = (index: number) => {
    if (phoneNumbers.length > 1) {
      const newPhoneNumbers = [...phoneNumbers];
      newPhoneNumbers.splice(index, 1);
      setPhoneNumbers(newPhoneNumbers);
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
        description: "Cannot send alerts while offline. Please check your connection.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate email
    if (!email || !validateEmail(email)) {
      setEmailValid(false);
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    // Validate message content
    if (!subject || !message) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message for the alert",
        variant: "destructive"
      });
      return;
    }
    
    // Validate phone numbers if SMS is enabled
    if (enableSms) {
      // Remove empty phone numbers
      const filteredPhoneNumbers = phoneNumbers.filter(phone => phone.trim() !== '');
      
      if (filteredPhoneNumbers.length === 0) {
        toast({
          title: "No phone numbers",
          description: "Please add at least one phone number to send SMS alerts",
          variant: "destructive"
        });
        return;
      }
      
      // Check if all phone numbers are valid
      const invalidPhones = filteredPhoneNumbers.filter(phone => !validatePhone(phone));
      if (invalidPhones.length > 0) {
        toast({
          title: "Invalid phone numbers",
          description: `Please correct ${invalidPhones.length} invalid phone numbers`,
          variant: "destructive"
        });
        return;
      }
      
      // Update phone numbers to filtered list
      setPhoneNumbers(filteredPhoneNumbers);
    }
    
    setIsLoading(true);
    
    try {
      // Send the alert using the Supabase edge function
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
          severity,
          // SMS related data
          sendSms: enableSms,
          phoneNumbers: enableSms ? phoneNumbers.filter(phone => phone.trim() !== '') : [],
          smsRecipients: {
            authorities: smsSendToAuthorities,
            ngos: smsSendToNGOs,
            media: smsSendToMedia
          }
        }
      });
      
      if (error) {
        throw new Error(`Failed to send alerts: ${error.message}`);
      }
      
      console.log('Crisis Alert Response:', data);
      
      // Show success message
      toast({
        title: "Alerts sent successfully",
        description: `Crisis alert has been dispatched via ${enableSms ? 'email and SMS' : 'email'}`,
      });
      
    } catch (error) {
      console.error('Error sending alert:', error);
      toast({
        title: "Failed to send alerts",
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
          Send Crisis Alert
          <div className="ml-auto px-2 py-0.5 text-xs rounded-full bg-white/20">
            {severity.toUpperCase()}
          </div>
        </CardTitle>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "email" | "sms")}>
        <div className="px-6 pt-6">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="email" className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              SMS
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="pt-4 space-y-4">
          <TabsContent value="email" className="space-y-4 mt-0">
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
                Additional Email Recipients
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
          </TabsContent>
          
          <TabsContent value="sms" className="space-y-4 mt-0">
            <div className="flex items-center justify-between">
              <Label htmlFor="enable-sms" className="text-sm font-medium">
                Enable SMS Alerts
              </Label>
              <Switch
                id="enable-sms"
                checked={enableSms}
                onCheckedChange={setEnableSms}
              />
            </div>
            
            {enableSms && (
              <>
                <div className="space-y-3">
                  <Label className="text-sm font-medium block">
                    Phone Numbers
                  </Label>
                  {phoneNumbers.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="flex-grow">
                        <Input
                          type="tel"
                          placeholder="+1234567890"
                          value={phone}
                          onChange={(e) => handlePhoneChange(index, e.target.value)}
                        />
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removePhoneNumber(index)}
                        disabled={phoneNumbers.length <= 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPhoneNumber}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Phone Number
                  </Button>
                </div>
                
                <div className="pt-2">
                  <Label className="text-sm font-medium mb-2 block">
                    Additional SMS Recipients
                  </Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sms-authorities" 
                        checked={smsSendToAuthorities}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') {
                            setSmsSendToAuthorities(checked);
                          }
                        }}
                      />
                      <Label htmlFor="sms-authorities" className="text-sm font-normal cursor-pointer">
                        Local Authorities
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sms-ngos" 
                        checked={smsSendToNGOs}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') {
                            setSmsSendToNGOs(checked);
                          }
                        }}
                      />
                      <Label htmlFor="sms-ngos" className="text-sm font-normal cursor-pointer">
                        Relief NGOs
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="sms-media" 
                        checked={smsSendToMedia}
                        onCheckedChange={(checked) => {
                          if (typeof checked === 'boolean') {
                            setSmsSendToMedia(checked);
                          }
                        }}
                      />
                      <Label htmlFor="sms-media" className="text-sm font-normal cursor-pointer">
                        Media Outlets
                      </Label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
      
      {!isOnline && (
        <div className="px-6 pb-4">
          <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 flex-shrink-0" />
            <span>You appear to be offline. Alerts can't be sent until your connection is restored.</span>
          </div>
        </div>
      )}
      
      <CardFooter className="flex justify-between border-t pt-4 pb-3">
        <div className="text-sm text-muted-foreground flex items-center">
          {activeTab === "email" ? (
            <>
              <Mail className="h-4 w-4 mr-1 opacity-70" />
              Email alert
            </>
          ) : (
            <>
              <Phone className="h-4 w-4 mr-1 opacity-70" />
              SMS alert
            </>
          )}
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
