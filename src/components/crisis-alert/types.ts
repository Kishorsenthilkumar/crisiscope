
export type CrisisType = 'drought' | 'economic' | 'political' | 'social' | 'other';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'extreme';
export type ActiveTab = 'email' | 'sms';

export interface CrisisEmailAlertProps {
  crisisType?: CrisisType;
  regionName?: string;
  severity?: SeverityLevel;
}

export interface EmailFormData {
  email: string;
  subject: string;
  message: string;
  sendToAuthorities: boolean;
  sendToNGOs: boolean;
  sendToMedia: boolean;
}

export interface SmsFormData {
  enableSms: boolean;
  phoneNumbers: string[];
  sendToAuthorities: boolean;
  sendToNGOs: boolean;
  sendToMedia: boolean;
}
