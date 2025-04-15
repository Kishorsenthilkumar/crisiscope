
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { SmsFormData } from './types';

interface SmsFormProps {
  formData: SmsFormData;
  onSmsEnableChange: (enabled: boolean) => void;
  onPhoneChange: (index: number, value: string) => void;
  onAddPhone: () => void;
  onRemovePhone: (index: number) => void;
  onAuthoritiesChange: (checked: boolean) => void;
  onNGOsChange: (checked: boolean) => void;
  onMediaChange: (checked: boolean) => void;
}

export const SmsForm: React.FC<SmsFormProps> = ({
  formData,
  onSmsEnableChange,
  onPhoneChange,
  onAddPhone,
  onRemovePhone,
  onAuthoritiesChange,
  onNGOsChange,
  onMediaChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="enable-sms" className="text-sm font-medium">
          Enable SMS Alerts
        </Label>
        <Switch
          id="enable-sms"
          checked={formData.enableSms}
          onCheckedChange={onSmsEnableChange}
        />
      </div>
      
      {formData.enableSms && (
        <>
          <div className="space-y-3">
            <Label className="text-sm font-medium block">
              Phone Numbers
            </Label>
            {formData.phoneNumbers.map((phone, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-grow">
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    value={phone}
                    onChange={(e) => onPhoneChange(index, e.target.value)}
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onRemovePhone(index)}
                  disabled={formData.phoneNumbers.length <= 1}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddPhone}
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
                  checked={formData.sendToAuthorities}
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                      onAuthoritiesChange(checked);
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
                  checked={formData.sendToNGOs}
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                      onNGOsChange(checked);
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
                  checked={formData.sendToMedia}
                  onCheckedChange={(checked) => {
                    if (typeof checked === 'boolean') {
                      onMediaChange(checked);
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
    </div>
  );
};
