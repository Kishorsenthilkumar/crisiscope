
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  AlertTriangle, 
  Send, 
  Loader2, 
  MessageSquare,
  Phone
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { CrisisEmailAlertProps } from './types';
import { getSeverityColor } from './utils';
import { EmailForm } from './EmailForm';
import { SmsForm } from './SmsForm';
import { OfflineWarning } from './OfflineWarning';
import { TwilioStatus } from './TwilioStatus';
import { useCrisisAlert } from './useCrisisAlert';

export const CrisisEmailAlert: React.FC<CrisisEmailAlertProps> = ({ 
  crisisType = 'drought',
  regionName = 'Selected Region',
  severity = 'medium'
}) => {
  const { isOnline } = useAuth();
  const [twilioConfigured, setTwilioConfigured] = useState<boolean>(false);
  const [twilioErrorMessage, setTwilioErrorMessage] = useState<string | undefined>(undefined);
  
  // Always show Twilio status for SMS tab
  const [activeTab, setActiveTab] = useState<"email" | "sms">("email");
  
  const {
    emailFormData,
    setEmailFormData,
    smsFormData,
    setSmsFormData,
    isLoading,
    emailValid,
    handleEmailChange,
    handlePhoneChange,
    addPhoneNumber,
    removePhoneNumber,
    handleSendAlert,
    onAlertSent
  } = useCrisisAlert(crisisType, regionName, severity, (response) => {
    // Check if Twilio is configured from the response
    if (response?.sms) {
      console.log("Twilio response:", response.sms);
      setTwilioConfigured(response.sms.configured || false);
      setTwilioErrorMessage(response.sms.errorMessage);
    }
  });

  // Check if Twilio is configured on component mount
  useEffect(() => {
    const checkTwilioConfig = async () => {
      try {
        // Make a simple request to the edge function just to check Twilio status
        const { data, error } = await supabase.functions.invoke('send-crisis-alert', {
          body: { 
            // Minimal data just to get a response with Twilio status
            email: "check@example.com",
            subject: "Configuration Check",
            message: "This is just a configuration check",
            recipients: {},
            crisisType: "check",
            regionName: "Configuration",
            severity: "low",
            sendSms: true,
            phoneNumbers: [],
            smsRecipients: {}
          }
        });
        
        if (error) {
          console.error("Error checking Twilio configuration:", error);
          return;
        }
        
        if (data?.sms) {
          console.log("Initial Twilio configuration check:", data.sms);
          setTwilioConfigured(data.sms.configured || false);
          setTwilioErrorMessage(data.sms.errorMessage);
        }
      } catch (err) {
        console.error("Failed to check Twilio configuration:", err);
      }
    };
    
    checkTwilioConfig();
  }, []);

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
          {activeTab === "sms" && (
            <TwilioStatus isConfigured={twilioConfigured} errorMessage={twilioErrorMessage} />
          )}
        
          <TabsContent value="email" className="space-y-4 mt-0">
            <EmailForm 
              formData={emailFormData}
              emailValid={emailValid}
              onEmailChange={handleEmailChange}
              onSubjectChange={(e) => setEmailFormData({...emailFormData, subject: e.target.value})}
              onMessageChange={(e) => setEmailFormData({...emailFormData, message: e.target.value})}
              onAuthoritiesChange={(checked) => setEmailFormData({...emailFormData, sendToAuthorities: checked})}
              onNGOsChange={(checked) => setEmailFormData({...emailFormData, sendToNGOs: checked})}
              onMediaChange={(checked) => setEmailFormData({...emailFormData, sendToMedia: checked})}
            />
          </TabsContent>
          
          <TabsContent value="sms" className="space-y-4 mt-0">
            <SmsForm 
              formData={smsFormData}
              onSmsEnableChange={(enabled) => setSmsFormData({...smsFormData, enableSms: enabled})}
              onPhoneChange={handlePhoneChange}
              onAddPhone={addPhoneNumber}
              onRemovePhone={removePhoneNumber}
              onAuthoritiesChange={(checked) => setSmsFormData({...smsFormData, sendToAuthorities: checked})}
              onNGOsChange={(checked) => setSmsFormData({...smsFormData, sendToNGOs: checked})}
              onMediaChange={(checked) => setSmsFormData({...smsFormData, sendToMedia: checked})}
            />
          </TabsContent>
        </CardContent>
      </Tabs>
      
      {!isOnline && (
        <div className="px-6 pb-4">
          <OfflineWarning />
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
              SMS alert {!twilioConfigured && "(disabled)"}
            </>
          )}
        </div>
        <Button
          onClick={() => handleSendAlert(isOnline)}
          disabled={isLoading || !isOnline || (activeTab === "sms" && smsFormData.enableSms && !twilioConfigured)}
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
