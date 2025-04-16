
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { CrisisType, SeverityLevel, ActiveTab, EmailFormData, SmsFormData } from './types';
import { validateEmail, validatePhone } from './utils';

interface AlertResponse {
  email: any;
  sms: {
    sent: boolean;
    configured: boolean;
    errorMessage?: string;
    responses: any[];
    twilioPhone: string | null;
  } | null;
}

export const useCrisisAlert = (
  crisisType: CrisisType,
  regionName: string,
  severity: SeverityLevel,
  onAlertSent?: (response: AlertResponse) => void
) => {
  // Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>("email");
  
  // Email form state
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    email: '',
    subject: `${severity.toUpperCase()} ${crisisType} Crisis Alert for ${regionName}`,
    message: `This is an automated alert regarding the ${severity} level ${crisisType} crisis situation developing in ${regionName}. Please take appropriate action.`,
    sendToAuthorities: true,
    sendToNGOs: false,
    sendToMedia: false
  });
  
  // SMS form state
  const [smsFormData, setSmsFormData] = useState<SmsFormData>({
    enableSms: false,
    phoneNumbers: [''],
    sendToAuthorities: true,
    sendToNGOs: false,
    sendToMedia: false
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  
  // Handle email change with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailFormData({...emailFormData, email: value});
    if (value) {
      setEmailValid(validateEmail(value));
    } else {
      setEmailValid(true); // Don't show error when empty
    }
  };
  
  // Handle phone number change
  const handlePhoneChange = (index: number, value: string) => {
    const newPhoneNumbers = [...smsFormData.phoneNumbers];
    newPhoneNumbers[index] = value;
    setSmsFormData({...smsFormData, phoneNumbers: newPhoneNumbers});
  };
  
  // Add new phone number field
  const addPhoneNumber = () => {
    setSmsFormData({
      ...smsFormData, 
      phoneNumbers: [...smsFormData.phoneNumbers, '']
    });
  };
  
  // Remove phone number field
  const removePhoneNumber = (index: number) => {
    if (smsFormData.phoneNumbers.length > 1) {
      const newPhoneNumbers = [...smsFormData.phoneNumbers];
      newPhoneNumbers.splice(index, 1);
      setSmsFormData({
        ...smsFormData,
        phoneNumbers: newPhoneNumbers
      });
    }
  };

  const handleSendAlert = async (isOnline: boolean) => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Cannot send alerts while offline. Please check your connection.",
        variant: "destructive"
      });
      return;
    }
    
    // Validate email
    if (!emailFormData.email || !validateEmail(emailFormData.email)) {
      setEmailValid(false);
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }
    
    // Validate message content
    if (!emailFormData.subject || !emailFormData.message) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message for the alert",
        variant: "destructive"
      });
      return;
    }
    
    // Validate phone numbers if SMS is enabled
    if (smsFormData.enableSms) {
      // Remove empty phone numbers
      const filteredPhoneNumbers = smsFormData.phoneNumbers.filter(phone => phone.trim() !== '');
      
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
          description: `Please correct ${invalidPhones.length} invalid phone ${invalidPhones.length === 1 ? 'number' : 'numbers'}. Phone numbers must be in E.164 format (e.g., +12345678901)`,
          variant: "destructive"
        });
        return;
      }
      
      // Update phone numbers to filtered list
      setSmsFormData({
        ...smsFormData,
        phoneNumbers: filteredPhoneNumbers
      });
    }
    
    setIsLoading(true);
    
    try {
      // Send the alert using the Supabase edge function
      const { data, error } = await supabase.functions.invoke('send-crisis-alert', {
        body: {
          email: emailFormData.email,
          subject: emailFormData.subject,
          message: emailFormData.message,
          recipients: {
            authorities: emailFormData.sendToAuthorities,
            ngos: emailFormData.sendToNGOs,
            media: emailFormData.sendToMedia
          },
          crisisType,
          regionName,
          severity,
          // SMS related data
          sendSms: smsFormData.enableSms,
          phoneNumbers: smsFormData.enableSms ? smsFormData.phoneNumbers.filter(phone => phone.trim() !== '') : [],
          smsRecipients: {
            authorities: smsFormData.sendToAuthorities,
            ngos: smsFormData.sendToNGOs,
            media: smsFormData.sendToMedia
          }
        }
      });
      
      if (error) {
        throw new Error(`Failed to send alerts: ${error.message}`);
      }
      
      console.log('Crisis Alert Response:', data);
      
      // Call the callback with the response if provided
      if (onAlertSent && data) {
        onAlertSent(data as AlertResponse);
      }
      
      // Show different success messages based on SMS status
      const smsData = (data as AlertResponse)?.sms;
      
      if (smsFormData.enableSms && smsData) {
        if (smsData.sent) {
          toast({
            title: "Alerts sent successfully",
            description: "Crisis alert has been dispatched via email and SMS",
          });
        } else if (!smsData.configured) {
          toast({
            title: "Email sent, SMS failed",
            description: smsData.errorMessage || "Twilio is not properly configured. Only email was sent.",
            variant: "destructive"
          });
        } else if (smsData.errorMessage) {
          toast({
            title: "Email sent, SMS failed",
            description: smsData.errorMessage || "There was an issue sending SMS alerts. Check your Twilio configuration.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Email sent, SMS issue",
            description: "There was an issue sending SMS alerts. Check the logs for details.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Email alert sent",
          description: "Crisis alert email has been dispatched successfully.",
        });
      }
      
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

  return {
    activeTab,
    setActiveTab,
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
  };
};
